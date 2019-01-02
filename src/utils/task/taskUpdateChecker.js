import * as taskRequests from "src/requests/taskRequests";
import requestRun from "src/utils/request/requestRun";

/*
- Fetch the list periodically 120 sec
- Fetch an item until change is reflected 1,5 (max 180 sec, then wipe)

Set an optimistic value
Fetch an item periodically until value has changed for item
Clear optimistic value
*/

// If no update has happened after this time, clear the optimist and use server.
const MAX_TIME_BEFORE_CLEAR = 1000 * 60 * 3; // 3 minutes

class TaskUpdateChecker {
    constructor() {
        this.checkUpdates = {};
        this.timers = {};
    }
    setStore(store) {
        this.store = store;
        this.store.subscribe(e => {
            const state = this.store.getState();
            for (let id in this.checkUpdates) {
                const item = this.checkUpdates[id];
                const taskInStore = state.cache.tasks[id];
                const updatedAt = taskInStore.lastChangedEvent
                    ? taskInStore.lastChangedEvent.timestamp
                    : null;

                if (updatedAt !== item.updatedAt) {
                    // We got an update!
                    this.clearAndCancelPlannedAttempt(id);
                }
            }
        });
    }
    clearAndCancelPlannedAttempt(id) {
        clearTimeout(this.timers[id]);
        const item = this.checkUpdates[id];
        if (item) {
            item.optimist.unset("state");
            item.optimist.unset("movedState");
            delete this.checkUpdates[id];
        }
    }
    planNextAttempt(id) {
        const item = this.checkUpdates[id];
        if (!item) return;
        item.attempts++; // Add a new attempt.

        // If too many attempts, wipe optimist
        if (new Date().getTime() - item.startTime > MAX_TIME_BEFORE_CLEAR) {
            this.clearAndCancelPlannedAttempt(id);
            return;
        }

        // Make sure to cancel any existing timers.
        clearTimeout(this.timers[id]);

        const timer = this.getTimeForAttempt(item.attempts);
        this.timers[id] = setTimeout(this.fetchUpdateForId.bind(this, item.citizenId, id), timer);
    }
    getTimeForAttempt(attempts) {
        switch (attempts) {
            case 1:
                return 1000;
            case 2:
                return 3000;
            case 3:
                return 10000;
            default:
                return 20000;
        }
    }
    checkUpdatesForTask(task, optimist) {
        console.log("checking ts", task, task.lastChangedEvent);

        this.checkUpdates[task.id] = {
            citizenId: task.citizenId,
            optimist,
            updatedAt: task.lastChangedEvent ? task.lastChangedEvent.timestamp : null,
            startTime: new Date().getTime(),
            attempts: 0
        };

        this.planNextAttempt(task.id);
    }
    fetchUpdateForId(citizenId, taskId) {
        requestRun(taskRequests.getById(citizenId, taskId), err => {
            this.planNextAttempt(taskId);
        }).then(res => {
            this.planNextAttempt(taskId);
        });
    }
}

const taskUpdateChecker = new TaskUpdateChecker();
export default taskUpdateChecker;

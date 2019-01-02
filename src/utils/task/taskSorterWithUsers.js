import { timeHelper } from 'src/utils/time/TimeHelper';

const values = (object) => Object.keys(object).map((key) => object[key]);

export default (tasks, users) => values(tasks).sort((a, b) => {
  const aStartTime = timeHelper.parseZonedDateTime(a.plannedExecutionSlot.after, a.plannedExecutionSlot.timeZone);
  const bStartTime = timeHelper.parseZonedDateTime(b.plannedExecutionSlot.after, b.plannedExecutionSlot.timeZone);

  if (aStartTime.isSame(bStartTime)) {
      const aEndTime = timeHelper.parseZonedDateTime(a.plannedExecutionSlot.before, a.plannedExecutionSlot.timeZone);
      const bEndTime = timeHelper.parseZonedDateTime(b.plannedExecutionSlot.before, b.plannedExecutionSlot.timeZone);
      if (aEndTime.isSame(bEndTime)) {
          const aName = users[a.citizenId].displayName;
          const bName = users[b.citizenId].displayName;
          return aName.localeCompare(bName); // is aName sorted after bName?
      }
      return aEndTime.isBefore(bEndTime) ? -1 : 1;
  }
  return aStartTime.isBefore(bStartTime) ? -1 : 1;
})
export default (
    sortedTasks,
    users,
    { citizenIds, departmentIds, citizensIsActive, professionIds, categoryIds }
) => {
    return sortedTasks.filter(task => {
        /* 
          The filtering works for the concept of proving it wrong.
          Assuming that a task should be there, and then going trough each
          condition, returning false if it's not there.
        */
        // We use citizensIsActive to determine whether we should filter on departments or citizens.
        if (citizensIsActive) {
            if (citizenIds.length && citizenIds.indexOf(task.citizenId) === -1) {
                return false;
            }
        } else {
            const dId = users[task.citizenId].node.departmentId;
            if (departmentIds.length && departmentIds.indexOf(dId) === -1) {
                return false;
            }
        }
        if (professionIds.length && professionIds.indexOf(task.professionId) === -1) {
            return false;
        }
        if (categoryIds.length) {
            let hadOneOfTheCategories = false;
            categoryIds.forEach(catId => {
                if (task[catId] || task.categoryIds.indexOf(catId) > -1) {
                    hadOneOfTheCategories = true;
                }
            });

            if (!hadOneOfTheCategories) {
                return false;
            }
        }
        return true;
    });
};

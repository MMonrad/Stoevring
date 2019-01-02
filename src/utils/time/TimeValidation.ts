import { timeHelper } from 'src/utils/time/TimeHelper';

export const isChosenDateSameOrAfterStartDate = (startDate: string, chosenDate: string, timezone: string): boolean => {
    console.log(startDate, chosenDate, timezone);
    const originalAsDate = timeHelper.parseZonedDate(startDate, timezone);
    const chosenAsDate = timeHelper.parseZonedDate(chosenDate, timezone);
    if(chosenAsDate >= originalAsDate) {
        return true;
    }
    return false;
}
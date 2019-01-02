import * as moment from "moment-timezone";
import { SerializedZonedDateTime } from "src/utils/time/SerializedZonedDateTime";
import { SerializedZonedDate } from "src/utils/time/SerializedZonedDate";
import { String } from "src/utils/stringExtensions";

export class timeHelper
{
    public static extendedIsoPattern = "YYYY-MM-DDTHH:mm:ss.SSSSSSSSS";
    public static localDateIsoPattern = "YYYY-MM-DD";

    public static serializeTimestamp(instant: moment.Moment): string
    {
        if (!instant.isValid())
            throw new Error("Invalid timestamp provided");

        return instant.utc().format(timeHelper.extendedIsoPattern).toString() + "Z";
    }

    public static parseTimestamp(str: string): moment.Moment
    {
        if (str.substr(-1).toUpperCase() !== "Z")
            throw new Error("Invalid timestamp string provided");

        str = str.substr(0, str.length - 1);
        
        return moment.utc(str, timeHelper.extendedIsoPattern);
    }

    public static serializeZonedDateTime(zdt: moment.Moment): SerializedZonedDateTime
    {
        if (!zdt.isValid() || !zdt.tz())
            throw new Error("Invalid zonedDateTime provided");

        const serializedZonedDateTime = new SerializedZonedDateTime();
        serializedZonedDateTime.dateTime = zdt.format(timeHelper.extendedIsoPattern);
        serializedZonedDateTime.timeZone = zdt.tz();

        return serializedZonedDateTime;
    }

    public static parseZonedDateTime(str: string, timezone: string): moment.Moment
    {
        if (String.isNullOrWhiteSpace(timezone) || !moment.tz.zone(timezone))
            throw new Error("Invalid timezone provided");

        return moment.tz(str, timeHelper.extendedIsoPattern, timezone);
    }
    
    public static serializeZonedDate(zdt: moment.Moment): SerializedZonedDate
    {
        if (!zdt.isValid() || !zdt.tz())
            throw new Error("Invalid zonedDate provided");

        const serializedZonedDate = new SerializedZonedDate();
        serializedZonedDate.date = zdt.format(timeHelper.localDateIsoPattern);
        serializedZonedDate.timeZone = zdt.tz();

        return serializedZonedDate;
    }

    public static parseZonedDate(str: string, timezone: string): moment.Moment
    {
        if (String.isNullOrWhiteSpace(timezone) || !moment.tz.zone(timezone))
            throw new Error("Invalid timezone provided");

        return moment.tz(str, timeHelper.localDateIsoPattern, timezone);
    }
}
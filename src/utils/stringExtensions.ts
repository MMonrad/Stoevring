export class String
{
    public static isNullOrWhiteSpace(value : string) : boolean
    {
        if(typeof value !== "string")
            return true;       

        if (value === undefined || value === null)
            return true;

        return value.replace(/\s/g, '').length < 1;
    }
}
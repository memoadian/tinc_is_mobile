export const shortNameMonths = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
];

export function getFirstDayOfMonth(date: Date): string {
    var month = date.getMonth() + 1;
    return date.getFullYear()+"-"+(month < 10 ? "0"+month : month)+"-"+"00";
}

export function getLastDayOfMonth(date: Date): string {
    var month = date.getMonth() + 1;
    return date.getFullYear()+"-"+(month < 10 ? "0"+month : month )+"-"+"32";    
}

export function addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}

export function simpleDateFormat(date: Date): string {
    return date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2)
}

export function simpleDateFormatddmmyyyy(date: Date): string {
    return ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()
}

export function geDate(date: string | null | undefined)
{
    if (date== "0000-00-00" || date== "" || date == null || date == undefined)
        return new Date()
    else
        return new Date(date)
}

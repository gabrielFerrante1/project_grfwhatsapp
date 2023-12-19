export const formatDateTimeToDate = (value: string) => {
    const date = value.slice(0, -6)
    const now_date = new Date()

    // Checking if the dates are exactly the same 
    if (date == `${now_date.getDate()}/${now_date.getMonth() + 1}/${now_date.getFullYear()}`) {
        return value.slice(11)
    }

    return date;
}

export const formatDateTimeToTime = (value: string) => {

    return value.slice(11);
}
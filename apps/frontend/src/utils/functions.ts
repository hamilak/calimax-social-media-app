export const truncateDescription = (
    description: string,
    wordLimit: number
): string => {
    const words = description?.split(' ')
    if (words?.length <= wordLimit) {
        return description
    }
    return words?.slice(0, wordLimit).join(' ') + '...'
}

export const convertDate = (date: Date) => {
    const convertedDate = new Date(date)
    const formattedDate = convertedDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
    return formattedDate
}
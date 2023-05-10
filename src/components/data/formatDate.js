export const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        // timeZoneName: 'short',
    }).format(dateObj);

    return formattedDate;
};

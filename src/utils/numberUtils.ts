export const getReadableNumber = (num: number) => {
    if (num < 1000) {
        if (num % 1 !== 0) {
            return num.toFixed(2);
        }
        return num;
    }
    if (num < 1000000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    if (num < 1000000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    return (num / 1000000000).toFixed(2) + 'B';
}
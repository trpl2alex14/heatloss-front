//1 товар
//2, 3, 4 товара
//5 - ... товаров
export function plural(value: number, words: string[], viewCount = false): string {
    let result = viewCount ? value + ' ' : '';
    if (value % 10 === 1 && value % 100 !== 11) result += words[0];
    else if (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20)) result += words[1];
    else result += words[2];

    return result;
}

export function endsWith(str: string, suffix: string): boolean {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

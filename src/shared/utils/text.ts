//1 товар
//2, 3, 4 товара
//5 - ... товаров
export function plural(value: number, words: string[], viewCount = false): string {
    let result = viewCount ? value + ' ' : '';
    if (value % 10 === 1) result += words[0];
    else if (value % 10  > 1 && value % 10  < 5) result += words[1];
    else result += words[2];

    return result;
}
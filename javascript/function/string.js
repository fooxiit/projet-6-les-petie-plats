export function stringContain(string, search) {
    let startIndex = 0;
    let endIndex = startIndex + search.length;
    while (endIndex < string.length + 1) {
        const subString = sliceString(string, startIndex, endIndex);
        if (subString === search) return true;
        startIndex++;
        endIndex = startIndex + search.length;
    }
    return false;
}

export function sliceString(string, startIndex, endIndex) {
    if (endIndex <= startIndex) throw new Error('invalid index combinaison');
    if (endIndex > string.length) throw new Error('endIndex out of  range');
    let subString = '';
    for (let index = startIndex; index < endIndex; index++) {
        subString += string[index];
    }
    return subString;
}

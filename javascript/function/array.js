export function arrayReduce(array, callBack, accumulateur) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        accumulateur = callBack(accumulateur, element, index);
    }
    return accumulateur;
}

export function mapArray(array, callBack) {
    const map = [];
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        map.push(callBack(element, index));
    }
    return map;
}

export function filterArray(array, callBack) {
    const filtredArray = [];
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (callBack(element, index)) filtredArray.push(element);
    }
    return filtredArray;
}

export function forEachElementInArray(array, callBack) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        callBack(element, index);
    }
}

export function findInArray(array, callBack) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (callBack(element, index)) return [true, element, index];
    }
    return [false, null, -1];
}

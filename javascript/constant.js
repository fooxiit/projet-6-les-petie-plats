export const tagType = {
    ingredients: 'ingredients',
    appliance: 'appliance',
    ustensils: 'ustensils',
};

export const stopWords = await fetchStopWords();

async function fetchStopWords() {
    const stopWords = await (await fetch('./data/stop_words_french.json')).json();
    return new Set(stopWords);
}

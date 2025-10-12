export function parseHttml(string) {
    const wapper = document.createElement('div');
    wapper.innerHTML = string;
    return wapper.firstElementChild;
}

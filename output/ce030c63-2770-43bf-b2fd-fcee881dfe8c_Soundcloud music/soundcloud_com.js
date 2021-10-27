function main() {
    return fetch('https://soundcloud.com/').then((res) => {
        return res.headers;
    });
}
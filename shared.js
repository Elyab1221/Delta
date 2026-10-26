
const HUB_LEVELS = {
    snake: ['easy', 'medium', 'hard'],
    tetris: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};
function hubGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function hubSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { }
}
function getLevelFromUrl(game) {
    const raw = new URLSearchParams(window.location.search).get('level');
    const found = HUB_LEVELS[game].find((level) => String(level) === raw);
    return found !== undefined ? found : HUB_LEVELS[game][0];
}

function getHighScore(game, level) {
    return Number(hubGet(`hub-best-${game}-${level}`)) || 0;
}
function saveHighScore(game, level, score) {
    if (score > getHighScore(game, level)) {
        hubSet(`hub-best-${game}-${level}`, String(score));
        return true;
    }
    return false;
}
const snakeBaseMs = { easy: 150, medium: 100, hard: 65 };
function snakeSpeedMs(level, score = 0) {
    const base = snakeBaseMs[level];
    return Math.max(base * 0.5, base - score * 2);
}
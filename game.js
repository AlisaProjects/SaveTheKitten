const $ = id => document.getElementById(id);

window.Game = window.Game || {
    state: null
};

Game.init = function () {
    // Initialize game variables and state
    const levels = Math.floor(Math.random() * 100) + 1; // Random number of levels between 1 and 5

    this.state = {
        levels,
        kittenSits: Math.floor(Math.random() * levels) + 1,
        tries: 10,
        guesses: [],
        status: 'playing',
        message: '',
    };
    $('levels-value').textContent = `(1-${levels})`;
    $('level-input').value = '';
    this.render();
    $('level-input').focus();
}

Game.check = function (level) {
    const s = this.state;
    if (s.status !== 'playing') return;
    if (!(level >= 1 && level <= s.levels)) {
        s.message = `Введіть число від 1 до ${s.levels}`;
        return this.render();
    }
    if (level === s.kittenSits) {
        s.status = 'won';
        s.message = 'Вітаємо! Ви врятували кошеня! 🐱';
    } else {
        const hint = level < s.kittenSits ? 'вище ⬆' : 'нижче ⬇';
        s.guesses.push({ level, hint });
        if (s.guesses.length >= s.tries) {
            s.status = 'lost';
            s.message = `Ви програли! Кошеня було на ${s.kittenSits} поверсі.`;
        } else {
            s.message = `Невірно! Кошеня ${hint}.`;
        }
    }
    this.render();
}

Game.render = function () {
    const s = this.state;
    $('start-screen').hidden = s !== null;
    $('game-container').hidden = s === null;
    if (!s) return;

    $('msg').textContent = s.message;
    $('msg').className = s.status;
    $('level-input').value = '';
    $('level-input').max = s.levels;
    $('level-input').min = 1;
    $('level-input').disabled = s.status !== 'playing';
    $('check-button').disabled = s.status !== 'playing';
    $('tries').textContent = `Спроби: ${s.guesses.length}/${s.tries}`;
    $('history').innerHTML = s.guesses
        .map(g => `<li>Поверх ${g.level}: ${g.hint}</li>`).join('');
    $('restart').hidden = s.status === 'playing';
}

$('start-button').addEventListener('click', () => Game.init());
$('restart').addEventListener('click', () => Game.init());
$('guess-form').addEventListener('submit', e => {
    e.preventDefault();
    Game.check(Number($('level-input').value));
});
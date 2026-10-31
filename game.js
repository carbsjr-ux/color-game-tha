const COLORS = [
    { name: 'Red', hex: '#ff4d4d' },
    { name: 'Blue', hex: '#4d94ff' },
    { name: 'Yellow', hex: '#ffff4d' },
    { name: 'Green', hex: '#4dff4d' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Pink', hex: '#ff4dff' }
];

let coins = 100;
let bets = {};

const board = document.getElementById('board');
const coinDisplay = document.getElementById('coin-count');
const rollBtn = document.getElementById('roll-btn');
const message = document.getElementById('message');

COLORS.forEach(color => {
    const div = document.createElement('div');
    div.className = 'color-spot';
    div.style.backgroundColor = color.hex;
    div.innerHTML = `<span style="color: #000; font-weight: bold;">${color.name}</span><div class="bet-amount" id="bet-${color.name}">0</div>`;
    div.onclick = () => {
        if (coins > 0) {
            bets[color.name]++;
            coins--;
            updateUI();
        }
    };
    board.appendChild(div);
    bets[color.name] = 0;
});

function updateUI() {
    coinDisplay.innerText = coins;
    for (let color in bets) {
        document.getElementById(`bet-${color}`).innerText = bets[color];
        const spot = Array.from(document.querySelectorAll('.color-spot')).find(el => el.innerText.includes(color));
        if (bets[color] > 0) spot.classList.add('active');
        else spot.classList.remove('active');
    }
}

rollBtn.onclick = () => {
    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
    if (totalBet === 0) return;

    rollBtn.disabled = true;
    const diceElements = document.querySelectorAll('.die');
    diceElements.forEach(d => d.classList.add('rolling'));

    setTimeout(() => {
        const results = [];
        diceElements.forEach(d => {
            d.classList.remove('rolling');
            const res = COLORS[Math.floor(Math.random() * COLORS.length)];
            results.push(res.name);
            d.style.backgroundColor = res.hex;
            d.innerText = '';
        });

        let win = 0;
        let returned = 0;
        for (let color in bets) {
            if (bets[color] > 0) {
                const matches = results.filter(r => r === color).length;
                if (matches > 0) {
                    returned += bets[color];
                    win += (bets[color] * matches);
                }
                bets[color] = 0;
            }
        }
        coins += (returned + win);
        message.innerText = `Rolled: ${results.join(', ')}. Gained: ${returned + win}`;
        if (coins === 0) message.innerHTML += '<br><button onclick="location.reload()">Reset</button>';
        updateUI();
        rollBtn.disabled = false;
    }, 800);
};

// --- 1. НАСТРОЙКИ БАЛАНСА И СЕКТОРОВ ---
let investMoney = 100000; // Стартовая сумма для инвестиций (в тенге)

const sectors = [
  { label: "+50 000 ₸",  delta: 50000,   color: "#16a34a" },
  { label: "ПУСТО",      delta: 0,       color: "#1e293b" },
  { label: "x2 БАНК",    delta: "x2",    color: "#ca8a04" },
  { label: "-50% РИСК",  delta: -0.5,    color: "#dc2626" },
  { label: "+25 000 ₸",  delta: 25000,   color: "#2563eb" },
  { label: "ВЫСТРЕЛ 0",  delta: "reset", color: "#7f1d1d" }
];

const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");
const balanceEl = document.getElementById("investBalance");

let currentAngle = 0;
let isSpinning = false;

// Форматирование денег
function updateBalanceUI() {
  balanceEl.textContent = investMoney.toLocaleString("ru-RU") + " ₸";
}

// Отрисовка барабана
function drawWheel() {
  const numSectors = sectors.length;
  const arc = (2 * Math.PI) / numSectors;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx - 4;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSectors; i++) {
    const angle = currentAngle + i * arc;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + arc);
    ctx.closePath();
    ctx.fillStyle = sectors[i].color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.stroke();

    // Текст на секторе
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(sectors[i].label, radius - 18, 5);
    ctx.restore();
  }

  // Центральная ось барабана
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#facc15";
  ctx.stroke();
}

// Вращение барабана
spinBtn.addEventListener("click", () => {
  if (isSpinning) return;
  if (investMoney <= 0) {
    investMoney = 100000; // Автопополнение при обнулении
    updateBalanceUI();
  }

  isSpinning = true;
  spinBtn.disabled = true;
  resultText.textContent = "Барабан вращается...";

  const extraSpins = (5 + Math.random() * 4) * 2 * Math.PI;
  const targetAngle = currentAngle + extraSpins;
  const duration = 3800;
  const startTime = performance.now();
  const startAngle = currentAngle;

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Плавное замедление (easeOutCubic)
    const ease = 1 - Math.pow(1 - progress, 3);
    currentAngle = startAngle + (targetAngle - startAngle) * ease;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = false;
      resolveSector();
    }
  }

  requestAnimationFrame(animate);
});

// Расчёт выпавшего сектора (указатель сверху на -PI/2)
function resolveSector() {
  const numSectors = sectors.length;
  const arc = (2 * Math.PI) / numSectors;
  const normalized = ((1.5 * Math.PI - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const index = Math.floor(normalized / arc);
  const won = sectors[index];

  if (won.delta === "x2") {
    investMoney *= 2;
  } else if (won.delta === "reset") {
    investMoney = 0;
  } else if (won.delta === -0.5) {
    investMoney = Math.floor(investMoney * 0.5);
  } else {
    investMoney = Math.max(0, investMoney + won.delta);
  }

  updateBalanceUI();
  resultText.textContent = `Выпало: ${won.label}`;
}

// --- 2. ТАЙМЕР НАСТРОЕНИЙ ---
const moods = [
  "🔥 Азарт и драйв",
  "🧊 Холодный расчёт",
  "⚡ Высокий риск",
  "🍀 Полоса везения"
];
let moodIndex = 0;
let secondsLeft = 300; // 5 минут на фазу настроения

const timerEl = document.getElementById("moodTimer");
const moodLabelEl = document.getElementById("moodLabel");

setInterval(() => {
  secondsLeft--;
  if (secondsLeft < 0) {
    secondsLeft = 300;
    moodIndex = (moodIndex + 1) % moods.length;
    moodLabelEl.textContent = moods[moodIndex];
  }
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  timerEl.textContent = `${mins}:${secs}`;
}, 1000);

// Инициализация
updateBalanceUI();
drawWheel();
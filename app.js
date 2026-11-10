const parts = [
  {
    kicker: "Parte 1",
    title: "Indovina il lavoro!",
    instruction: "看图和句子，选择正确的职业。",
    type: "choice",
    illustrated: true,
    questions: [
      { prompt: "Anna ha un’azienda.\nQuindi è...", options: ["un’infermiera", "un’imprenditrice", "una commessa"], answer: 1, job: "imprenditrice", tip: "imprenditore = 男企业家 / imprenditrice = 女企业家", prop: "briefcase", color: "#fbe9c8" },
      { prompt: "Giulio lavora in una fabbrica.\nFa i vestiti. Quindi è...", options: ["un operaio", "un impiegato", "un commerciante"], answer: 0, job: "operaio", tip: "operaio = 男工人 / operaia = 女工人", prop: "gear", color: "#dfeee9" },
      { prompt: "Maria lavora in un negozio di abbigliamento.\nQuindi è...", options: ["una commessa", "una parrucchiera", "un’insegnante"], answer: 0, job: "commessa", tip: "commesso = 男店员 / commessa = 女店员", prop: "shirt", color: "#f8e1e4" },
      { prompt: "Luca lavora in un ristorante.\nCucina tutti i giorni. Quindi è...", options: ["un cameriere", "un cuoco", "un infermiere"], answer: 1, job: "cuoco", tip: "cuoco = 男厨师 / cuoca = 女厨师", prop: "pan", color: "#e6ecfa" },
      { prompt: "Sofia lavora in un salone di parrucchiere.\nQuindi è...", options: ["una parrucchiera", "un’estetista", "una commessa"], answer: 0, job: "parrucchiera", tip: "parrucchiere = 男理发师 / parrucchiera = 女理发师", prop: "scissors", color: "#efe2f5" },
      { prompt: "Marco lavora in un ospedale.\nAiuta i pazienti. Quindi è...", options: ["un infermiere", "un impiegato", "un cuoco"], answer: 0, job: "infermiere", tip: "infermiere = 男护士 / infermiera = 女护士", prop: "cross", color: "#dff1ed" },
      { prompt: "Laura lavora in una scuola.\nInsegna italiano. Quindi è...", options: ["una studentessa", "un’insegnante", "una cameriera"], answer: 1, job: "insegnante", tip: "insegnante 可指男老师或女老师", prop: "book", color: "#fff0c9" },
      { prompt: "Paolo lavora in ufficio.\nQuindi è...", options: ["un impiegato", "un operaio", "un parrucchiere"], answer: 0, job: "impiegato", tip: "impiegato = 男职员 / impiegata = 女职员", prop: "laptop", color: "#dfe9f5" },
      { prompt: "Chiara lavora in un centro estetico.\nQuindi è...", options: ["un’infermiera", "un’estetista", "una cuoca"], answer: 1, job: "estetista", tip: "estetista 可指男美容师或女美容师", prop: "bottle", color: "#f9e1ea" },
      { prompt: "Davide lavora in un bar.\nPorta da bere ai clienti. Quindi è...", options: ["un cameriere", "un insegnante", "un operaio"], answer: 0, job: "cameriere", tip: "cameriere = 男服务员 / cameriera = 女服务员", prop: "tray", color: "#e2f0de" }
    ]
  },
  {
    kicker: "Parte 2",
    title: "Dove lavora?",
    instruction: "根据职业，选择正确的工作地点。",
    type: "choice",
    questions: [
      { prompt: "Giulia è un’infermiera. Dove lavora?", options: ["In un ospedale", "In un ristorante", "In una scuola"], answer: 0, tip: "Un’infermiera lavora in un ospedale." },
      { prompt: "Luca è un cuoco. Dove lavora?", options: ["In un bar", "In un ristorante", "In un ufficio"], answer: 1, tip: "Un cuoco lavora in un ristorante." },
      { prompt: "Marta è una parrucchiera. Dove lavora?", options: ["In un salone di parrucchiere", "In un negozio di casalinghi", "In un’agenzia di viaggi"], answer: 0, tip: "Una parrucchiera lavora in un salone di parrucchiere." },
      { prompt: "Paolo è un operaio. Dove lavora?", options: ["In una fabbrica", "In un centro estetico", "In una scuola"], answer: 0, tip: "Un operaio lavora in una fabbrica." },
      { prompt: "Anna è una commessa. Dove lavora?", options: ["In un negozio di abbigliamento", "In un ospedale", "In un ufficio"], answer: 0, tip: "Una commessa lavora in un negozio di abbigliamento." },
      { prompt: "Francesca è un’insegnante. Dove lavora?", options: ["In una scuola", "In un bar", "In una fabbrica"], answer: 0, tip: "Un’insegnante lavora in una scuola." }
    ]
  },
  {
    kicker: "Parte 3",
    title: "Completa",
    instruction: "根据句子，写出正确的职业名称。大小写不影响答案。",
    type: "text",
    questions: [
      { prompt: "Anna ha un’azienda.\nAnna è un’", suffix: ".", answer: "imprenditrice", tip: "imprenditrice" },
      { prompt: "Giulio lavora in una fabbrica.\nGiulio è un", suffix: ".", answer: "operaio", tip: "operaio" },
      { prompt: "Maria lavora in un negozio di abbigliamento.\nMaria è una", suffix: ".", answer: "commessa", tip: "commessa" },
      { prompt: "Luca lavora in un ristorante. Cucina tutti i giorni.\nLuca è un", suffix: ".", answer: "cuoco", tip: "cuoco" }
    ]
  }
];

const state = {
  current: 0,
  unlocked: 0,
  checked: [false, false, false],
  answers: parts.map(part => Array(part.questions.length).fill(null)),
  results: parts.map(part => Array(part.questions.length).fill(null))
};

const panel = document.querySelector("#quiz-panel");
const liveRegion = document.querySelector("#live-region");
const stepButtons = [...document.querySelectorAll(".step")];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function normalize(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase("it");
}

function propSvg(type) {
  const props = {
    briefcase: '<rect x="72" y="65" width="30" height="24" rx="4" fill="#9b6545"/><path d="M80 65v-6h14v6M72 75h30" fill="none" stroke="#643f2b" stroke-width="3"/>',
    gear: '<circle cx="88" cy="73" r="17" fill="#7e9f9d"/><circle cx="88" cy="73" r="7" fill="#eaf4ef"/><path d="M88 51v8M88 87v8M66 73h8M102 73h8" stroke="#557a78" stroke-width="5"/>',
    shirt: '<path d="M73 57l10-5 7 7 7-7 10 5-6 12-6-3v25H79V66l-6 3z" fill="#e77682" stroke="#a94f5a" stroke-width="2"/>',
    pan: '<ellipse cx="88" cy="77" rx="18" ry="11" fill="#596267"/><path d="M105 77h20" stroke="#596267" stroke-width="7" stroke-linecap="round"/><path d="M76 72c2-9 20-9 24 0" fill="#f4b453"/>',
    scissors: '<circle cx="80" cy="81" r="7" fill="none" stroke="#745f8f" stroke-width="4"/><circle cx="97" cy="81" r="7" fill="none" stroke="#745f8f" stroke-width="4"/><path d="M84 76l22-22M93 76L73 55" stroke="#745f8f" stroke-width="4" stroke-linecap="round"/>',
    cross: '<rect x="78" y="58" width="20" height="39" rx="3" fill="#fff"/><rect x="69" y="67" width="38" height="20" rx="3" fill="#fff"/><rect x="84" y="62" width="8" height="31" fill="#e35f62"/><rect x="73" y="73" width="30" height="8" fill="#e35f62"/>',
    book: '<path d="M66 61q14-7 22 2v29q-8-8-22-2z" fill="#f4c94f"/><path d="M110 61q-14-7-22 2v29q8-8 22-2z" fill="#f0a94c"/><path d="M88 63v29" stroke="#956f32" stroke-width="2"/>',
    laptop: '<rect x="68" y="57" width="41" height="29" rx="3" fill="#728eae"/><rect x="73" y="62" width="31" height="19" fill="#dceaf3"/><path d="M63 88h51l-5 7H69z" fill="#526d89"/>',
    bottle: '<path d="M81 58h15v9l6 7v20H75V74l6-7z" fill="#dc8db2"/><rect x="82" y="51" width="13" height="9" rx="2" fill="#875f88"/><path d="M78 80h21" stroke="#fff" stroke-width="4"/>',
    tray: '<path d="M67 82h45" stroke="#607d61" stroke-width="5" stroke-linecap="round"/><path d="M71 80q3-22 19-22t18 22" fill="#f2c45e"/><circle cx="90" cy="55" r="3" fill="#607d61"/>'
  };
  return props[type] || "";
}

function illustration(question, index) {
  const skin = ["#e6ad83", "#b97851", "#f0bd91", "#8d5d42"][index % 4];
  const hair = ["#49372f", "#2f2b29", "#a66b39", "#563b2d"][index % 4];
  const shirt = ["#4d8b71", "#5679a6", "#d77961", "#806a9c"][index % 4];
  return `<div class="illustration" style="--illustration-bg:${question.color}" role="img" aria-label="Illustrazione: ${escapeHtml(question.job)}">
    <svg viewBox="0 0 140 115" aria-hidden="true" focusable="false">
      <circle cx="34" cy="22" r="15" fill="#fff" opacity=".55"/><circle cx="122" cy="95" r="24" fill="#fff" opacity=".4"/>
      <path d="M12 111q4-37 35-37t35 37" fill="${shirt}"/>
      <rect x="40" y="62" width="14" height="19" rx="6" fill="${skin}"/>
      <circle cx="47" cy="44" r="25" fill="${skin}"/>
      <path d="M23 44q0-30 25-30 26 1 24 31-10-6-13-19-11 14-36 18z" fill="${hair}"/>
      <circle cx="38" cy="46" r="2" fill="#3d322d"/><circle cx="56" cy="46" r="2" fill="#3d322d"/>
      <path d="M41 56q6 5 12 0" fill="none" stroke="#9c5a50" stroke-width="2" stroke-linecap="round"/>
      ${propSvg(question.prop)}
    </svg>
  </div>`;
}

function renderQuestion(question, index, part) {
  const result = state.results[state.current][index];
  const statusClass = result === true ? " is-correct" : result === false ? " is-wrong" : "";
  const feedback = result === true
    ? `<p class="feedback feedback--correct">✓ Bravissimo/a! 答对了。</p>`
    : result === false
      ? `<p class="feedback feedback--wrong">正确答案：<strong>${escapeHtml(part.type === "choice" ? question.options[question.answer] : question.answer)}</strong><br>${escapeHtml(question.tip)}</p>`
      : "";

  let answerControl;
  if (part.type === "choice") {
    answerControl = `<div class="options">${question.options.map((option, optionIndex) => `
      <label class="option">
        <input type="radio" name="q-${state.current}-${index}" value="${optionIndex}" ${state.answers[state.current][index] !== null && Number(state.answers[state.current][index]) === optionIndex ? "checked" : ""}>
        <span>${escapeHtml(option)}</span>
      </label>`).join("")}</div>`;
  } else {
    answerControl = `<label class="answer-line">
      <span>${escapeHtml(question.prompt)}</span>
      <input class="text-answer" type="text" data-index="${index}" value="${escapeHtml(state.answers[state.current][index] ?? "")}" autocomplete="off" autocapitalize="none" aria-label="Risposta ${index + 1}">
      <span>${escapeHtml(question.suffix)}</span>
    </label>`;
  }

  return `<article class="question${statusClass}" data-question="${index}">
    <div class="question__top">
      ${part.illustrated ? illustration(question, index) : ""}
      <span class="question__number">${index + 1}</span>
      <div class="question__body">
        ${part.type === "choice" ? `<p class="question__prompt">${escapeHtml(question.prompt)}</p>` : ""}
        ${answerControl}
        ${feedback}
      </div>
    </div>
  </article>`;
}

function render() {
  updateSteps();
  const part = parts[state.current];
  const wasChecked = state.checked[state.current];
  const score = state.results[state.current].filter(Boolean).length;
  panel.innerHTML = `
    <div class="part-heading">
      <div>
        <p class="part-kicker">${part.kicker}</p>
        <h2>${part.title}</h2>
        <p class="instruction">${part.instruction}</p>
      </div>
      <span class="counter">${part.questions.length} 题</span>
    </div>
    <div class="question-list">${part.questions.map((question, index) => renderQuestion(question, index, part)).join("")}</div>
    <div id="message-area"></div>
    ${wasChecked ? `<div class="score-card"><span class="score-card__number">${score}/${part.questions.length}</span><span>本部分得分 · Puoi modificare e controllare di nuovo.</span></div>` : ""}
    <div class="actions">
      <button class="button button--primary" type="button" id="check-button">Controlla · 检查答案</button>
      <button class="button button--secondary" type="button" id="restart-button">Ricomincia · 重新开始</button>
      ${wasChecked ? `<button class="button button--next" type="button" id="next-button">${state.current === parts.length - 1 ? "Vedi il risultato · 查看结果" : "Continua · 继续 →"}</button>` : ""}
    </div>`;
  bindPanelEvents();
}

function updateSteps() {
  stepButtons.forEach((button, index) => {
    button.disabled = index > state.unlocked;
    button.classList.toggle("is-active", index === state.current);
    button.classList.toggle("is-done", index < state.current || state.checked[index]);
    if (index === state.current) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
}

function saveVisibleAnswers() {
  const part = parts[state.current];
  if (part.type === "choice") {
    part.questions.forEach((_, index) => {
      const checked = panel.querySelector(`input[name="q-${state.current}-${index}"]:checked`);
      state.answers[state.current][index] = checked ? Number(checked.value) : null;
    });
  } else {
    panel.querySelectorAll(".text-answer").forEach(input => {
      state.answers[state.current][Number(input.dataset.index)] = input.value;
    });
  }
}

function checkAnswers() {
  saveVisibleAnswers();
  const part = parts[state.current];
  const missing = state.answers[state.current].some(answer => answer === null || normalize(answer) === "");
  if (missing) {
    const message = panel.querySelector("#message-area");
    message.innerHTML = '<p class="missing-message" role="alert">请先完成所有题目，再检查答案。</p>';
    message.scrollIntoView({ behavior: "smooth", block: "center" });
    liveRegion.textContent = "请先完成所有题目。";
    return;
  }
  state.results[state.current] = part.questions.map((question, index) => part.type === "choice"
    ? state.answers[state.current][index] === question.answer
    : normalize(state.answers[state.current][index]) === normalize(question.answer));
  state.checked[state.current] = true;
  state.unlocked = Math.max(state.unlocked, Math.min(state.current + 1, parts.length - 1));
  const score = state.results[state.current].filter(Boolean).length;
  render();
  liveRegion.textContent = `Hai ${score} risposte corrette su ${part.questions.length}.`;
  panel.querySelector(".score-card").scrollIntoView({ behavior: "smooth", block: "center" });
}

function restartPart() {
  const length = parts[state.current].questions.length;
  state.answers[state.current] = Array(length).fill(null);
  state.results[state.current] = Array(length).fill(null);
  state.checked[state.current] = false;
  render();
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  liveRegion.textContent = "Parte ricominciata.";
}

function goNext() {
  if (state.current === parts.length - 1) {
    renderFinish();
    return;
  }
  state.current += 1;
  render();
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindPanelEvents() {
  panel.querySelector("#check-button").addEventListener("click", checkAnswers);
  panel.querySelector("#restart-button").addEventListener("click", restartPart);
  panel.querySelector("#next-button")?.addEventListener("click", goNext);
  panel.querySelectorAll("input").forEach(input => input.addEventListener("keydown", event => {
    if (event.key === "Enter") event.preventDefault();
  }));
}

function renderFinish() {
  stepButtons.forEach(button => {
    button.disabled = false;
    button.classList.remove("is-active");
    button.classList.add("is-done");
    button.removeAttribute("aria-current");
  });
  panel.innerHTML = `<div class="finish">
    <span class="finish__icon" aria-hidden="true">🎉</span>
    <p class="part-kicker">Complimenti!</p>
    <h2>你完成了第3课职业词汇练习！</h2>
    <p>Hai finito! 你已经复习了职业名称、阴阳性变化和常见工作地点。</p>
    <div class="recap"><span>职业名称</span><span>阴阳性</span><span>工作地点</span></div>
    <button class="button button--primary" type="button" id="restart-all">Ricomincia tutto · 再做一次</button>
  </div>`;
  panel.querySelector("#restart-all").addEventListener("click", () => {
    state.current = 0;
    state.unlocked = 0;
    state.checked = [false, false, false];
    state.answers = parts.map(part => Array(part.questions.length).fill(null));
    state.results = parts.map(part => Array(part.questions.length).fill(null));
    render();
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  liveRegion.textContent = "Esercizio completato!";
}

stepButtons.forEach((button, index) => button.addEventListener("click", () => {
  if (index > state.unlocked) return;
  saveVisibleAnswers();
  state.current = index;
  render();
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}));

render();

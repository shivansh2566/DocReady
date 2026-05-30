let lang = 'en';
let strings = {};
let services = {};
let selectedService = null;
let answers = {};
let currentQuestionIndex = 0;

async function loadData() {
  const [strRes, svcRes] = await Promise.all([
    fetch(`lang/${lang}.json`),
    fetch('data/services.json')
  ]);
  strings = await strRes.json();
  services = await svcRes.json();
  renderHome();
}

async function switchLang() {
  lang = lang === 'en' ? 'te' : 'en';
  const strRes = await fetch(`lang/${lang}.json`);
  strings = await strRes.json();
  document.getElementById('lang-toggle').textContent = strings.lang_toggle;
  document.getElementById('app-name').textContent = strings.app_name;
  document.getElementById('app-tagline').textContent = strings.tagline;
  // Re-render current screen
  if (document.getElementById('screen-home').classList.contains('active')) renderHome();
  else if (document.getElementById('screen-question').classList.contains('active')) renderQuestion();
  else if (document.getElementById('screen-checklist').classList.contains('active')) renderChecklist();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function renderHome() {
  const container = document.getElementById('service-list');
  container.innerHTML = '';
  document.getElementById('home-title').textContent = strings.select_service;
  document.getElementById('home-sub').textContent = strings.select_service_sub;

  const icons = { passport: '🛂', drivinglicence: '🚗' };

  Object.entries(services).forEach(([key, svc]) => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
      <span class="service-icon">${icons[key]}</span>
      <span class="service-label">${lang === 'en' ? svc.label : svc.label_te}</span>
    `;
    card.onclick = () => startService(key);
    container.appendChild(card);
  });

  showScreen('screen-home');
}

function startService(key) {
  selectedService = key;
  answers = {};
  currentQuestionIndex = 0;
  renderQuestion();
}

function renderQuestion() {
  const svc = services[selectedService];
  const q = svc.questions[currentQuestionIndex];
  const total = svc.questions.length;

  document.getElementById('q-step').textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
  document.getElementById('q-text').textContent = lang === 'en' ? q.text : q.text_te;

  const optContainer = document.getElementById('q-options');
  optContainer.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = lang === 'en' ? opt.label : opt.label_te;
    btn.onclick = () => selectAnswer(q.id, opt.value);
    optContainer.appendChild(btn);
  });

  document.getElementById('q-back').textContent = '← ' + strings.back;
  document.getElementById('q-back').onclick = () => {
    if (currentQuestionIndex === 0) renderHome();
    else { currentQuestionIndex--; renderQuestion(); }
  };

  showScreen('screen-question');
}

function selectAnswer(questionId, value) {
  answers[questionId] = value;
  const svc = services[selectedService];
  if (currentQuestionIndex < svc.questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    renderChecklist();
  }
}

function renderChecklist() {
  const svc = services[selectedService];
  const key = Object.values(answers).join('_');
  const checklist = svc.checklists[key] || [];

  document.getElementById('cl-title').textContent = strings.your_checklist;
  document.getElementById('cl-sub').textContent = strings.checklist_sub;
  document.getElementById('cl-back').textContent = '← ' + strings.back;
  document.getElementById('cl-back').onclick = () => { currentQuestionIndex = svc.questions.length - 1; renderQuestion(); };
  document.getElementById('cl-reset').textContent = strings.reset;
  document.getElementById('cl-print').textContent = '🖨 ' + strings.print;
  document.getElementById('cl-whatsapp').textContent = '📤 ' + strings.share_whatsapp;

  const container = document.getElementById('checklist-items');
  container.innerHTML = '';

  checklist.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.innerHTML = `
      <div class="doc-name">${lang === 'en' ? item.doc : item.doc_te}</div>
      <div class="doc-type">${lang === 'en' ? item.type : item.type_te}</div>
      ${item.tip ? `<div class="doc-tip">💡 ${lang === 'en' ? item.tip : item.tip_te}</div>` : ''}
    `;
    container.appendChild(div);
  });

  document.getElementById('cl-whatsapp').onclick = () => shareWhatsApp(checklist, svc);
  document.getElementById('cl-print').onclick = () => window.print();
  document.getElementById('cl-reset').onclick = () => { selectedService = null; answers = {}; renderHome(); };

  showScreen('screen-checklist');
}

function shareWhatsApp(checklist, svc) {
  const svcName = lang === 'en' ? svc.label : svc.label_te;
  let text = `📋 *DocReady — ${svcName}*\n\nDocuments to carry:\n\n`;
  checklist.forEach((item, i) => {
    text += `${i + 1}. ${lang === 'en' ? item.doc : item.doc_te} — ${lang === 'en' ? item.type : item.type_te}\n`;
    if (item.tip) text += `   💡 ${lang === 'en' ? item.tip : item.tip_te}\n`;
  });
  text += '\n_Generated by DocReady_';
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

document.getElementById('lang-toggle').onclick = switchLang;
loadData();

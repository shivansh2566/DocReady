/* ═══════════════════════════════════════════
   DocReady — app.logic.js
   Pure logic extracted from app.js for testing.
   No DOM references here — safe to run in Node.
═══════════════════════════════════════════ */

const SERVICES = [
  {id:'passport', icon:'🛂', name:'Passport',          desc:'Fresh / Renewal',       badge:'',           needsState:false},
  {id:'dl',       icon:'🪪', name:'Driving Licence',   desc:'New / Renewal',          badge:'',           needsState:false},
  {id:'ration',   icon:'🏠', name:'Ration Card',        desc:'New / Update',           badge:'State-wise', needsState:true},
  {id:'voterid',  icon:'🗳️', name:'Voter ID',           desc:'New / Correction',       badge:'',           needsState:false},
  {id:'income',   icon:'📄', name:'Income Certificate', desc:'For self or family',     badge:'State-wise', needsState:true},
  {id:'caste',    icon:'📜', name:'Caste Certificate',  desc:'SC / ST / OBC / EWS',   badge:'State-wise', needsState:true},
];

const QUESTIONS = {
  passport:[
    {id:'type', text:'Are you applying for a fresh passport or renewal?', options:[
      {value:'fresh',   label:'Fresh Passport'},
      {value:'renewal', label:'Renewal'},
    ]},
    {id:'age', text:'Who is the applicant?', options:[
      {value:'adult', label:'Adult (18+ years)'},
      {value:'minor', label:'Minor (below 18)'},
    ]},
    {id:'speed', text:'Which type of passport service?', options:[
      {value:'normal', label:'Normal (Non-Tatkal)'},
      {value:'tatkal', label:'Tatkal'},
    ]},
  ],
  dl:[
    {id:'type', text:'What are you applying for?', options:[
      {value:'learner',   label:"Learner's Licence (LL)"},
      {value:'permanent', label:'Permanent Driving Licence'},
      {value:'renewal',   label:'Renewal of existing DL'},
    ]},
    {id:'vehicle', text:'Which type of vehicle?', options:[
      {value:'two',  label:'Two-Wheeler'},
      {value:'four', label:'Four-Wheeler / LMV'},
      {value:'both', label:'Both'},
    ]},
  ],
  ration:[
    {id:'type', text:'What do you need?', options:[
      {value:'new',    label:'New Ration Card'},
      {value:'update', label:'Update / Correction'},
      {value:'add',    label:'Add a new member'},
    ]},
    {id:'category', text:'Which category?', options:[
      {value:'apl', label:'APL'},
      {value:'bpl', label:'BPL'},
      {value:'aay', label:'AAY / Antyodaya'},
    ]},
  ],
  voterid:[
    {id:'type', text:'What are you applying for?', options:[
      {value:'fresh',      label:'Fresh Registration (Form 6)'},
      {value:'correction', label:'Name / Address Correction (Form 8)'},
      {value:'transfer',   label:'Transfer of Polling Booth (Form 8A)'},
      {value:'duplicate',  label:'Duplicate EPIC Card'},
    ]},
    {id:'age', text:'How old is the applicant?', options:[
      {value:'first', label:'First-time voter (18–20 yrs)'},
      {value:'adult', label:'Adult (21+ years)'},
    ]},
  ],
  income:[
    {id:'purpose', text:'Why do you need the Income Certificate?', options:[
      {value:'scholarship', label:'Scholarship / Education'},
      {value:'scheme',      label:'Government Scheme'},
      {value:'legal',       label:'Legal / Court purpose'},
      {value:'other',       label:'Other purpose'},
    ]},
    {id:'applicant', text:'Who is the certificate for?', options:[
      {value:'self',   label:'For myself'},
      {value:'family', label:'For family / household'},
    ]},
  ],
  caste:[
    {id:'category', text:'Which category certificate?', options:[
      {value:'sc',  label:'SC (Scheduled Caste)'},
      {value:'st',  label:'ST (Scheduled Tribe)'},
      {value:'obc', label:'OBC (Other Backward Class)'},
      {value:'ews', label:'EWS (Economically Weaker Section)'},
    ]},
    {id:'type', text:'Fresh or duplicate?', options:[
      {value:'fresh',     label:'Fresh Application'},
      {value:'duplicate', label:'Duplicate / Reissue'},
    ]},
  ],
};

/**
 * Filter services by search term.
 * @param {string} filter
 * @returns {Array}
 */
function filterServices(filter) {
  const f = (filter || '').toLowerCase();
  if (!f) return SERVICES;
  return SERVICES.filter(s =>
    s.name.toLowerCase().includes(f) || s.desc.toLowerCase().includes(f)
  );
}

/**
 * Check whether all questions for a service are answered.
 * @param {string} serviceId
 * @param {Object} answers
 * @returns {boolean}
 */
function allAnswered(serviceId, answers) {
  const qs = QUESTIONS[serviceId] || [];
  return qs.every(q => answers[q.id]);
}

/**
 * Build the checklist lookup key from answers.
 * @param {string} serviceId
 * @param {Object} answers
 * @param {string} [state]
 * @returns {string}
 */
function buildChecklistKey(serviceId, answers, state) {
  const qs = QUESTIONS[serviceId] || [];
  const base = qs.map(q => answers[q.id]).join('-');
  return state ? base + '-' + state : base;
}

/**
 * Resolve the best-matching checklist entry from the map.
 * @param {Object} map  - CHECKLISTS[serviceId]
 * @param {string} key  - full answer key
 * @returns {Object|null}
 */
function resolveChecklist(map, key) {
  if (!map) return null;
  // Exact match
  if (map[key]) return map[key];
  // Partial / fuzzy match
  const keys = Object.keys(map);
  for (const k of keys) {
    const parts    = k.split('-');
    const ansParts = key.split('-');
    const allMatch = parts.every((p, i) => !ansParts[i] || ansParts[i] === p);
    if (allMatch) return map[k];
  }
  // Fallback: first entry
  return map[keys[0]] || null;
}

/**
 * Count total and checked docs, return progress percentage.
 * @param {Object} checklistData - {required:[], optional:[]}
 * @param {Object} checked       - {key: bool}
 * @returns {{done:number, total:number, pct:number}}
 */
function calcProgress(checklistData, checked) {
  const total = (checklistData.required || []).length + (checklistData.optional || []).length;
  const done  = Object.values(checked).filter(Boolean).length;
  const pct   = total ? Math.round(done / total * 100) : 0;
  return { done, total, pct };
}

/**
 * Build the plain-text checklist for sharing.
 * @param {Object} service
 * @param {Object} answers
 * @param {Object} checklistData
 * @returns {string}
 */
function buildTextChecklist(service, answers, checklistData) {
  const qs = QUESTIONS[service.id] || [];
  let text = '📋 *DocReady — Document Checklist*\n';
  text += 'Service: *' + service.name + '*\n';
  qs.forEach(q => {
    const opt = q.options.find(o => o.value === answers[q.id]);
    if (opt) text += '• ' + opt.label + '\n';
  });
  text += '\n*Required Documents:*\n';
  (checklistData.required || []).forEach((d, i) => {
    text += (i + 1) + '. ' + d.doc + ' — ' + d.type + '\n';
    if (d.tip) text += '   💡 ' + d.tip + '\n';
  });
  if (checklistData.optional && checklistData.optional.length) {
    text += '\n*Optional Documents:*\n';
    checklistData.optional.forEach((d, i) => {
      text += (i + 1) + '. ' + d.doc + ' — ' + d.type + '\n';
    });
  }
  text += '\n_Generated by DocReady_';
  return text;
}

module.exports = {
  SERVICES,
  QUESTIONS,
  filterServices,
  allAnswered,
  buildChecklistKey,
  resolveChecklist,
  calcProgress,
  buildTextChecklist,
};

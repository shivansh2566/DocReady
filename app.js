/* ═══════════════════════════════════════════
   DocReady — app.js
   Government Document Checklist for India
═══════════════════════════════════════════ */

/* ────────────────────────────────────────────
   SERVICE DATA
──────────────────────────────────────────── */
const SERVICES = [
  {id:'passport', icon:'🛂', name:'Passport',          desc:'Fresh / Renewal',       badge:'',           needsState:false},
  {id:'dl',       icon:'🪪', name:'Driving Licence',   desc:'New / Renewal',          badge:'',           needsState:false},
  {id:'ration',   icon:'🏠', name:'Ration Card',        desc:'New / Update',           badge:'State-wise', needsState:true},
  {id:'voterid',  icon:'🗳️', name:'Voter ID',           desc:'New / Correction',       badge:'',           needsState:false},
  {id:'income',   icon:'📄', name:'Income Certificate', desc:'For self or family',     badge:'',           needsState:false},
  {id:'caste',    icon:'📜', name:'Caste Certificate',  desc:'SC / ST / OBC / EWS',   badge:'',           needsState:false},
];

/* Official portal links per service */
const PORTAL_LINKS = {
  passport: [{label:'Apply on Passport Seva', url:'https://www.passportindia.gov.in/'}],
  dl:       [{label:'Apply on Parivahan Portal', url:'https://parivahan.gov.in/'}],
  ration:   [{label:'NFSA Portal', url:'https://nfsa.gov.in/'}, {label:'Check on MeeSeva (TS)', url:'https://meeseva.telangana.gov.in/'}],
  voterid:  [{label:'Voter Portal (ECI)', url:'https://voters.eci.gov.in/'}],
  income:   [{label:'ServicePlus / eDistrict', url:'https://serviceonline.gov.in/'}, {label:'MeeSeva (Telangana)', url:'https://meeseva.telangana.gov.in/'}],
  caste:    [{label:'ServicePlus / eDistrict', url:'https://serviceonline.gov.in/'}, {label:'MeeSeva (Telangana)', url:'https://meeseva.telangana.gov.in/'}],
};

/* ────────────────────────────────────────────
   QUESTIONS DATA
──────────────────────────────────────────── */
const QUESTIONS = {
  passport:[
    {id:'type', text:'Are you applying for a fresh passport or renewal?', options:[
      {value:'fresh',   label:'Fresh Passport', hint:'First time applying'},
      {value:'renewal', label:'Renewal',         hint:'Already have a passport'},
    ]},
    {id:'age', text:'Who is the applicant?', options:[
      {value:'adult', label:'Adult (18+ years)',  hint:''},
      {value:'minor', label:'Minor (below 18)',   hint:'Additional parent documents needed'},
    ]},
    {id:'speed', text:'Which type of passport service do you need?', options:[
      {value:'normal', label:'Normal (Non-Tatkal)', hint:'30–45 working days'},
      {value:'tatkal', label:'Tatkal',               hint:'Faster, needs extra documents'},
    ]},
  ],
  dl:[
    {id:'type', text:'What are you applying for?', options:[
      {value:'learner',   label:"Learner's Licence (LL)",       hint:'First step before permanent licence'},
      {value:'permanent', label:'Permanent Driving Licence',    hint:'After holding LL for at least 30 days'},
      {value:'renewal',   label:'Renewal of existing DL',       hint:'Expired or expiring licence'},
    ]},
    {id:'vehicle', text:'Which type of vehicle?', options:[
      {value:'two',  label:'Two-Wheeler',      hint:'Motorcycle / Scooter'},
      {value:'four', label:'Four-Wheeler / LMV', hint:'Car / Jeep'},
      {value:'both', label:'Both',              hint:'Applying for both vehicle classes'},
    ]},
  ],
  ration:[
    {id:'type', text:'What do you need?', options:[
      {value:'new',    label:'New Ration Card',          hint:'First time / do not have a card'},
      {value:'update', label:'Update / Correction',      hint:'Name, address, category change'},
      {value:'add',    label:'Add a new member',          hint:'Newborn, marriage, etc.'},
    ]},
    {id:'category', text:'Which category applies to you?', options:[
      {value:'apl', label:'APL (Above Poverty Line)', hint:''},
      {value:'bpl', label:'BPL (Below Poverty Line)', hint:''},
      {value:'aay', label:'AAY / Antyodaya',           hint:'Extremely poor families'},
    ]},
  ],
  voterid:[
    {id:'type', text:'What are you applying for?', options:[
      {value:'fresh',      label:'Fresh Registration (Form 6)',          hint:'First-time voter'},
      {value:'correction', label:'Name / Address Correction (Form 8)',   hint:''},
      {value:'transfer',   label:'Transfer of Polling Booth (Form 8A)',  hint:'Moved to a new area'},
      {value:'duplicate',  label:'Duplicate EPIC Card',                  hint:'Lost or damaged card'},
    ]},
    {id:'age', text:'How old is the applicant?', options:[
      {value:'first', label:'First-time voter (18–20 yrs)', hint:''},
      {value:'adult', label:'Adult (21+ years)',            hint:''},
    ]},
  ],
  income:[
    {id:'purpose', text:'Why do you need the Income Certificate?', options:[
      {value:'scholarship', label:'Scholarship / Education',  hint:'School / college admission'},
      {value:'scheme',      label:'Government Scheme',        hint:'Subsidy, housing, welfare'},
      {value:'legal',       label:'Legal / Court purpose',    hint:''},
      {value:'other',       label:'Other purpose',            hint:''},
    ]},
    {id:'applicant', text:'Who is the certificate for?', options:[
      {value:'self',   label:'For myself',          hint:'Individual income certificate'},
      {value:'family', label:'For family / household', hint:'Family income certificate'},
    ]},
  ],
  caste:[
    {id:'category', text:'Which category certificate do you need?', options:[
      {value:'sc',  label:'SC (Scheduled Caste)',            hint:''},
      {value:'st',  label:'ST (Scheduled Tribe)',            hint:''},
      {value:'obc', label:'OBC (Other Backward Class)',      hint:''},
      {value:'ews', label:'EWS (Economically Weaker Section)', hint:''},
    ]},
    {id:'type', text:'Is this a fresh application or duplicate?', options:[
      {value:'fresh',     label:'Fresh Application', hint:'First time applying'},
      {value:'duplicate', label:'Duplicate / Reissue', hint:'Lost, damaged, or renewal'},
    ]},
  ],
};

/* ────────────────────────────────────────────
   CHECKLISTS DATA
──────────────────────────────────────────── */
const CHECKLISTS = {

  /* ── PASSPORT ── */
  passport:{
    'fresh-adult-normal':{
      required:[
        {doc:'Aadhaar Card',                                     type:'Original + Photocopy',    tip:'Self-attest the photocopy before submission'},
        {doc:'PAN Card',                                         type:'Original + Photocopy',    tip:'Accepted as identity proof'},
        {doc:'Birth Certificate / Class 10 Certificate',        type:'Original + Photocopy',    tip:'Any one as Date of Birth proof'},
        {doc:'Proof of Address (Aadhaar / Voter ID / Bill)',     type:'Original + Photocopy',    tip:'Bill must be within last 3 months'},
        {doc:'Passport-size Photographs',                        type:'2 copies',                tip:'White background, recent, 3.5×3.5 cm'},
      ],
      optional:[
        {doc:'Marriage Certificate',           type:'Photocopy', tip:'If spouse name to be included'},
        {doc:'Affidavit for name change',       type:'Original',  tip:'Only if name differs from records'},
      ]
    },
    'fresh-adult-tatkal':{
      required:[
        {doc:'Aadhaar Card',                                    type:'Original + Photocopy',  tip:'Self-attest all photocopies'},
        {doc:'PAN Card',                                        type:'Original + Photocopy',  tip:''},
        {doc:'Birth Certificate / Class 10 Certificate',       type:'Original + Photocopy',  tip:'Date of Birth proof'},
        {doc:'Proof of Address',                               type:'Original + Photocopy',  tip:'Aadhaar preferred'},
        {doc:'Passport-size Photographs',                       type:'4 copies',              tip:'White background, 3.5×3.5 cm'},
        {doc:'Annexure F — Tatkal Declaration',                type:'Original',              tip:'Must be signed by a Gazetted Officer'},
        {doc:'Verification Certificate from employer',         type:'Original',              tip:'Required for Tatkal processing'},
      ],
      optional:[]
    },
    'fresh-minor-normal':{
      required:[
        {doc:'Aadhaar Card of Minor',                          type:'Original + Photocopy',  tip:''},
        {doc:'Birth Certificate of Minor',                     type:'Original + Photocopy',  tip:'Mandatory for minors'},
        {doc:"Father's Passport (if available)",               type:'Original + Photocopy',  tip:''},
        {doc:"Mother's Passport (if available)",               type:'Original + Photocopy',  tip:''},
        {doc:"Both Parents' Aadhaar Cards",                    type:'Photocopy',             tip:'Self-attested'},
        {doc:'School Bonafide Certificate',                    type:'Original',              tip:'On school letterhead'},
        {doc:'Passport-size Photographs of Minor',             type:'2 copies',              tip:'White background'},
      ],
      optional:[
        {doc:'Consent of both parents (Annexure C)', type:'Original', tip:'If only one parent is present at appointment'},
      ]
    },
    'fresh-minor-tatkal':{
      required:[
        {doc:'Aadhaar Card of Minor',           type:'Original + Photocopy', tip:''},
        {doc:'Birth Certificate of Minor',      type:'Original + Photocopy', tip:'Mandatory'},
        {doc:"Both Parents' Aadhaar Cards",     type:'Photocopy',            tip:''},
        {doc:'School Bonafide Certificate',     type:'Original',             tip:''},
        {doc:'Passport-size Photographs',       type:'4 copies',             tip:''},
        {doc:'Annexure F — Tatkal Declaration', type:'Original',             tip:'Signed by Gazetted Officer'},
        {doc:'Verification Certificate',        type:'Original',             tip:''},
      ],
      optional:[]
    },
    'renewal-adult-normal':{
      required:[
        {doc:'Old Passport (Original)',                  type:'Original + Photocopy (first & last page)', tip:'Including ECR/Non-ECR page'},
        {doc:'Aadhaar Card',                             type:'Original + Photocopy',                    tip:'Self-attest photocopy'},
        {doc:'Proof of Address (if changed)',            type:'Original + Photocopy',                    tip:'Only if address has changed'},
        {doc:'Passport-size Photographs',                type:'2 copies',                                tip:'White background, recent'},
      ],
      optional:[
        {doc:'Name Change Documents', type:'Original', tip:'Marriage certificate / gazette — only if name has changed'},
      ]
    },
    'renewal-adult-tatkal':{
      required:[
        {doc:'Old Passport (Original)',                  type:'Original + Photocopy (first & last page)', tip:''},
        {doc:'Aadhaar Card',                             type:'Original + Photocopy',                    tip:''},
        {doc:'Passport-size Photographs',                type:'4 copies',                                tip:''},
        {doc:'Annexure F — Tatkal Declaration',          type:'Original',                                tip:'Signed by Gazetted Officer'},
      ],
      optional:[]
    },
    'renewal-minor-normal':{
      required:[
        {doc:'Old Passport of Minor',           type:'Original + Photocopy', tip:''},
        {doc:'Birth Certificate',               type:'Original + Photocopy', tip:''},
        {doc:"Both Parents' Aadhaar Cards",     type:'Photocopy',            tip:''},
        {doc:'Passport-size Photographs',       type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'renewal-minor-tatkal':{
      required:[
        {doc:'Old Passport of Minor',           type:'Original + Photocopy', tip:''},
        {doc:'Birth Certificate',               type:'Original',             tip:''},
        {doc:"Both Parents' Aadhaar Cards",     type:'Photocopy',            tip:''},
        {doc:'Passport-size Photographs',       type:'4 copies',             tip:''},
        {doc:'Annexure F — Tatkal Declaration', type:'Original',             tip:''},
      ],
      optional:[]
    },
  },

  /* ── DRIVING LICENCE ── */
  dl:{
    'learner-two':{
      required:[
        {doc:'Aadhaar Card',                                     type:'Original + Photocopy', tip:'Address + Identity proof'},
        {doc:'Age Proof (Birth Certificate / Class 10 / PAN)',   type:'Original + Photocopy', tip:'Any one document'},
        {doc:'Medical Certificate (Form 1-A)',                   type:'Original',             tip:'From a registered medical practitioner'},
        {doc:'Passport-size Photographs',                        type:'2 copies',             tip:'White / light background'},
        {doc:"Form 2 — Learner's Licence Application",          type:'Original',             tip:'Available at RTO or Parivahan portal'},
      ],
      optional:[]
    },
    'learner-four':{
      required:[
        {doc:'Aadhaar Card',                   type:'Original + Photocopy', tip:''},
        {doc:'Age Proof',                      type:'Original + Photocopy', tip:'Any one document'},
        {doc:'Medical Certificate (Form 1-A)', type:'Original',             tip:''},
        {doc:'Passport-size Photographs',      type:'2 copies',             tip:''},
        {doc:"Form 2 — Learner's Licence",    type:'Original',             tip:''},
      ],
      optional:[]
    },
    'learner-both':{
      required:[
        {doc:'Aadhaar Card',                   type:'Original + Photocopy', tip:''},
        {doc:'Age Proof',                      type:'Original + Photocopy', tip:'Any one document'},
        {doc:'Medical Certificate (Form 1-A)', type:'Original',             tip:''},
        {doc:'Passport-size Photographs',      type:'2 copies',             tip:''},
        {doc:"Form 2 — Learner's Licence",    type:'Original',             tip:'Mention both vehicle classes on the form'},
      ],
      optional:[]
    },
    'permanent-two':{
      required:[
        {doc:"Learner's Licence (LL)",                    type:'Original',             tip:'Must be at least 30 days old'},
        {doc:'Aadhaar Card',                              type:'Original + Photocopy', tip:''},
        {doc:'Passport-size Photographs',                 type:'2 copies',             tip:''},
        {doc:'Form 4 — Application for Driving Licence',  type:'Original',             tip:''},
        {doc:'Driving Test Appointment Confirmation',     type:'Printout / Screenshot', tip:'Book via Parivahan portal'},
      ],
      optional:[]
    },
    'permanent-four':{
      required:[
        {doc:"Learner's Licence (LL)", type:'Original',             tip:'Minimum 30 days old'},
        {doc:'Aadhaar Card',           type:'Original + Photocopy', tip:''},
        {doc:'Photographs',            type:'2 copies',             tip:''},
        {doc:'Form 4',                 type:'Original',             tip:''},
      ],
      optional:[]
    },
    'permanent-both':{
      required:[
        {doc:"Learner's Licence (both categories)", type:'Original',             tip:''},
        {doc:'Aadhaar Card',                        type:'Original + Photocopy', tip:''},
        {doc:'Photographs',                         type:'2 copies',             tip:''},
        {doc:'Form 4',                              type:'Original',             tip:''},
      ],
      optional:[]
    },
    'renewal-two':{
      required:[
        {doc:'Old Driving Licence',                          type:'Original',             tip:'Expired or expiring'},
        {doc:'Aadhaar Card',                                 type:'Original + Photocopy', tip:''},
        {doc:'Medical Certificate (if over 40 years old)',   type:'Original',             tip:'Required for applicants above 40'},
        {doc:'Passport-size Photographs',                    type:'2 copies',             tip:''},
        {doc:'Form LLD — Renewal Application',               type:'Original',             tip:''},
      ],
      optional:[]
    },
    'renewal-four':{
      required:[
        {doc:'Old Driving Licence',                        type:'Original',             tip:''},
        {doc:'Aadhaar Card',                               type:'Original + Photocopy', tip:''},
        {doc:'Medical Certificate (if over 40 years old)', type:'Original',             tip:''},
        {doc:'Photographs',                                type:'2 copies',             tip:''},
        {doc:'Form LLD',                                   type:'Original',             tip:''},
      ],
      optional:[]
    },
    'renewal-both':{
      required:[
        {doc:'Old Driving Licence',   type:'Original',             tip:''},
        {doc:'Aadhaar Card',          type:'Original + Photocopy', tip:''},
        {doc:'Medical Certificate',   type:'Original',             tip:'Mandatory if 40 years or above'},
        {doc:'Photographs',           type:'2 copies',             tip:''},
        {doc:'Form LLD',              type:'Original',             tip:''},
      ],
      optional:[]
    },
  },

  /* ── RATION CARD ── */
  ration:{
    'new-apl-telangana':{
      required:[
        {doc:'Aadhaar Card (all family members)',               type:'Original + Photocopy', tip:'All members must have Aadhaar linked'},
        {doc:'Proof of Residence (Electricity / Water Bill)',   type:'Original + Photocopy', tip:'Bill in Telangana address'},
        {doc:'Bank Passbook or Account Statement',             type:'Photocopy',             tip:''},
        {doc:'Mobile number linked to Aadhaar',                type:'Required',             tip:'For OTP-based verification'},
        {doc:'Passport-size Photographs (head of family)',     type:'2 copies',             tip:''},
        {doc:'Application Form (MeeSeva / Civil Supplies)',    type:'Filled original',      tip:'Available at MeeSeva centre'},
      ],
      optional:[{doc:'Caste Certificate', type:'Photocopy', tip:'If applicable for subcategory benefits'}]
    },
    'new-bpl-telangana':{
      required:[
        {doc:'Aadhaar Card (all family members)',            type:'Original + Photocopy', tip:''},
        {doc:'Income Certificate (below ₹1.5 lakh / year)', type:'Original',             tip:'From Tahsildar office'},
        {doc:'Proof of Residence',                          type:'Original + Photocopy', tip:''},
        {doc:'Bank Passbook',                               type:'Photocopy',             tip:''},
        {doc:'Photographs of head of family',               type:'2 copies',             tip:''},
        {doc:'Application Form',                            type:'Filled original',      tip:'From MeeSeva or Civil Supplies office'},
      ],
      optional:[]
    },
    'new-aay-telangana':{
      required:[
        {doc:'Aadhaar Card (all family members)',     type:'Original + Photocopy', tip:''},
        {doc:'Income Proof (extreme poverty)',        type:'Original',             tip:'Certification from Ward Officer / Tahsildar'},
        {doc:'Residence Proof',                      type:'Original + Photocopy', tip:''},
        {doc:'Application Form',                     type:'Filled original',      tip:''},
        {doc:'Photographs',                          type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-apl-ap':{
      required:[
        {doc:'Aadhaar Card (all family members)',           type:'Original + Photocopy', tip:''},
        {doc:'Electricity Bill or Property Tax Receipt',   type:'Original + Photocopy', tip:'For address proof in Andhra Pradesh'},
        {doc:'Application Form from Civil Supplies Dept.', type:'Filled original',      tip:''},
        {doc:'Photographs',                                type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-bpl-ap':{
      required:[
        {doc:'Aadhaar Card (all family members)',     type:'Original + Photocopy', tip:''},
        {doc:'Income Certificate below ₹1.5 lakh',   type:'Original',             tip:'From Tahsildar / MRO'},
        {doc:'Residence Proof',                      type:'Original + Photocopy', tip:''},
        {doc:'Application Form',                     type:'Filled original',      tip:''},
        {doc:'Photographs',                          type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-apl-maharashtra':{
      required:[
        {doc:'Aadhaar Card (all family members)', type:'Original + Photocopy', tip:''},
        {doc:'Address Proof in Maharashtra',      type:'Original + Photocopy', tip:'Rent agreement / Electricity bill'},
        {doc:'Application Form',                 type:'Filled original',      tip:'From Talathi office or Aaple Sarkar portal'},
        {doc:'Photographs',                      type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-bpl-maharashtra':{
      required:[
        {doc:'Aadhaar Card',             type:'Original + Photocopy', tip:''},
        {doc:'Income Certificate',       type:'Original',             tip:'Below poverty line threshold — from Talathi'},
        {doc:'Address Proof',            type:'Original + Photocopy', tip:''},
        {doc:'Application Form',         type:'Filled original',      tip:''},
        {doc:'Photographs',              type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-apl-up':{
      required:[
        {doc:'Aadhaar Card',                       type:'Original + Photocopy', tip:'All family members'},
        {doc:'Address Proof (UP address)',          type:'Original + Photocopy', tip:'Electricity bill / Bank passbook'},
        {doc:'Application Form (Ration Card Dept)', type:'Filled original',     tip:'From District Supply Office'},
        {doc:'Photographs',                        type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-bpl-up':{
      required:[
        {doc:'Aadhaar Card',             type:'Original + Photocopy', tip:''},
        {doc:'Income Certificate',       type:'Original',             tip:'From SDM / Tehsildar office'},
        {doc:'Address Proof',            type:'Original + Photocopy', tip:''},
        {doc:'Application Form',         type:'Filled original',      tip:''},
        {doc:'Photographs',              type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-apl-karnataka':{
      required:[
        {doc:'Aadhaar Card (all family members)', type:'Original + Photocopy', tip:''},
        {doc:'Residence Proof in Karnataka',     type:'Original + Photocopy', tip:'Electricity bill / Rental agreement'},
        {doc:'Application Form (Ahara Portal)',  type:'Filled original',      tip:''},
        {doc:'Photographs',                      type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'new-apl-other':{
      required:[
        {doc:'Aadhaar Card (all family members)', type:'Original + Photocopy', tip:''},
        {doc:'Proof of Residence (local address)',type:'Original + Photocopy', tip:'Electricity bill / Bank statement'},
        {doc:'Application Form',                 type:'Filled original',      tip:'From local District Supply Office or state portal'},
        {doc:'Photographs',                      type:'2 copies',             tip:''},
      ],
      optional:[{doc:'Income Certificate', type:'Original', tip:'May be required depending on your state'}]
    },
  },

  /* ── VOTER ID ── */
  voterid:{
    'fresh-first':{
      required:[
        {doc:'Aadhaar Card',                               type:'Original + Photocopy', tip:'Identity + age proof'},
        {doc:'Age Proof (Class 10 / Birth Certificate)',   type:'Original + Photocopy', tip:'Any one document'},
        {doc:'Proof of Address',                          type:'Original + Photocopy', tip:'Aadhaar / Electricity bill / Bank passbook'},
        {doc:'Passport-size Photographs',                 type:'2 copies',             tip:'Recent, white background'},
        {doc:'Form 6 — Application for New Voter',        type:'Filled original',      tip:'Available on Voter Portal (voters.eci.gov.in)'},
      ],
      optional:[]
    },
    'fresh-adult':{
      required:[
        {doc:'Aadhaar Card',                              type:'Original + Photocopy', tip:''},
        {doc:'Age Proof',                                 type:'Original + Photocopy', tip:'Any one document'},
        {doc:'Address Proof',                            type:'Original + Photocopy', tip:''},
        {doc:'Passport-size Photographs',                type:'2 copies',             tip:''},
        {doc:'Form 6 — Application for New Voter',       type:'Filled original',      tip:''},
      ],
      optional:[]
    },
    'correction-first':{
      required:[
        {doc:'Existing Voter ID (EPIC Card)',             type:'Original + Photocopy', tip:''},
        {doc:'Aadhaar Card',                              type:'Photocopy',            tip:''},
        {doc:'Supporting document for correction',       type:'Original + Photocopy', tip:'e.g. school certificate for name correction'},
        {doc:'Form 8 — Correction Application',          type:'Filled original',      tip:'Available on Voter Portal'},
        {doc:'Passport-size Photographs',                type:'1 copy',               tip:''},
      ],
      optional:[]
    },
    'correction-adult':{
      required:[
        {doc:'Existing Voter ID (EPIC Card)',        type:'Original + Photocopy', tip:''},
        {doc:'Aadhaar Card',                         type:'Photocopy',            tip:''},
        {doc:'Document supporting the correction',  type:'Original + Photocopy', tip:''},
        {doc:'Form 8',                              type:'Filled original',      tip:''},
        {doc:'Photographs',                         type:'1 copy',               tip:''},
      ],
      optional:[]
    },
    'transfer-first':{
      required:[
        {doc:'Old Voter ID (EPIC Card)',              type:'Original + Photocopy', tip:''},
        {doc:'New Address Proof',                    type:'Original + Photocopy', tip:'Aadhaar / Electricity bill at new address'},
        {doc:'Form 8A — Transfer Application',       type:'Filled original',      tip:''},
        {doc:'Photographs',                          type:'1 copy',               tip:''},
      ],
      optional:[]
    },
    'transfer-adult':{
      required:[
        {doc:'Old Voter ID (EPIC Card)', type:'Original + Photocopy', tip:''},
        {doc:'New Address Proof',       type:'Original + Photocopy', tip:''},
        {doc:'Form 8A',                 type:'Filled original',      tip:''},
        {doc:'Photographs',             type:'1 copy',               tip:''},
      ],
      optional:[]
    },
    'duplicate-first':{
      required:[
        {doc:'Aadhaar Card',                   type:'Original + Photocopy', tip:''},
        {doc:'FIR Copy (if EPIC card stolen)',  type:'Original',             tip:'From nearest police station'},
        {doc:'Address Proof',                 type:'Photocopy',            tip:''},
        {doc:'Form EPIC-002 or Form 8',       type:'Filled original',      tip:'For duplicate EPIC card'},
        {doc:'Photographs',                   type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'duplicate-adult':{
      required:[
        {doc:'Aadhaar Card',             type:'Original + Photocopy', tip:''},
        {doc:'FIR Copy (if card stolen)', type:'Original',            tip:''},
        {doc:'Address Proof',            type:'Photocopy',            tip:''},
        {doc:'Form 8',                  type:'Filled original',      tip:''},
        {doc:'Photographs',             type:'2 copies',             tip:''},
      ],
      optional:[]
    },
  },

  /* ── INCOME CERTIFICATE ── */
  income:{
    'scholarship-self':{
      required:[
        {doc:'Aadhaar Card',                          type:'Original + Photocopy', tip:''},
        {doc:'Income Proof (Salary Slip / IT Return)', type:'Original',            tip:'For salaried or self-employed'},
        {doc:'Ration Card',                           type:'Photocopy',            tip:''},
        {doc:'Application Form for Income Certificate',type:'Filled original',    tip:'From Tahsildar / e-District / MeeSeva'},
        {doc:'Photographs',                           type:'2 copies',             tip:''},
        {doc:'Bonafide Certificate from Institution', type:'Original',             tip:'From school or college for scholarship purpose'},
      ],
      optional:[]
    },
    'scholarship-family':{
      required:[
        {doc:'Aadhaar Card (all adult members)',       type:'Original + Photocopy', tip:''},
        {doc:'Ration Card',                           type:'Original + Photocopy', tip:''},
        {doc:'Income Declaration (family)',            type:'Original',             tip:'Self-declaration on stamp paper if no formal income'},
        {doc:'Application Form',                      type:'Filled original',      tip:''},
        {doc:'Photographs',                           type:'2 copies',             tip:''},
        {doc:'Bonafide Certificate from Institution', type:'Original',             tip:'For scholarship purpose'},
      ],
      optional:[]
    },
    'scheme-self':{
      required:[
        {doc:'Aadhaar Card',                          type:'Original + Photocopy', tip:''},
        {doc:'Income Proof',                          type:'Original',             tip:'Salary slip / IT return / Bank statement'},
        {doc:'Ration Card',                           type:'Photocopy',            tip:''},
        {doc:'Application Form',                      type:'Filled original',      tip:''},
        {doc:'Photographs',                           type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'scheme-family':{
      required:[
        {doc:'Aadhaar Card (all adult members)',  type:'Original + Photocopy', tip:''},
        {doc:'Ration Card',                      type:'Original + Photocopy', tip:''},
        {doc:'Income Declaration',               type:'Original',             tip:'Self-declaration on stamp paper if no formal income'},
        {doc:'Application Form',                 type:'Filled original',      tip:''},
        {doc:'Photographs',                      type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'legal-self':{
      required:[
        {doc:'Aadhaar Card',             type:'Original + Photocopy', tip:''},
        {doc:'Income Proof',             type:'Original',             tip:''},
        {doc:'Court Order / Notice',     type:'Photocopy',            tip:'Reason for legal requirement'},
        {doc:'Application Form',         type:'Filled original',      tip:''},
      ],
      optional:[]
    },
    'legal-family':{
      required:[
        {doc:'Aadhaar Card',     type:'Original + Photocopy', tip:''},
        {doc:'Ration Card',      type:'Photocopy',            tip:''},
        {doc:'Court Order',      type:'Photocopy',            tip:''},
        {doc:'Application Form', type:'Filled original',      tip:''},
      ],
      optional:[]
    },
    'other-self':{
      required:[
        {doc:'Aadhaar Card',     type:'Original + Photocopy', tip:''},
        {doc:'Income Proof',     type:'Original',             tip:'Any acceptable document'},
        {doc:'Application Form', type:'Filled original',      tip:''},
        {doc:'Photographs',      type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'other-family':{
      required:[
        {doc:'Aadhaar Card',     type:'Original + Photocopy', tip:''},
        {doc:'Ration Card',      type:'Photocopy',            tip:''},
        {doc:'Application Form', type:'Filled original',      tip:''},
        {doc:'Photographs',      type:'2 copies',             tip:''},
      ],
      optional:[]
    },
  },

  /* ── CASTE CERTIFICATE ── */
  caste:{
    'sc-fresh':{
      required:[
        {doc:'Aadhaar Card',                                type:'Original + Photocopy', tip:''},
        {doc:"Parent's Caste Certificate",                  type:'Original + Photocopy', tip:"Father's certificate preferred"},
        {doc:'Ration Card',                                 type:'Original + Photocopy', tip:''},
        {doc:'School / College Bonafide Certificate',       type:'Original',             tip:'Showing your caste/community in records'},
        {doc:'Application Form for Caste Certificate',      type:'Filled original',      tip:'From Tahsildar / e-District / MeeSeva'},
        {doc:'Photographs',                                 type:'2 copies',             tip:''},
        {doc:'Address Proof',                               type:'Photocopy',            tip:'Aadhaar / Electricity bill'},
      ],
      optional:[{doc:'Community letter from Panchayat/Ward', type:'Letter', tip:'Some districts require a local community letter'}]
    },
    'sc-duplicate':{
      required:[
        {doc:'Aadhaar Card',                               type:'Original + Photocopy', tip:''},
        {doc:'Old Caste Certificate (if available)',        type:'Photocopy',            tip:''},
        {doc:'FIR Copy (if lost / stolen)',                 type:'Original',             tip:''},
        {doc:'Application Form for Duplicate',             type:'Filled original',      tip:''},
        {doc:'Photographs',                                type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'st-fresh':{
      required:[
        {doc:'Aadhaar Card',                               type:'Original + Photocopy', tip:''},
        {doc:"Parent's Caste / Tribe Certificate",         type:'Original + Photocopy', tip:"Father's certificate preferred"},
        {doc:'Ration Card',                                type:'Original + Photocopy', tip:''},
        {doc:'School Records showing Tribe name',          type:'Original',             tip:'Transfer certificate or bonafide'},
        {doc:'Application Form',                           type:'Filled original',      tip:''},
        {doc:'Photographs',                                type:'2 copies',             tip:''},
        {doc:'Address Proof',                              type:'Photocopy',            tip:''},
      ],
      optional:[]
    },
    'st-duplicate':{
      required:[
        {doc:'Aadhaar Card',                   type:'Original + Photocopy', tip:''},
        {doc:'Old Certificate (if available)', type:'Photocopy',            tip:''},
        {doc:'FIR (if lost)',                  type:'Original',             tip:''},
        {doc:'Application Form',               type:'Filled original',      tip:''},
        {doc:'Photographs',                    type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'obc-fresh':{
      required:[
        {doc:'Aadhaar Card',                                      type:'Original + Photocopy', tip:''},
        {doc:"Parent's OBC Certificate",                          type:'Original + Photocopy', tip:''},
        {doc:'Ration Card',                                       type:'Original + Photocopy', tip:''},
        {doc:'Income Certificate (for non-creamy layer proof)',   type:'Original',             tip:'Below ₹8 lakh per year for central services'},
        {doc:'School Records showing community',                  type:'Original',             tip:''},
        {doc:'Application Form',                                  type:'Filled original',      tip:''},
        {doc:'Photographs',                                       type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'obc-duplicate':{
      required:[
        {doc:'Aadhaar Card',                          type:'Original + Photocopy', tip:''},
        {doc:'Old OBC Certificate (if available)',    type:'Photocopy',            tip:''},
        {doc:'Application Form',                     type:'Filled original',      tip:''},
        {doc:'Photographs',                          type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'ews-fresh':{
      required:[
        {doc:'Aadhaar Card',                              type:'Original + Photocopy', tip:''},
        {doc:'Income Certificate (below ₹8 lakh / year)', type:'Original',             tip:'From Tahsildar office — key requirement for EWS'},
        {doc:'Property / Asset Declaration',              type:'Affidavit',            tip:'Stating no property above EWS limits'},
        {doc:'Ration Card',                               type:'Photocopy',            tip:''},
        {doc:'Application Form for EWS Certificate',     type:'Filled original',      tip:''},
        {doc:'Photographs',                               type:'2 copies',             tip:''},
      ],
      optional:[]
    },
    'ews-duplicate':{
      required:[
        {doc:'Aadhaar Card',                        type:'Original + Photocopy', tip:''},
        {doc:'Old EWS Certificate (if available)',  type:'Photocopy',            tip:''},
        {doc:'Application Form',                   type:'Filled original',      tip:''},
        {doc:'Photographs',                        type:'2 copies',             tip:''},
      ],
      optional:[]
    },
  },
};

/* ────────────────────────────────────────────
   STATE VARIABLES
──────────────────────────────────────────── */
let selectedService = null;
let answers         = {};
let checklistData   = null;
let checked         = {};

/* ────────────────────────────────────────────
   RENDER SERVICES
──────────────────────────────────────────── */
function renderServices(filter) {
  filter = filter || '';
  const grid = document.getElementById('serviceGrid');
  grid.innerHTML = '';
  const f = filter.toLowerCase();
  const filtered = SERVICES.filter(function(s) {
    return !f || s.name.toLowerCase().includes(f) || s.desc.toLowerCase().includes(f);
  });
  filtered.forEach(function(s) {
    const c = document.createElement('div');
    c.className = 'service-card';
    c.setAttribute('tabindex', '0');
    c.setAttribute('role', 'button');
    c.setAttribute('aria-label', 'Select ' + s.name);
    c.innerHTML =
      (s.badge ? '<span class="service-badge">' + s.badge + '</span>' : '') +
      '<span class="service-icon">' + s.icon + '</span>' +
      '<div class="service-name">' + s.name + '</div>' +
      '<div class="service-desc">' + s.desc + '</div>';
    c.onclick = function() { selectService(s); };
    c.onkeydown = function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectService(s); } };
    grid.appendChild(c);
  });
  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--gray-500);font-size:14px;padding:20px 0;grid-column:1/-1">No service found. Try a different search term.</p>';
  }
}

function filterServices(v) {
  renderServices(v);
}

function selectService(s) {
  selectedService = s;
  answers  = {};
  checked  = {};

  document.getElementById('qIcon').textContent = s.icon;
  document.getElementById('qName').textContent = s.name;

  var stateRow  = document.getElementById('qStateRow');
  var stateNote = document.getElementById('stateNote');
  if (s.needsState) {
    stateRow.style.display  = 'flex';
    stateNote.style.display = 'block';
  } else {
    stateRow.style.display  = 'none';
    stateNote.style.display = 'none';
  }

  renderQuestions(s.id);
  goScreen(2);
}

/* ────────────────────────────────────────────
   RENDER QUESTIONS
──────────────────────────────────────────── */
function renderQuestions(serviceId) {
  var qs        = QUESTIONS[serviceId] || [];
  var container = document.getElementById('questionsContainer');
  container.innerHTML = '';

  qs.forEach(function(q, i) {
    var div = document.createElement('div');
    div.className = 'q-card';
    var optHtml = q.options.map(function(o) {
      return '<div class="q-option" onclick="selectAnswer(\'' + q.id + '\',\'' + o.value + '\',this)" role="radio" tabindex="0" aria-checked="false" onkeydown="handleOptionKey(event,\'' + q.id + '\',\'' + o.value + '\',this)">' +
        '<div class="q-option-radio"></div>' +
        '<div>' +
          '<div class="q-option-label">' + o.label + '</div>' +
          (o.hint ? '<div class="q-option-hint">' + o.hint + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
    div.innerHTML =
      '<div class="q-card-num">Question ' + (i + 1) + ' of ' + qs.length + '</div>' +
      '<div class="q-text">' + q.text + '</div>' +
      '<div class="q-options" id="opts_' + q.id + '">' + optHtml + '</div>';
    container.appendChild(div);
  });

  checkNextBtn();
}

function handleOptionKey(e, qId, val, el) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectAnswer(qId, val, el);
  }
}

function selectAnswer(qId, val, el) {
  answers[qId] = val;
  var opts = el.parentNode.querySelectorAll('.q-option');
  opts.forEach(function(o) {
    o.classList.remove('selected');
    o.setAttribute('aria-checked', 'false');
  });
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');
  checkNextBtn();
}

function checkNextBtn() {
  var qs          = QUESTIONS[selectedService.id] || [];
  var allAnswered = qs.every(function(q) { return answers[q.id]; });
  document.getElementById('btnNext').disabled = !allAnswered;
}

/* ────────────────────────────────────────────
   GENERATE CHECKLIST
──────────────────────────────────────────── */
function generateChecklist() {
  var svc = selectedService.id;
  var qs  = QUESTIONS[svc];
  var key = qs.map(function(q) { return answers[q.id]; }).join('-');

  var data = null;
  var map  = CHECKLISTS[svc];

  /* Exact match */
  if (map[key]) {
    data = map[key];
  } else {
    /* Fuzzy match: find best partial key */
    var keys = Object.keys(map);
    for (var ki = 0; ki < keys.length; ki++) {
      var k       = keys[ki];
      var parts   = k.split('-');
      var ansParts= key.split('-');
      var allMatch= true;
      for (var pi = 0; pi < parts.length; pi++) {
        if (ansParts[pi] && ansParts[pi] !== parts[pi]) { allMatch = false; break; }
      }
      if (allMatch) { data = map[k]; break; }
    }
    if (!data) data = map[Object.keys(map)[0]];
  }

  /* State-specific override for services that need state */
  if (selectedService.needsState) {
    var state    = document.getElementById('stateSelect').value;
    var stateKey = key + '-' + state;
    if (map[stateKey]) {
      data = map[stateKey];
    } else {
      /* Try partial: any key starting with same answers + this state */
      var stateKeys = Object.keys(map);
      for (var si = 0; si < stateKeys.length; si++) {
        if (stateKeys[si].endsWith('-' + state)) { data = map[stateKeys[si]]; break; }
      }
    }
  }

  checklistData = data;
  checked       = {};

  /* Set header */
  document.getElementById('checklistTitle').textContent = selectedService.name + ' — Document Checklist';
  var qlabels = (QUESTIONS[svc] || []).map(function(q) {
    var opt = q.options.find(function(o) { return o.value === answers[q.id]; });
    return opt ? opt.label : '';
  });
  document.getElementById('checklistSubtitle').textContent = qlabels.filter(Boolean).join(' · ');

  renderChecklist(data);
  renderOfficialLinks(svc);

  document.getElementById('tipsPanel').style.display = 'block';
  goScreen(3);
  updateProgress();
}

function renderChecklist(data) {
  var container = document.getElementById('checklistContent');
  container.innerHTML = '';

  if (data.required && data.required.length) {
    var sec = document.createElement('div');
    sec.className = 'doc-section';
    sec.innerHTML = '<div class="doc-section-title">Required Documents (' + data.required.length + ')</div>';
    data.required.forEach(function(item, i) { sec.appendChild(makeDocItem(item, 'req', i)); });
    container.appendChild(sec);
  }

  if (data.optional && data.optional.length) {
    var sec2 = document.createElement('div');
    sec2.className = 'doc-section';
    sec2.innerHTML = '<div class="doc-section-title" style="margin-top:24px">Optional / If Applicable (' + data.optional.length + ')</div>';
    data.optional.forEach(function(item, i) { sec2.appendChild(makeDocItem(item, 'opt', i)); });
    container.appendChild(sec2);
  }
}

function makeDocItem(item, prefix, i) {
  var key = prefix + '_' + i;
  var div = document.createElement('div');
  div.className = 'doc-item';
  div.id = 'item_' + key;
  div.setAttribute('tabindex', '0');
  div.setAttribute('role', 'checkbox');
  div.setAttribute('aria-checked', 'false');
  div.innerHTML =
    '<div class="doc-checkbox" id="chk_' + key + '"></div>' +
    '<div class="doc-info">' +
      '<div class="doc-name">' + item.doc + '</div>' +
      '<span class="doc-type">' + item.type + '</span>' +
      (item.tip ? '<div class="doc-tip">' + item.tip + '</div>' : '') +
    '</div>';
  div.onclick    = function() { toggleDoc(key, div); };
  div.onkeydown  = function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDoc(key, div); } };
  return div;
}

function toggleDoc(key, el) {
  checked[key] = !checked[key];
  el.classList.toggle('checked', checked[key]);
  el.setAttribute('aria-checked', checked[key] ? 'true' : 'false');
  var chk = document.getElementById('chk_' + key);
  chk.textContent = checked[key] ? '✓' : '';
  updateProgress();
}

function updateProgress() {
  var reqCount = (checklistData.required  || []).length;
  var optCount = (checklistData.optional  || []).length;
  var total    = reqCount + optCount;
  var done     = Object.values(checked).filter(Boolean).length;
  var pct      = total ? Math.round(done / total * 100) : 0;

  document.getElementById('progressFill').style.width  = pct + '%';
  document.getElementById('progressText').textContent  = done + ' of ' + total + ' documents ready';
  document.getElementById('progressPct').textContent   = pct + '%';
}

/* ────────────────────────────────────────────
   OFFICIAL LINKS
──────────────────────────────────────────── */
function renderOfficialLinks(svc) {
  var container = document.getElementById('officialLinks');
  var links     = PORTAL_LINKS[svc] || [];
  if (!links.length) { container.style.display = 'none'; return; }

  container.style.display = 'block';
  var html = '<div class="official-links-title">Apply on Official Portal</div>';
  html += '<div>First prepare all the documents above, then apply using the official government portal:</div>';
  html += '<div style="margin-top:10px">';
  links.forEach(function(lnk) {
    html += '<a href="' + lnk.url + '" target="_blank" rel="noopener noreferrer" class="official-link-btn">🔗 ' + lnk.label + '</a>';
  });
  html += '</div>';
  html += '<div class="official-links-note">Links open in a new tab. DocReady is not affiliated with any government department.</div>';
  container.innerHTML = html;
}

/* ────────────────────────────────────────────
   NAVIGATION
──────────────────────────────────────────── */
function goScreen(n) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('screen' + n).classList.add('active');
  updateStepIndicator(n);
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function goBack(n) { goScreen(n); }

function updateStepIndicator(step) {
  for (var i = 1; i <= 3; i++) {
    var dot = document.getElementById('dot' + i);
    var lbl = document.getElementById('lbl' + i);
    dot.classList.remove('active', 'done');
    lbl.classList.remove('active');
    if (i < step)       { dot.classList.add('done');   dot.textContent = '✓'; }
    else if (i === step){ dot.classList.add('active');  dot.textContent = i; lbl.classList.add('active'); }
    else                { dot.textContent = i; }
  }
  for (var j = 1; j <= 2; j++) {
    document.getElementById('line' + j).classList.toggle('done', j < step);
  }
}

function restart() {
  selectedService = null;
  answers         = {};
  checklistData   = null;
  checked         = {};
  document.getElementById('serviceSearch').value = '';
  document.getElementById('officialLinks').innerHTML = '';
  renderServices();
  goScreen(1);
}

/* ────────────────────────────────────────────
   SHARE / COPY / PRINT
──────────────────────────────────────────── */
function buildTextChecklist() {
  var svc  = selectedService;
  var data = checklistData;
  var text = '📋 *DocReady — Document Checklist*\n';
  text += 'Service: *' + svc.name + '*\n';

  var qs = QUESTIONS[svc.id] || [];
  qs.forEach(function(q) {
    var opt = q.options.find(function(o) { return o.value === answers[q.id]; });
    if (opt) text += '• ' + opt.label + '\n';
  });

  text += '\n*Required Documents:*\n';
  (data.required || []).forEach(function(d, i) {
    text += (i + 1) + '. ' + d.doc + ' — ' + d.type + '\n';
    if (d.tip) text += '   💡 ' + d.tip + '\n';
  });

  if (data.optional && data.optional.length) {
    text += '\n*Optional Documents:*\n';
    data.optional.forEach(function(d, i) { text += (i + 1) + '. ' + d.doc + ' — ' + d.type + '\n'; });
  }

  text += '\n📌 *General Tips:*\n';
  text += '• Carry originals + 2 self-attested photocopies of every document\n';
  text += '• Keep 4 recent passport-size photographs (white background)\n';
  text += '• Check office timings before visiting\n';
  text += '\n_Generated by DocReady — Free citizen guidance_\n';
  text += '_Always verify requirements at the official government portal before your visit._';
  return text;
}

function shareWhatsApp() {
  var text = buildTextChecklist();
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

function copyChecklist() {
  var text = buildTextChecklist().replace(/\*/g, '').replace(/_/g, '');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('✅ Checklist copied to clipboard!');
    }).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast('✅ Checklist copied!');
  } catch(e) {
    showToast('Could not copy. Please select and copy manually.');
  }
  document.body.removeChild(ta);
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2800);
}

/* ────────────────────────────────────────────
   LANGUAGE STUB (extendable)
──────────────────────────────────────────── */
function setLang(lang) {
  if (lang !== 'en') {
    showToast('More languages coming soon! / जल्द आएगा!');
    document.getElementById('langSelect').value = 'en';
  }
}

/* ────────────────────────────────────────────
   INIT
──────────────────────────────────────────── */
renderServices();

/* ═══════════════════════════════════════════
   DocReady — Test Suite
   Tests for pure logic in app.logic.js
═══════════════════════════════════════════ */

const {
  SERVICES,
  QUESTIONS,
  filterServices,
  allAnswered,
  buildChecklistKey,
  resolveChecklist,
  calcProgress,
  buildTextChecklist,
} = require('../app.logic.js');

// ─── DATA INTEGRITY ──────────────────────────────────────────
describe('Data integrity', () => {
  test('SERVICES has 6 entries', () => {
    expect(SERVICES).toHaveLength(6);
  });

  test('every service has required fields', () => {
    SERVICES.forEach(s => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('icon');
      expect(s).toHaveProperty('needsState');
      expect(typeof s.needsState).toBe('boolean');
    });
  });

  test('state-dependent services are correctly flagged', () => {
    const stateServices = SERVICES.filter(s => s.needsState).map(s => s.id);
    expect(stateServices).toContain('ration');
    expect(stateServices).toContain('income');
    expect(stateServices).toContain('caste');
    expect(stateServices).not.toContain('passport');
    expect(stateServices).not.toContain('dl');
    expect(stateServices).not.toContain('voterid');
  });

  test('every service has questions defined', () => {
    SERVICES.forEach(s => {
      expect(QUESTIONS[s.id]).toBeDefined();
      expect(QUESTIONS[s.id].length).toBeGreaterThan(0);
    });
  });

  test('every question has at least 2 options', () => {
    Object.values(QUESTIONS).forEach(qs => {
      qs.forEach(q => {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        q.options.forEach(o => {
          expect(o).toHaveProperty('value');
          expect(o).toHaveProperty('label');
        });
      });
    });
  });

  test('service IDs are unique', () => {
    const ids = SERVICES.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── filterServices ───────────────────────────────────────────
describe('filterServices()', () => {
  test('returns all services when filter is empty', () => {
    expect(filterServices('')).toHaveLength(6);
    expect(filterServices(null)).toHaveLength(6);
  });

  test('filters by name (case-insensitive)', () => {
    const result = filterServices('passport');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('passport');
  });

  test('filters by partial name match', () => {
    const result = filterServices('ration');
    expect(result.some(s => s.id === 'ration')).toBe(true);
  });

  test('filters by description text', () => {
    const result = filterServices('renewal');
    // passport and dl both have "Renewal" in desc
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  test('returns empty array for no match', () => {
    expect(filterServices('xyznonexistent')).toHaveLength(0);
  });

  test('search is case-insensitive', () => {
    expect(filterServices('PASSPORT')).toHaveLength(1);
    expect(filterServices('Passport')).toHaveLength(1);
    expect(filterServices('passport')).toHaveLength(1);
  });
});

// ─── allAnswered ──────────────────────────────────────────────
describe('allAnswered()', () => {
  test('returns false when no answers given', () => {
    expect(allAnswered('passport', {})).toBe(false);
  });

  test('returns false when only some questions answered', () => {
    expect(allAnswered('passport', { type: 'fresh', age: 'adult' })).toBe(false);
  });

  test('returns true when all passport questions answered', () => {
    expect(allAnswered('passport', { type: 'fresh', age: 'adult', speed: 'normal' })).toBe(true);
  });

  test('returns true when all dl questions answered', () => {
    expect(allAnswered('dl', { type: 'learner', vehicle: 'two' })).toBe(true);
  });

  test('returns true when all voterid questions answered', () => {
    expect(allAnswered('voterid', { type: 'fresh', age: 'first' })).toBe(true);
  });

  test('returns true for unknown service (no questions = trivially answered)', () => {
    expect(allAnswered('unknown_service', {})).toBe(true);
  });
});

// ─── buildChecklistKey ────────────────────────────────────────
describe('buildChecklistKey()', () => {
  test('builds correct key for passport', () => {
    const answers = { type: 'fresh', age: 'adult', speed: 'normal' };
    expect(buildChecklistKey('passport', answers)).toBe('fresh-adult-normal');
  });

  test('builds correct key for dl', () => {
    const answers = { type: 'learner', vehicle: 'two' };
    expect(buildChecklistKey('dl', answers)).toBe('learner-two');
  });

  test('appends state when provided', () => {
    const answers = { type: 'new', category: 'apl' };
    expect(buildChecklistKey('ration', answers, 'telangana')).toBe('new-apl-telangana');
  });

  test('no state suffix when state is empty', () => {
    const answers = { type: 'new', category: 'apl' };
    expect(buildChecklistKey('ration', answers)).toBe('new-apl');
  });
});

// ─── resolveChecklist ─────────────────────────────────────────
describe('resolveChecklist()', () => {
  const mockMap = {
    'fresh-adult-normal': { required: [{ doc: 'Aadhaar', type: 'Original', tip: '' }], optional: [] },
    'fresh-adult-tatkal': { required: [{ doc: 'Aadhaar', type: 'Original', tip: '' }, { doc: 'Annexure F', type: 'Original', tip: '' }], optional: [] },
    'renewal-adult-normal': { required: [{ doc: 'Old Passport', type: 'Original', tip: '' }], optional: [] },
  };

  test('returns exact match', () => {
    const result = resolveChecklist(mockMap, 'fresh-adult-normal');
    expect(result.required[0].doc).toBe('Aadhaar');
  });

  test('returns tatkal entry for tatkal key', () => {
    const result = resolveChecklist(mockMap, 'fresh-adult-tatkal');
    expect(result.required).toHaveLength(2);
  });

  test('returns null for null map', () => {
    expect(resolveChecklist(null, 'anything')).toBeNull();
  });

  test('falls back to first entry for unknown key', () => {
    const result = resolveChecklist(mockMap, 'completely-unknown-key');
    expect(result).not.toBeNull();
  });

  test('partial match works (fewer answer parts than key)', () => {
    const result = resolveChecklist(mockMap, 'renewal-adult-normal');
    expect(result.required[0].doc).toBe('Old Passport');
  });
});

// ─── calcProgress ─────────────────────────────────────────────
describe('calcProgress()', () => {
  const mockData = {
    required: [{ doc: 'A' }, { doc: 'B' }, { doc: 'C' }],
    optional: [{ doc: 'D' }],
  };

  test('returns 0% when nothing checked', () => {
    const { done, total, pct } = calcProgress(mockData, {});
    expect(done).toBe(0);
    expect(total).toBe(4);
    expect(pct).toBe(0);
  });

  test('returns 100% when all checked', () => {
    const checked = { req_0: true, req_1: true, req_2: true, opt_0: true };
    const { pct } = calcProgress(mockData, checked);
    expect(pct).toBe(100);
  });

  test('calculates partial progress correctly', () => {
    const checked = { req_0: true, req_1: true };
    const { done, total, pct } = calcProgress(mockData, checked);
    expect(done).toBe(2);
    expect(total).toBe(4);
    expect(pct).toBe(50);
  });

  test('ignores unchecked (false) values', () => {
    const checked = { req_0: true, req_1: false, req_2: false };
    const { done } = calcProgress(mockData, checked);
    expect(done).toBe(1);
  });

  test('handles empty checklist without division by zero', () => {
    const { pct } = calcProgress({ required: [], optional: [] }, {});
    expect(pct).toBe(0);
  });
});

// ─── buildTextChecklist ───────────────────────────────────────
describe('buildTextChecklist()', () => {
  const service = { id: 'passport', name: 'Passport' };
  const answers = { type: 'fresh', age: 'adult', speed: 'normal' };
  const data = {
    required: [
      { doc: 'Aadhaar Card', type: 'Original + Photocopy', tip: 'Self-attest the photocopy' },
      { doc: 'PAN Card',     type: 'Original + Photocopy', tip: '' },
    ],
    optional: [
      { doc: 'Marriage Certificate', type: 'Photocopy', tip: '' },
    ],
  };

  test('includes service name', () => {
    const text = buildTextChecklist(service, answers, data);
    expect(text).toContain('Passport');
  });

  test('includes all required documents', () => {
    const text = buildTextChecklist(service, answers, data);
    expect(text).toContain('Aadhaar Card');
    expect(text).toContain('PAN Card');
  });

  test('includes optional documents', () => {
    const text = buildTextChecklist(service, answers, data);
    expect(text).toContain('Marriage Certificate');
    expect(text).toContain('Optional Documents');
  });

  test('includes answer labels', () => {
    const text = buildTextChecklist(service, answers, data);
    expect(text).toContain('Fresh Passport');
    expect(text).toContain('Adult (18+ years)');
    expect(text).toContain('Normal (Non-Tatkal)');
  });

  test('includes document tips', () => {
    const text = buildTextChecklist(service, answers, data);
    expect(text).toContain('Self-attest the photocopy');
  });

  test('includes DocReady branding', () => {
    const text = buildTextChecklist(service, answers, data);
    expect(text).toContain('DocReady');
  });

  test('skips optional section when no optional docs', () => {
    const dataNoOpt = { required: data.required, optional: [] };
    const text = buildTextChecklist(service, answers, dataNoOpt);
    expect(text).not.toContain('Optional Documents');
  });
});

// ─── JSON data files ──────────────────────────────────────────
describe('JSON data files', () => {
  const fs = require('fs');
  const path = require('path');

  test('services.json is valid JSON', () => {
    const raw = fs.readFileSync(path.join(__dirname, '../services.json'), 'utf8');
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  test('en.json is valid JSON', () => {
    const raw = fs.readFileSync(path.join(__dirname, '../en.json'), 'utf8');
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  test('services.json has correct number of services', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '../services.json'), 'utf8'));
    expect(raw.services).toHaveLength(6);
  });

  test('services.json IDs match SERVICES constant', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '../services.json'), 'utf8'));
    const jsonIds = raw.services.map(s => s.id).sort();
    const jsIds   = SERVICES.map(s => s.id).sort();
    expect(jsonIds).toEqual(jsIds);
  });

  test('en.json has key UI strings', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '../en.json'), 'utf8'));
    expect(raw).toHaveProperty('hero_h1');
    expect(raw).toHaveProperty('header_tagline');
    expect(raw).toHaveProperty('btn_whatsapp');
    expect(raw).toHaveProperty('btn_copy');
  });
});

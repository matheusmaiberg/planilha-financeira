const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// =============================================================================
// MOCKS GAS MÍNIMOS
// =============================================================================
global.Logger = { log: (msg) => console.log('[LOG]', msg) };
global.Session = { getScriptTimeZone: () => 'America/Sao_Paulo' };
global.Utilities = {
  formatDate: (date, tz, fmt) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return fmt.replace('dd', pad(d.getDate())).replace('MM', pad(d.getMonth() + 1)).replace('yyyy', d.getFullYear());
  }
};

global.SpreadsheetApp = {
  getActiveSpreadsheet() { return { getActiveSheet: () => ({ getLastColumn: () => 7, getLastRow: () => 1, getRange: () => ({ setValue: () => ({}), setFontWeight: () => ({}), setBackground: () => ({}), setNumberFormat: () => ({}), getValues: () => [[]], getDisplayValues: () => [[]], setValues: () => ({}) }), autoResizeColumns: () => {} }) }; },
  getUi() { return { alert: () => {}, ButtonSet: { OK: 'ok' } }; }
};
global.ScriptApp = {
  newTrigger() { return { timeBased() { return this; }, everyDays() { return this; }, atHour() { return this; }, create() {} }; },
  getProjectTriggers() { return []; },
  deleteTrigger() {}
};

// Carrega dados reais salvos
const REAL_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'real-activities.json'), 'utf8'));

global.UrlFetchApp = {
  fetch(url) {
    const sinceMatch = url.match(/since=([^&]+)/);
    const untilMatch = url.match(/until=([^&]+)/);
    const since = sinceMatch ? new Date(decodeURIComponent(sinceMatch[1])) : new Date(0);
    const until = untilMatch ? new Date(decodeURIComponent(untilMatch[1])) : new Date();

    const filtered = REAL_DATA.activities.filter(a => {
      const d = new Date(a.createdOn);
      return d >= since && d <= until;
    });

    return {
      getResponseCode() { return 200; },
      getContentText() { return JSON.stringify({ activities: filtered, cursor: null }); }
    };
  }
};

// =============================================================================
// CARREGA PROJETO
// =============================================================================
global.Suevich = {};
const srcDir = path.join(__dirname, '..', 'src');
[
  'core/Config.js', 'core/Logger.js',
  'domain/Transaction.js', 'domain/TransactionDirection.js',
  'utils/ArrayUtils.js', 'utils/CurrencyUtils.js', 'utils/DateUtils.js', 'utils/TextUtils.js',
  'strategies/DirectionStrategy.js', 'strategies/TypeDirectionStrategy.js',
  'strategies/TitleDirectionStrategy.js', 'strategies/SignalDirectionStrategy.js',
  'strategies/DirectionContext.js', 'services/CategoryClassifier.js',
  'services/SheetService.js', 'services/WiseApiService.js',
  'formatters/TransactionFormatter.js', 'formatters/SheetRowFormatter.js',
  'factories/AbstractFactory.js', 'factories/FormatterFactory.js',
  'factories/ServiceFactory.js', 'factories/TransactionFactory.js',
  'factories/FactoryRegistry.js', 'main/SyncPipeline.js'
].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(srcDir, f), 'utf8'), { filename: f }));

// Intercepta transações para inspeção
let lastTransactions = [];
const originalAppend = Suevich.Services.SheetService.appendTransactions;
Suevich.Services.SheetService.appendTransactions = function(transactions) {
  lastTransactions = transactions;
  return transactions.length;
};

// =============================================================================
// TESTES
// =============================================================================
describe('Pipeline com dados REAIS da Wise', () => {
  test('30 dias: deve filtrar e importar apenas do período', () => {
    lastTransactions = [];
    const msg = Suevich.Main.SyncPipeline.run(30);
    console.log('30d:', msg, '| tx:', lastTransactions.length);

    assert.ok(lastTransactions.length > 0, 'deve importar algumas transações');
    assert.ok(lastTransactions.length <= REAL_DATA.activities.length, 'não deve importar mais que o total');

    const cutoff = new Date(Date.now() - 30 * 86400000);
    lastTransactions.forEach(tx => {
      const dateParts = tx.getDate().split('/');
      const d = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      assert.ok(d >= cutoff, `transação ${tx.getId()} (${tx.getDate()}) está fora do período de 30 dias`);
    });
  });

  test('90 dias: deve importar mais transações que 30 dias', () => {
    lastTransactions = [];
    const msg30 = Suevich.Main.SyncPipeline.run(30);
    const count30 = lastTransactions.length;

    lastTransactions = [];
    const msg90 = Suevich.Main.SyncPipeline.run(90);
    const count90 = lastTransactions.length;

    console.log('30d:', count30, '| 90d:', count90);
    assert.ok(count90 >= count30, '90 dias deve importar >= que 30 dias');
  });

  test('deve classificar direções corretamente (Entrada/Saída)', () => {
    lastTransactions = [];
    Suevich.Main.SyncPipeline.run(90);

    const entradas = lastTransactions.filter(tx => tx.getDirection() === 'Entrada');
    const saidas = lastTransactions.filter(tx => tx.getDirection() === 'Saída');

    console.log('Entradas:', entradas.length, '| Saídas:', saidas.length);
    assert.ok(entradas.length > 0, 'deve ter pelo menos uma Entrada');
    assert.ok(saidas.length > 0, 'deve ter pelo menos uma Saída');
  });

  test('deve classificar categorias corretamente', () => {
    lastTransactions = [];
    Suevich.Main.SyncPipeline.run(90);

    const cats = {};
    lastTransactions.forEach(tx => { cats[tx.getCategory()] = (cats[tx.getCategory()] || 0) + 1; });
    console.log('Categorias:', cats);

    assert.ok(Object.keys(cats).length > 0, 'deve ter pelo menos uma categoria');
  });

  test('deve extrair moeda e valor corretamente', () => {
    lastTransactions = [];
    Suevich.Main.SyncPipeline.run(90);

    lastTransactions.forEach(tx => {
      assert.ok(typeof tx.getAmount() === 'number', 'amount deve ser número');
      assert.ok(tx.getAmount() >= 0, 'amount deve ser >= 0');
      assert.ok(tx.getCurrency().length === 3, 'currency deve ter 3 letras');
    });
  });
});

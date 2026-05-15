const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mocks mínimos para DateUtils
global.Logger = { log: () => {} };
global.Session = { getScriptTimeZone: () => 'America/Sao_Paulo' };
global.Utilities = {
  formatDate: (date, tz, fmt) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return fmt.replace('dd', pad(d.getDate())).replace('MM', pad(d.getMonth() + 1)).replace('yyyy', d.getFullYear());
  }
};

// Carrega módulos do projeto
global.Suevich = {};
const srcDir = path.join(__dirname, '..', 'src');
[
  'core/Config.js', 'core/Logger.js',
  'domain/TransactionDirection.js', 'domain/Transaction.js',
  'utils/ArrayUtils.js', 'utils/CurrencyUtils.js', 'utils/DateUtils.js', 'utils/TextUtils.js',
  'strategies/DirectionStrategy.js', 'strategies/TypeDirectionStrategy.js',
  'strategies/TitleDirectionStrategy.js', 'strategies/SignalDirectionStrategy.js'
].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(srcDir, f), 'utf8'), { filename: f }));

// Referências locais para legibilidade
const ArrayUtils = Suevich.Utils.ArrayUtils;
const CurrencyUtils = Suevich.Utils.CurrencyUtils;
const DateUtils = Suevich.Utils.DateUtils;
const TextUtils = Suevich.Utils.TextUtils;
const TransactionDirection = Suevich.Domain.TransactionDirection;
const Transaction = Suevich.Domain.Transaction;
const TypeStrategy = Suevich.Strategies.TypeDirectionStrategy;
const TitleStrategy = Suevich.Strategies.TitleDirectionStrategy;
const SignalStrategy = Suevich.Strategies.SignalDirectionStrategy;

describe('Phase 1 — Unitários Puros', () => {

  describe('ArrayUtils', () => {
    test('unique remove duplicatas', () => {
      assert.deepStrictEqual(ArrayUtils.unique(['a', 'b', 'a', 'c']), ['a', 'b', 'c']);
    });
    test('contains encontra valor', () => {
      assert.strictEqual(ArrayUtils.contains([1, 2, 3], 2), true);
      assert.strictEqual(ArrayUtils.contains([1, 2, 3], 4), false);
    });
  });

  describe('CurrencyUtils', () => {
    test('parseValue extrai número absoluto', () => {
      assert.strictEqual(CurrencyUtils.parseValue('R$ 200,00'), 200.00);
      assert.strictEqual(CurrencyUtils.parseValue('-100.50 BRL'), 100.50);
      assert.strictEqual(CurrencyUtils.parseValue(''), 0);
    });
    test('extractCode retorna moeda de 3 letras', () => {
      assert.strictEqual(CurrencyUtils.extractCode('1.200,00 BRL'), 'BRL');
      assert.strictEqual(CurrencyUtils.extractCode('100 USD'), 'USD');
      assert.strictEqual(CurrencyUtils.extractCode(''), 'BRL');
    });
    test('isNegative detecta sinal', () => {
      assert.strictEqual(CurrencyUtils.isNegative('-50,00'), true);
      assert.strictEqual(CurrencyUtils.isNegative('50,00'), false);
    });
  });

  describe('DateUtils', () => {
    test('formatDateBR formata corretamente', () => {
      assert.strictEqual(DateUtils.formatDateBR('2026-05-14T10:00:00Z'), '14/05/2026');
      assert.strictEqual(DateUtils.formatDateBR(''), '');
    });
    test('getCutoffDate retorna data no passado', () => {
      const cutoff = DateUtils.getCutoffDate(7);
      const expected = new Date();
      expected.setDate(expected.getDate() - 7);
      assert.strictEqual(cutoff.getDate(), expected.getDate());
    });
  });

  describe('TextUtils', () => {
    test('clean remove HTML e espaços', () => {
      assert.strictEqual(TextUtils.clean('<strong>Contabo</strong>'), 'Contabo');
      assert.strictEqual(TextUtils.clean('  espaço  '), 'espaço');
    });
    test('containsAny encontra keyword case-insensitive', () => {
      assert.strictEqual(TextUtils.containsAny('Facebook Ads', ['facebook', 'meta']), true);
      assert.strictEqual(TextUtils.containsAny('Uber viagem', ['ifood', 'restaurante']), false);
    });
  });

  describe('TransactionDirection', () => {
    test('tem ENTRADA, SAIDA e TRANSFERENCIA', () => {
      assert.strictEqual(TransactionDirection.ENTRADA, 'Entrada');
      assert.strictEqual(TransactionDirection.SAIDA, 'Saída');
      assert.strictEqual(TransactionDirection.TRANSFERENCIA, 'Transferência');
    });
  });

  describe('Transaction VO', () => {
    test('imutável com getters', () => {
      const tx = new Transaction({
        id: 'abc', date: '14/05/2026', service: 'AWS', category: 'Software',
        currency: 'BRL', amount: 99.9, direction: 'Saída', rawType: 'TRANSFER'
      });
      assert.strictEqual(tx.getId(), 'abc');
      assert.strictEqual(tx.getDirection(), 'Saída');
      assert.deepStrictEqual(tx.toSheetRow(), ['14/05/2026', 'AWS', 'Software', 'BRL', 99.9, 'Saída', 'abc']);
    });
  });

  describe('TypeDirectionStrategy', () => {
    test('DEPOSIT => ENTRADA', () => {
      assert.strictEqual(TypeStrategy.resolve({ type: 'DEPOSIT' }), 'Entrada');
    });
    test('INTERBALANCE => TRANSFERENCIA', () => {
      assert.strictEqual(TypeStrategy.resolve({ type: 'INTERBALANCE' }), 'Transferência');
    });
    test('TRANSFER interno (To EUR) => TRANSFERENCIA', () => {
      assert.strictEqual(TypeStrategy.resolve({ type: 'TRANSFER', title: 'To <strong>EUR</strong>' }), 'Transferência');
    });
    test('TRANSFER externo => null (fallback)', () => {
      assert.strictEqual(TypeStrategy.resolve({ type: 'TRANSFER' }), null);
    });
    test('tipo desconhecido => null', () => {
      assert.strictEqual(TypeStrategy.resolve({ type: 'UNKNOWN' }), null);
    });
  });

  describe('TitleDirectionStrategy', () => {
    test('"recebido" => ENTRADA', () => {
      assert.strictEqual(TitleStrategy.resolve({ title: 'Valor recebido' }), 'Entrada');
    });
    test('"pagamento" => SAIDA', () => {
      assert.strictEqual(TitleStrategy.resolve({ title: 'Pagamento AWS' }), 'Saída');
    });
    test('título neutro => null', () => {
      assert.strictEqual(TitleStrategy.resolve({ title: 'Contabo' }), null);
    });
  });

  describe('SignalDirectionStrategy', () => {
    test('valor negativo => SAIDA', () => {
      assert.strictEqual(SignalStrategy.resolve({ primaryAmount: '-50 BRL' }), 'Saída');
    });
    test('valor positivo => ENTRADA', () => {
      assert.strictEqual(SignalStrategy.resolve({ primaryAmount: '+50 BRL' }), 'Entrada');
    });
    test('valor zerado => null', () => {
      assert.strictEqual(SignalStrategy.resolve({ primaryAmount: '0 BRL' }), null);
    });
  });
});

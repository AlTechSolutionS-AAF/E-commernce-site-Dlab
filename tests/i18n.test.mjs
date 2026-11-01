import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice, convertFromBase, CURRENCY_CODES, CURRENCIES, BASE_CURRENCY } from '../src/utils/currency.ts';
import { translations, namespaces } from '../src/i18n/translations.ts';

test('formatPrice formats Malaysian Ringgit as RM without cents for whole numbers', () => {
  assert.equal(formatPrice(185, 'MYR'), 'RM185');
  assert.equal(formatPrice(82, 'MYR'), 'RM82');
  assert.equal(formatPrice(219.5, 'MYR'), 'RM219.50');
  assert.equal(formatPrice(0, 'MYR'), 'RM0');
});

test('formatPrice formats SGD and USD using conversion rates', () => {
  // 100 MYR * 0.30 SGD = S$30.00
  assert.equal(formatPrice(100, 'SGD'), 'S$30.00');
  // 100 MYR * 0.23 USD = US$23.00
  assert.equal(formatPrice(100, 'USD'), 'US$23.00');
});

test('CURRENCY_CODES includes MYR as base currency', () => {
  assert.deepEqual(CURRENCY_CODES, ['MYR', 'SGD', 'USD']);
  assert.equal(BASE_CURRENCY, 'MYR');
  assert.equal(CURRENCIES.MYR.symbol, 'RM');
});

test('All i18n namespaces have 100% key parity and no empty strings between EN and MS', () => {
  for (const [name, ns] of Object.entries(namespaces)) {
    const enKeys = Object.keys(ns.en).sort();
    const msKeys = Object.keys(ns.ms).sort();
    assert.deepEqual(
      msKeys,
      enKeys,
      `Namespace "${name}" has key mismatch between EN and MS`
    );

    for (const key of enKeys) {
      assert.ok(ns.en[key] && ns.en[key].length > 0, `Namespace "${name}" key "${key}" in EN is empty`);
      assert.ok(ns.ms[key] && ns.ms[key].length > 0, `Namespace "${name}" key "${key}" in MS is empty`);
    }
  }

  const enTotal = Object.keys(translations.en).length;
  const msTotal = Object.keys(translations.ms).length;
  assert.equal(enTotal, msTotal, 'Total keys in translations.en and translations.ms must match');
  assert.ok(enTotal > 50, `Expected over 50 translation keys, got ${enTotal}`);
});

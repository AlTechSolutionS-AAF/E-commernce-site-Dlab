import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals, formatPrice } from '../src/utils/cartCalculations.ts';
import { direct10SecondAssessment, calculateScentMatch } from '../src/utils/scentMatcher.ts';
import { PRODUCTS, generateWhatsAppLink, generateMultiItemWhatsAppLink } from '../src/data/products.ts';

test('direct10SecondAssessment returns single high-confidence match with chosen size', () => {
  const result = direct10SecondAssessment({
    intensity: 'Intense',
    experience: 'High-energy',
    selectedSizeMl: 10
  });

  assert.ok(result.product);
  assert.equal(result.product.shortCode, 'NO.06 C4');
  assert.equal(result.selectedSize.ml, 10);
  assert.ok(result.confidenceScore >= 90);
});

test('generateWhatsAppLink generates correct encoded URL for direct ordering', () => {
  const url = generateWhatsAppLink('NO.06 C4', 'NOCTURNE', 10);
  assert.ok(url.includes('wa.me/60108371938'));
  assert.ok(url.includes('NO.06%20C4'));
  assert.ok(url.includes('10ml'));
});

test('generateMultiItemWhatsAppLink formats multiple bottles cleanly', () => {
  const items = [
    { product: PRODUCTS[0], size: PRODUCTS[0].sizes[0], quantity: 1 },
    { product: PRODUCTS[1], size: PRODUCTS[1].sizes[1], quantity: 2 }
  ];
  const url = generateMultiItemWhatsAppLink(items, true, 455);
  assert.ok(url.includes('wa.me/60108371938'));
  assert.ok(url.includes('Obsidian%20Coffret'));
});

test('calculateCartTotals calculates subtotal with 10ml, 30ml, 40ml sizes', () => {
  const p = PRODUCTS[0];
  const items = [
    {
      product: p,
      selectedSize: p.sizes[1], // 30ml, $185
      quantity: 1
    }
  ];
  const totals = calculateCartTotals(items);
  assert.equal(totals.subtotal, 185);
});

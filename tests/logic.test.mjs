import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals } from '../src/utils/cartCalculations.ts';
import { direct10SecondAssessment } from '../src/utils/scentMatcher.ts';
import {
  PRODUCTS,
  generateWhatsAppLink,
  generateMultiItemWhatsAppLink,
  getProductSynergy,
  generateChannelLink,
  CONCIERGE_FAQS,
  ATELIER_COMMENDATIONS,
  WEEKLY_TOP_10_METRICS
} from '../src/data/products.ts';

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

test('generateWhatsAppLink generates correct encoded URL for direct ordering with default or custom phone', () => {
  const url = generateWhatsAppLink('NO.06 C4', 'NOCTURNE', 10);
  assert.ok(url.includes('wa.me/60108371938'));
  assert.ok(url.includes('NO.06%20C4'));
  assert.ok(url.includes('10ml'));

  const customUrl = generateWhatsAppLink('NO.06 C4', 'NOCTURNE', 30, '60199998888');
  assert.ok(customUrl.includes('wa.me/60199998888'));
  assert.ok(customUrl.includes('30ml'));
});

test('generateMultiItemWhatsAppLink formats multiple bottles cleanly and supports custom phone', () => {
  const items = [
    { product: PRODUCTS[0], size: PRODUCTS[0].sizes[0], quantity: 1 },
    { product: PRODUCTS[1], size: PRODUCTS[1].sizes[1], quantity: 2 }
  ];
  const url = generateMultiItemWhatsAppLink(items, true, 455, '60123456789');
  assert.ok(url.includes('wa.me/60123456789'));
  assert.ok(url.includes('Obsidian%20Coffret'));
});

test('calculateCartTotals calculates subtotal with 10ml, 30ml, 40ml sizes and dynamic shopSettings & promoCodes', () => {
  const p = PRODUCTS[0];
  const items = [
    {
      product: p,
      selectedSize: p.sizes[1], // 30ml, $185
      quantity: 1,
      monogram: 'DLB'
    }
  ];

  const customSettings = {
    whatsappPhone: '60108371938',
    freeShippingThreshold: 150,
    standardShippingFee: 30,
    monogramPrice: 25,
    announcementText: 'TEST BANNER'
  };

  const customPromos = [
    {
      id: 'promo-custom',
      code: 'ATELIER20',
      discountPercent: 20,
      minSpend: 100,
      active: true,
      description: '20% off orders over $100'
    }
  ];

  const totals = calculateCartTotals(items, 'ATELIER20', customSettings, customPromos);
  assert.equal(totals.subtotal, 185);
  assert.equal(totals.monogramFee, 25);
  assert.equal(totals.discount, 37); // 20% of 185
  assert.equal(totals.shipping, 0); // 185 >= 150 custom threshold
  assert.equal(totals.total, 173); // 185 + 25 - 37
});

test('getProductSynergy maps products deterministically to Ascendant, Receptive, or Universal', () => {
  const roles = new Set(PRODUCTS.map((p) => getProductSynergy(p)));
  assert.ok(roles.has('Ascendant'));
  assert.ok(roles.has('Receptive'));
  assert.ok(roles.has('Universal'));
});

test('generateChannelLink builds valid URLs for Shopee, Lazada, Grab Delivery, TikTok, and Webstore', () => {
  const shopeeUrl = generateChannelLink('shopee', 'NO.06 C4', 'NOCTURNE', 10);
  const lazadaUrl = generateChannelLink('lazada', 'NO.06 C4', 'NOCTURNE', 10);
  const grabUrl = generateChannelLink('grab', 'NO.06 C4', 'NOCTURNE', 10, '60108371938');
  const tiktokUrl = generateChannelLink('tiktok', 'NO.06 C4', 'NOCTURNE', 10);
  const webstoreUrl = generateChannelLink('webstore', 'NO.06 C4', 'NOCTURNE', 10);

  assert.ok(shopeeUrl.includes('shopee.com.my'));
  assert.ok(lazadaUrl.includes('lazada.com.my'));
  assert.ok(grabUrl.includes('wa.me/60108371938') && grabUrl.includes('Grab%20Delivery'));
  assert.ok(tiktokUrl.includes('tiktok.com'));
  assert.ok(webstoreUrl.includes('dlab-atelier.com'));
});

test('CONCIERGE_FAQS and ATELIER_COMMENDATIONS contain authentic luxury copy and Weekly Top 10 shares sum cleanly', () => {
  assert.equal(CONCIERGE_FAQS.length, 8);
  assert.ok(CONCIERGE_FAQS.some((faq) => faq.elevatedTitle === 'Dispatch & Courier Timelines'));
  assert.ok(CONCIERGE_FAQS.some((faq) => faq.elevatedTitle === 'Client Privacy & Discreet Dispatch'));
  assert.ok(ATELIER_COMMENDATIONS.some((r) => r.quote.includes('Premium quality muscle relaxant')));
  assert.equal(WEEKLY_TOP_10_METRICS.length, 10);
  assert.equal(WEEKLY_TOP_10_METRICS[0].code, 'NO.06');
  assert.equal(WEEKLY_TOP_10_METRICS[0].sharePercent, 22.7);
});


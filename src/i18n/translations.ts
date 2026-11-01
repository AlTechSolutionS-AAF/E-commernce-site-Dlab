import type { Language } from './types.ts';
import common from './namespaces/common.ts';
import nav from './namespaces/nav.ts';
import catalog from './namespaces/catalog.ts';
import footer from './namespaces/footer.ts';
import cart from './namespaces/cart.ts';
import wishlist from './namespaces/wishlist.ts';
import checkout from './namespaces/checkout.ts';
import age from './namespaces/age.ts';
import pwa from './namespaces/pwa.ts';
import product from './namespaces/product.ts';
import leaderboard from './namespaces/leaderboard.ts';
import channels from './namespaces/channels.ts';
import quiz from './namespaces/quiz.ts';
import finder from './namespaces/finder.ts';
import archive from './namespaces/archive.ts';
import journal from './namespaces/journal.ts';
import faq from './namespaces/faq.ts';
import commendations from './namespaces/commendations.ts';

/** Every namespace, by name. Exported so tests can check key parity and collisions. */
export const namespaces = {
  common,
  nav,
  catalog,
  footer,
  cart,
  wishlist,
  checkout,
  age,
  pwa,
  product,
  leaderboard,
  channels,
  quiz,
  finder,
  archive,
  journal,
  faq,
  commendations
};

/** All English keys. The union of every namespace's keys is the set of valid `t()` keys. */
type EnglishTable = typeof common.en &
  typeof nav.en &
  typeof catalog.en &
  typeof footer.en &
  typeof cart.en &
  typeof wishlist.en &
  typeof checkout.en &
  typeof age.en &
  typeof pwa.en &
  typeof product.en &
  typeof leaderboard.en &
  typeof channels.en &
  typeof quiz.en &
  typeof finder.en &
  typeof archive.en &
  typeof journal.en &
  typeof faq.en &
  typeof commendations.en;

export type TranslationKey = keyof EnglishTable;

const all = Object.values(namespaces);

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: Object.assign({}, ...all.map((n) => n.en)),
  ms: Object.assign({}, ...all.map((n) => n.ms))
};

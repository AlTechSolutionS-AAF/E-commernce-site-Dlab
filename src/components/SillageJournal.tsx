import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, X, Sparkles } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { useLanguage } from '../i18n/LanguageContext';

interface JournalArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  featuredFlacon: string;
  image: string;
  excerpt: string;
  pullQuote: string;
  paragraphs: string[];
}

interface SillageJournalProps {
  onStartDiagnostic?: () => void;
  onExploreCatalog?: () => void;
}

const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'art-01',
    title: 'The 38% Threshold: Why High Concentration Behaves Differently in Moonlight',
    date: 'OCTOBER 2026',
    readTime: '6 MIN READ',
    category: 'MOLECULAR PERFUMERY',
    author: 'Laurent Vaneau, Master Perfumer — Grasse',
    featuredFlacon: 'NO.06 C4 NOCTURNE (42% Pure Extrait)',
    image: '/products/10ml/06.webp?v=20261029c',
    excerpt:
      'Most commercial fragrances operate between 12% and 18% concentration. When you formulate at 38% to 42% pure extrait, alcohol evaporation decelerates, allowing heavy resinous accords to bond directly with epidermal lipids.',
    pullQuote:
      '“At 38% concentration, a fragrance stops projecting outward in a fleeting burst and instead forms a slow-burning thermal aura around the wearer.”',
    paragraphs: [
      'Conventional Eau de Parfum formulations rely on a high ratio of volatile carrier alcohol to create an immediate, dramatic top-note explosion in a brightly lit department store. Within ninety minutes, however, that volatile lift dissipates, leaving behind synthetic musks.',
      'At DLAB Atelier, our nocturnal extraits are compounded between 35% and 42% aromatic oil concentration. At this density, the Raoult’s law vapor-pressure curve shifts dramatically: top notes of black cardamom, saffron, and bergamot unfold in slow motion over the first two hours rather than the first ten minutes.',
      'As ambient temperatures cool after midnight, the heavy resinous base—Baltic amber, smoked Cambodian oud, and roasted tonka bean—bonds with the skin’s natural lipid barrier, yielding an intimate yet unmistakable 18-to-20-hour sillage trail.'
    ]
  },
  {
    id: 'art-02',
    title: 'Harvesting Cambodian Aquilaria: The Secret of Koh Kong Province',
    date: 'SEPTEMBER 2026',
    readTime: '8 MIN READ',
    category: 'RAW EXTRACTION',
    author: 'Sora Takahashi, Botanical Archivist — Phnom Penh',
    featuredFlacon: 'NO.04 JUNGLE FEVER (40% Pure Extrait)',
    image: '/products/10ml/04.webp?v=20261029c',
    excerpt:
      'Deep within Koh Kong, only trees naturally colonized by fungal mycelium create the resinous agarwood heartwood. We journeyed into the rainforest during the moonless rainy season to verify our sustainable extraction.',
    pullQuote:
      '“True wild-crafted agarwood smells nothing like synthetic oud—it possesses a dark, honeyed, almost plum-like balsamic warmth before the smoke ever appears.”',
    paragraphs: [
      'Uninfected Aquilaria crassna heartwood is pale, buoyant, and nearly odorless. Only when the tree defends itself against natural wounding does it secrete a dense, dark oleoresin that slowly transforms the timber into sinking-grade agarwood.',
      'Working alongside small-batch distillers in Koh Kong Province, our harvest protocol uses hydro-steam distillation in hand-hammered copper stills at sub-boiling temperatures for eleven continuous days.',
      'The resulting oud macerates in French organic beet alcohol for six months inside dark obsidian glass carboys before a single 10ml or 30ml flacon is decanted.'
    ]
  },
  {
    id: 'art-03',
    title: 'The Architecture of Olfactory Layering: Smoked Birch Over Creamy Sandalwood',
    date: 'AUGUST 2026',
    readTime: '5 MIN READ',
    category: 'ATELIER RITUALS',
    author: 'Elena Rostova, Olfactory Director — Paris',
    featuredFlacon: 'NO.01 AMSTERDAM OBSIDIENNE + NO.15 RUSH',
    image: '/products/10ml/01.webp?v=20261029c',
    excerpt:
      'Layering two extraits is not about mixing scents—it is about sculpting time. Apply the heavy resinous base to warm pulse points, and mist the lighter top accords over outer woolens.',
    pullQuote:
      '“When an Ascendant (↑) radiant spice is layered over a Receptive (↓) resinous base, the two compositions create a third, unrepeatable chord.”',
    paragraphs: [
      'Every flacon in the DLAB 93-item archive is classified by its Targeted Synergy Role: Ascendant (↑) compositions built around kinetic spices and radiant woods, Receptive (↓) compositions anchored in velvet resins and nocturnal florals, and Universal (∞) bridges.',
      'To construct a bespoke evening ritual, apply one Receptive extrait directly to the collarbones and inner wrists twenty minutes before dressing. Allow the skin heat to bloom the base accords.',
      'Just before stepping into the night, apply an Ascendant extrait to the back of the neck or coat lapel. As you move, listeners experience the crisp, high-energy sillage first, followed by the deep magnetic undertow.'
    ]
  }
];

export const SillageJournal: React.FC<SillageJournalProps> = ({
  onStartDiagnostic,
  onExploreCatalog
}) => {
  const { t } = useLanguage();
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  return (
    <div>
      {onStartDiagnostic && onExploreCatalog && (
        <HeroSection
          onStartDiagnostic={onStartDiagnostic}
          onExploreCatalog={onExploreCatalog}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E1C1A] border border-[#D4AF37]/50 rounded-[0.25rem]">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Atelier Chronicles
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.01em] text-[#FFFFFF] uppercase">
            {t('journal.title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#cdc5bd] max-w-xl mx-auto">
            Essays on nocturnal chemistry, extraction ethics, and the sensory architecture of shadows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {JOURNAL_ARTICLES.map((art) => (
            <article
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-[#1E1C1A] border border-[#4b4640]/50 hover:border-[#D4AF37]/80 rounded-[0.25rem] overflow-hidden flex flex-col justify-between transition-all group cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#151311]">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0F0E0D]/80 backdrop-blur-sm border border-[#4b4640] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold rounded-[0.125rem]">
                    {art.category}
                  </div>
                </div>

                <div className="p-5 space-y-3 text-left">
                  <div className="flex items-center justify-between text-[10px] text-[#969088] font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
                      {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white uppercase group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#cdc5bd] leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 text-left">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveArticle(art);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-[0.15em] group-hover:underline"
                >
                  <span>{t('journal.readArticle')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Editorial Essay Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="journal-essay-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F0E0D]/90 backdrop-blur-md overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#1E1C1A] border border-[#D4AF37] rounded-[0.25rem] shadow-2xl overflow-hidden my-auto text-left max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 sm:h-64 bg-[#151311] shrink-0">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1A] via-[#1E1C1A]/40 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close essay reader"
                className="absolute top-4 right-4 p-2 bg-[#0F0E0D]/80 text-[#cdc5bd] hover:text-white border border-[#4b4640] rounded-[0.25rem]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 space-y-1.5">
                <span className="inline-block bg-[#0F0E0D]/90 border border-[#D4AF37]/50 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                  {activeArticle.category} • {activeArticle.date} • {activeArticle.readTime}
                </span>
                <h3
                  id="journal-essay-title"
                  className="text-lg sm:text-2xl font-semibold text-white uppercase leading-snug"
                >
                  {activeArticle.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto text-xs sm:text-sm text-[#e7e1de] leading-relaxed">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#2c2a27] text-[11px] font-mono text-[#969088]">
                <span>By {activeArticle.author}</span>
                <span className="text-[#D4AF37]">Archive Ref: {activeArticle.featuredFlacon}</span>
              </div>

              <blockquote className="p-4 bg-[#151311] border-l-2 border-[#D4AF37] text-[#D4AF37] italic text-xs sm:text-sm">
                {activeArticle.pullQuote}
              </blockquote>

              {activeArticle.paragraphs.map((para, index) => (
                <p key={index} className="text-[#cdc5bd] leading-relaxed">
                  {para}
                </p>
              ))}

              <div className="pt-4 border-t border-[#2c2a27] flex flex-wrap items-center justify-between gap-3">
                {onExploreCatalog && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveArticle(null);
                      onExploreCatalog();
                    }}
                    className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[0.25rem]"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Explore Referenced Flacons</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2.5 bg-[#151311] text-[#cdc5bd] hover:text-white border border-[#4b4640] text-xs uppercase tracking-wider rounded-[0.25rem] ml-auto"
                >
                  Close Monograph
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

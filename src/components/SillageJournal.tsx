import React from 'react';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';

export const SillageJournal: React.FC = () => {
  const articles = [
    {
      id: 'art-01',
      title: 'The 38% Threshold: Why High Concentration Behaves Differently in Moonlight',
      date: 'OCTOBER 2026',
      readTime: '6 MIN READ',
      category: 'MOLECULAR PERFUMERY',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=85',
      excerpt: 'Most commercial fragrances operate between 12% and 18% concentration. When you formulate at 38% pure extrait, alcohol evaporation decelerates, allowing heavy resinous accords to bond directly with epidermal lipids.'
    },
    {
      id: 'art-02',
      title: 'Harvesting Cambodian Aquilaria: The Secret of Koh Kong Province',
      date: 'SEPTEMBER 2026',
      readTime: '8 MIN READ',
      category: 'RAW EXTRACTION',
      image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=85',
      excerpt: 'Deep within Koh Kong, only trees naturally colonized by fungal mycelium create the resinous agarwood heartwood. We journeyed into the rainforest during the moonless rainy season to verify the sustainable extraction.'
    },
    {
      id: 'art-03',
      title: 'The Architecture of Olfactory Layering: Smoked Birch Over Creamy Sandalwood',
      date: 'AUGUST 2026',
      readTime: '5 MIN READ',
      category: 'ATELIER RITUALS',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=85',
      excerpt: 'Layering two extraits is not about mixing scents—it is about sculpting time. Apply the heavy resinous base to warm pulse points, and mist the lighter top accords over outer woolens.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E1C1A] border border-[#D4AF37]/50 rounded-[0.25rem]">
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Atelier Chronicles
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.01em] text-[#FFFFFF] uppercase">
          The Sillage Journal
        </h2>
        <p className="text-xs sm:text-sm text-[#cdc5bd] max-w-xl mx-auto">
          Essays on nocturnal chemistry, extraction ethics, and the sensory architecture of shadows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.id}
            className="bg-[#1E1C1A] border border-[#4b4640]/50 hover:border-[#D4AF37]/80 rounded-[0.25rem] overflow-hidden flex flex-col justify-between transition-all group"
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
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    {art.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
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
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-[0.15em] group-hover:underline">
                <span>Read Full Essay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

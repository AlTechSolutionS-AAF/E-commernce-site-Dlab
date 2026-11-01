import React, { useState } from 'react';
import { RAW_MATERIALS, Product } from '../data/products';
import { Globe } from 'lucide-react';
import { useShopData } from '../context/ShopDataContext';
import { useLanguage } from '../i18n/LanguageContext';

interface OlfactoryArchiveProps {
  onSelectProduct: (p: Product) => void;
}

export const OlfactoryArchive: React.FC<OlfactoryArchiveProps> = ({ onSelectProduct }) => {
  const { products } = useShopData();
  const { t } = useLanguage();
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const families = ['All', 'Amber', 'Woody', 'Leather', 'Smoky', 'Floral', 'Gourmand', 'Spiced'];
  const categories = ['All', 'Top', 'Heart', 'Base'];

  const filteredMaterials = RAW_MATERIALS.filter((mat) => {
    const familyMatch = selectedFamily === 'All' || mat.scentFamily === selectedFamily;
    const catMatch = selectedCategory === 'All' || mat.category === selectedCategory;
    return familyMatch && catMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E1C1A] border border-[#D4AF37]/50 rounded-[0.25rem]">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            {t('archive.badge')}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.01em] text-[#FFFFFF] uppercase">
          {t('archive.title')}
        </h2>
        <p className="text-xs sm:text-sm text-[#cdc5bd] max-w-2xl mx-auto">
          {t('archive.desc')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#1E1C1A] p-3 rounded-[0.25rem] border border-[#4b4640]/50">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[#969088] mr-2">{t('archive.familyLabel')}</span>
          {families.map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-3 py-1 text-xs uppercase tracking-wider rounded-[0.125rem] border transition-colors ${
                selectedFamily === fam
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F0E0D] font-bold'
                  : 'border-[#4b4640]/50 text-[#cdc5bd] hover:border-[#969088]'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[#969088] mr-2">Pyramid Tier:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs uppercase tracking-wider rounded-[0.125rem] border transition-colors ${
                selectedCategory === cat
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#151311] font-semibold'
                  : 'border-transparent text-[#969088] hover:text-[#FFFFFF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Raw Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((mat) => {
          // Find matching products containing this note
          const associatedProducts = products.filter((p) => {
            const all = [...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ').toLowerCase();
            return all.includes(mat.name.toLowerCase().split(' ')[0]);
          });

          return (
            <div
              key={mat.name}
              className="bg-[#1E1C1A] border border-[#4b4640]/60 hover:border-[#D4AF37]/80 rounded-[0.25rem] p-5 space-y-4 transition-all duration-200 text-left flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase bg-[#151311] px-2 py-0.5 rounded-[0.125rem] border border-[#2c2a27]">
                    {mat.category} Note • {mat.scentFamily}
                  </span>
                  <span className="text-[10px] text-[#969088] flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#D4AF37]" />
                    {mat.origin}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white uppercase tracking-tight">
                  {mat.name}
                </h3>

                <p className="text-xs text-[#cdc5bd] leading-relaxed">
                  {mat.description}
                </p>
              </div>

              {/* Fragrance Flacons Featuring This Raw Ingredient */}
              <div className="pt-3 border-t border-[#2c2a27]">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#969088] block mb-2">
                  Distilled Within:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {associatedProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="text-[10px] uppercase tracking-wider text-[#D4AF37] bg-[#151311] hover:bg-[#2c2a27] border border-[#4b4640]/50 hover:border-[#D4AF37] px-2 py-1 rounded-[0.125rem] transition-colors"
                    >
                      {p.name} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

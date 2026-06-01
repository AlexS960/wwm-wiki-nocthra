import { useState } from 'react';
import { faqs, siteRoleFaqs } from '../data/gameData';
import { ChevronDown, HelpCircle, Shield } from 'lucide-react';

function FaqAccordion({ items, openIndex, setOpenIndex, offset = 0 }: {
  items: { question: string; answer: string }[];
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
  offset?: number;
}) {
  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const key = offset + index;
        return (
          <div
            key={key}
            className={`bg-ink-800/50 border rounded-xl overflow-hidden transition-all duration-300 ${
              openIndex === key ? 'border-gold-400/30' : 'border-ink-700/30'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === key ? null : key)}
              className="w-full text-left p-5 flex items-start gap-3 cursor-pointer group"
            >
              <HelpCircle className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${
                openIndex === key ? 'text-gold-400' : 'text-ink-400 group-hover:text-gold-400'
              }`} />
              <span className={`font-serif font-bold flex-1 transition-colors ${
                openIndex === key ? 'text-gold-400' : 'text-white group-hover:text-gold-300'
              }`}>
                {faq.question}
              </span>
              <ChevronDown className={`w-5 h-5 text-ink-400 shrink-0 transition-transform duration-300 ${
                openIndex === key ? 'rotate-180' : ''
              }`} />
            </button>
            {openIndex === key && (
              <div className="px-5 pb-5 animate-fadeIn">
                <div className="pl-8 border-l-2 border-gold-400/20">
                  <p className="text-ink-200 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-ink-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">❓</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Часто Задаваемые Вопросы</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            Ответы на популярные вопросы об игре и о сайте гильдии
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold-400" />
          Обязанности ролей на сайте
        </h3>
        <FaqAccordion items={siteRoleFaqs} openIndex={openIndex} setOpenIndex={setOpenIndex} offset={0} />

        <h3 className="font-serif text-xl font-bold text-white mt-12 mb-4">Об игре Where Winds Meet</h3>
        <FaqAccordion items={faqs} openIndex={openIndex} setOpenIndex={setOpenIndex} offset={siteRoleFaqs.length} />

        <div className="mt-12 bg-gradient-to-br from-gold-400/5 to-ink-800/50 border border-gold-400/20 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-gold-400 mb-4 text-center">О Игре</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <InfoCard label="Разработчик" value="Everstone Studio" />
            <InfoCard label="Издатель" value="NetEase Games" />
            <InfoCard label="Движок" value="Messiah Engine" />
            <InfoCard label="Релиз" value="14 Ноября 2025" />
            <InfoCard label="Платформы" value="PC, Mobile" />
            <InfoCard label="Жанр" value="Open-World ARPG" />
            <InfoCard label="Эпоха" value="X век, Китай" />
            <InfoCard label="Модель" value="Free-to-Play" />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-ink-400 text-xs mb-1">{label}</div>
      <div className="text-white font-semibold text-sm">{value}</div>
    </div>
  );
}

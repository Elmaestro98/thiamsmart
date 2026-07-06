"use client";

import { useState, useMemo } from "react";
import { categories, faqs } from "@/app/constants/faqData";
import FAQAccordionItem from "@/components/Faqaccordionitem";
import Title from "@/components/Title";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.categoryId === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      {/* Link Tabler icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
      />

      <main className="min-h-screen bg-stone-50 font-sans">
        {/* Header */}
        <section className="bg-white border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <i className="ti ti-help-circle" aria-hidden="true"></i>
              Centre d&rsquo;aide
            </div>
            <Title className="text-2xl md:text-3xl font-bold text-shop_light_brown leading-tight">
              Questions fréquentes
            </Title>

            <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto">
              Trouvez rapidement une réponse à vos questions sur nos produits,
              livraisons et services.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <i
                className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl"
                aria-hidden="true"
              ></i>
              <input
                type="text"
                placeholder="Rechercher une question…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <i className="ti ti-x text-lg" aria-hidden="true"></i>
                </button>
              )}
            </div>
          </div>
        </section>
        {/* Category tabs */}
        <section className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                  }`}
                >
                  <i
                    className={`ti ${cat.icon} text-base`}
                    aria-hidden="true"
                  ></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-4 py-10">
          {filteredFaqs.length > 0 ? (
            <>
              <p className="text-stone-400 text-sm mb-6">
                {filteredFaqs.length} résultat
                {filteredFaqs.length > 1 ? "s" : ""}
                {searchQuery && (
                  <span>
                    {" "}
                    pour{" "}
                    <span className="text-stone-600 font-medium">
                      &ldquo;{searchQuery}&rdquo;
                    </span>
                  </span>
                )}
              </p>
              <div className="flex flex-col gap-3">
                {filteredFaqs.map((faq, index) => (
                  <FAQAccordionItem key={faq.id} item={faq} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 mb-4">
                <i
                  className="ti ti-search-off text-3xl text-stone-400"
                  aria-hidden="true"
                ></i>
              </div>
              <p className="text-stone-500 text-base mb-2">
                Aucun résultat trouvé
              </p>
              <p className="text-stone-400 text-sm">
                Essayez d&rsquo;autres mots-clés ou{" "}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="text-orange-500 hover:underline font-medium"
                >
                  réinitialisez les filtres
                </button>
              </p>
            </div>
          )}
        </section>

        {/* Contact CTA */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h2 className="text-xl font-bold mb-1">
                Vous n&rsquo;avez pas trouvé votre réponse ?
              </h2>
              <p className="text-orange-100 text-sm">
                Notre équipe est disponible 7j/7j | 24h/24.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+221774714545"
                className="flex items-center gap-2 bg-white text-orange-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <i className="ti ti-phone" aria-hidden="true"></i>
                Appeler
              </a>
              <a
                href="mailto:contact@electromenager.fr"
                className="flex items-center gap-2 bg-orange-400 bg-opacity-40 text-white border border-orange-300 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-opacity-60 transition-colors"
              >
                <i className="ti ti-mail" aria-hidden="true"></i>
                Email
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

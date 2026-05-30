"use client";
import { useState } from "react";
import { FAQItem } from "@/app/constants/faqData";

type FAQAccordionItemProps = {
  item: FAQItem;
  index: number;
};

export default function FAQAccordionItem({
  item,
  index,
}: FAQAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border border-stone-200 rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen ? "shadow-md" : "shadow-none hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-stone-50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold flex items-center justify-center">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-semibold text-stone-800 text-base leading-snug">
            {item.question}
          </span>
        </div>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-orange-500 text-white rotate-45"
              : "bg-stone-100 text-stone-500 group-hover:bg-orange-100 group-hover:text-orange-500"
          }`}
        >
          <i className="ti ti-plus text-base" aria-hidden="true"></i>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 pt-1 bg-white border-t border-stone-100">
          <div className="pl-9">
            <p className="text-stone-600 text-sm leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

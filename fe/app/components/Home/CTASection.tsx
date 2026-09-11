'use client';

import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import { useLanguage } from '@/app/providers/LanguageProvider';

export default function CTASection() {
  const { t, language } = useLanguage();

  return (
    <section className="bg-[#72c059] min-h-80">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Content */}
        <div className="w-full lg:w-2/3 flex items-center px-6 py-10 lg:px-20 lg:py-0">
          <div className="text-black w-full">
            <p className="text-sm font-thin tracking-widest mb-6 opacity-80">
              {t.home.ctaTagline}
            </p>
            <h2 className="max-w-3xl font-anton text-4xl lg:text-5xl uppercase normal-case no-underline leading-[1.2em] tracking-[4.25px] text-black mb-6">
              {t.home.ctaTitle}
            </h2>
            <Link href={`/${language}/contact`} className="!text-black text-sm font-thin">
              {t.home.ctaLink}
            </Link>
          </div>
        </div>

        {/* Right Image - Mobile */}
        <div className="block lg:hidden w-full mt-0 flex items-center justify-center">
          <img 
            src="/images/cta-tools.png" 
            alt="RYU Power Tools"
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Right Image - Desktop */}
        <div className="hidden lg:flex w-1/3 items-center justify-end">
          <img 
            src="/images/cta-tools.png" 
            alt="RYU Power Tools"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

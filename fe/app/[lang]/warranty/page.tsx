'use client';

import React from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';

const WarrantyPage = () => {
  const { t } = useLanguage();
  
  const items = [
    {
      key: '1',
      label: (
        <span className="text-xl font-bold text-[#72c059]">
          {t.warranty.gensetTitle}
        </span>
      ),
      children: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-[#72c059] mb-3">
              {t.warranty.gensetConditions}
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> {t.warranty.gensetSendCard}
              </li>
              <li>
                <span className="font-semibold">b.</span> {t.warranty.gensetDiscount}
              </li>
            </ul>
          </div>

          <p>
            {t.warranty.gensetApplies}
          </p>

          <div>
            <p className="font-semibold text-[#72c059] mb-3">
              {t.warranty.gensetDoesNotApply}
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> {t.warranty.gensetBlank}
              </li>
              <li>
                <span className="font-semibold">b.</span> {t.warranty.gensetNotFilled}
              </li>
              <li>
                <span className="font-semibold">c.</span> {t.warranty.gensetMisuse}
              </li>
              <li>
                <span className="font-semibold">d.</span> {t.warranty.gensetNegligence}
              </li>
              <li>
                <span className="font-semibold">e.</span> {t.warranty.gensetUnauthorized}
              </li>
              <li>
                <span className="font-semibold">f.</span> {t.warranty.gensetModified}
              </li>
              <li>
                <span className="font-semibold">g.</span> {t.warranty.gensetNonOriginal}
              </li>
              <li>
                <span className="font-semibold">h.</span> {t.warranty.gensetExcludes}
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="text-xl font-bold text-[#72c059]">
          {t.warranty.powertoolsTitle}
        </span>
      ),
      children: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-[#72c059] mb-3">
              {t.warranty.powertoolsTerms}
            </p>
            <p className="mb-3">
              {t.warranty.powertoolsApplies}
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> {t.warranty.powertoolsSendCard}
              </li>
              <li>
                <span className="font-semibold">b.</span> {t.warranty.powertoolsDuration}
              </li>
              <li>
                <span className="font-semibold">c.</span> {t.warranty.powertoolsDiscount}
              </li>
              <li>
                <span className="font-semibold">d.</span> {t.warranty.powertoolsLifetime}
              </li>
            </ul>
          </div>

          <p>
            {t.warranty.powertoolsValidOnly}
          </p>

          <div>
            <p className="font-semibold text-[#72c059] mb-3">
              {t.warranty.powertoolsDoesNotApply}
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> {t.warranty.powertoolsBlank}
              </li>
              <li>
                <span className="font-semibold">b.</span> {t.warranty.powertoolsNotFilled}
              </li>
              <li>
                <span className="font-semibold">c.</span> {t.warranty.powertoolsMisuse}
              </li>
              <li>
                <span className="font-semibold">d.</span> {t.warranty.powertoolsNegligence}
              </li>
              <li>
                <span className="font-semibold">e.</span> {t.warranty.powertoolsUnauthorized}
              </li>
              <li>
                <span className="font-semibold">f.</span> {t.warranty.powertoolsModified}
              </li>
              <li>
                <span className="font-semibold">g.</span> {t.warranty.powertoolsNonOriginal}
              </li>
              <li>
                <span className="font-semibold">h.</span> {t.warranty.powertoolsExcludes}
              </li>
            </ul>
          </div>

          <p className="font-semibold">
            {t.warranty.powertoolsReserves}
          </p>

          <p className="font-semibold">
            {t.warranty.powertoolsShipping}
          </p>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className="text-xl font-bold text-[#72c059]">
          {t.warranty.inverterTitle}
        </span>
      ),
      children: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-[#72c059] mb-3">
              {t.warranty.inverterConditions}
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> {t.warranty.inverterSendCard}
              </li>
              <li>
                <span className="font-semibold">b.</span> {t.warranty.inverterValid}
                <ul className="list-none space-y-1 ml-6 mt-2">
                  <li>
                    – {t.warranty.inverterFirstYear}
                  </li>
                  <li>
                    – {t.warranty.inverterSecondYear}
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">c.</span> {t.warranty.inverterLifetime}
              </li>
            </ul>
          </div>

          <p>
            {t.warranty.inverterApplies}
          </p>

          <div>
            <p className="font-semibold text-[#72c059] mb-3">
              {t.warranty.inverterDoesNotApply}
            </p>
            <ul className="list-none space-y-2 ml-4">
              <li>
                <span className="font-semibold">a.</span> {t.warranty.inverterBlank}
              </li>
              <li>
                <span className="font-semibold">b.</span> {t.warranty.inverterNotFilled}
              </li>
              <li>
                <span className="font-semibold">c.</span> {t.warranty.inverterMisuse}
              </li>
              <li>
                <span className="font-semibold">d.</span> {t.warranty.inverterNegligence}
              </li>
              <li>
                <span className="font-semibold">e.</span> {t.warranty.inverterUnauthorized}
              </li>
              <li>
                <span className="font-semibold">f.</span> {t.warranty.inverterModified}
              </li>
              <li>
                <span className="font-semibold">g.</span> {t.warranty.inverterNonOriginal}
              </li>
            </ul>
          </div>

          <p className="font-semibold">
            {t.warranty.inverterReserves}
          </p>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#72c059] mb-4 underline text-center">
          {t.warranty.pageTitle}
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          {t.warranty.pageSubtitle}
        </p>

        <div className="space-y-8 mb-12">
          {items.map((item) => (
            <div key={item.key} className="bg-white ">
              <div className="mb-4">{item.label}</div>
              <div>{item.children}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer"
            onClick={() => (window.location.href = '/contact')}
          >
            {t.warranty.contactUs}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;

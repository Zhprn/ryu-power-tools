'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Collapse, Spin, Empty } from 'antd';
import { SearchOutlined, MessageOutlined, RightOutlined, LoadingOutlined } from '@ant-design/icons';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useTranslatedData } from '@/app/hooks/useTranslatedData';
import type { ServiceCenter } from '@/app/lib/service-center-api';
import { getPublicServiceCenters } from '@/app/lib/service-center-api';

const ServiceCenterPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  // Translate service centers
  const { translated: translatedCenters, isLoading: isTranslating } = useTranslatedData(
    serviceCenters.length > 0 ? { items: serviceCenters } : null,
    language,
    [] // Translate all fields
  );

  useEffect(() => {
    (async () => {
      try {
        const centers = await getPublicServiceCenters();
        setServiceCenters(centers);
      } catch (error) {
        console.error('Failed to load service centers:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredCenters = (translatedCenters?.items || serviceCenters).filter((center: any) =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const items = filteredCenters.map((center: any) => ({
    key: center.id,
    label: (
      <div className="flex justify-between items-center w-full pr-4">
        <span
          className={
            `font-semibold text-base ${activeKeys.includes(center.id) ? 'text-[#72bd5a]' : 'text-black'}`
          }
        >
          {center.name}
        </span>
      </div>
    ),
    children: (
      <div className="py-2">
        <p className="text-gray-700 leading-relaxed">{center.address}</p>
        {center.phone && (
          <a
            href={`https://wa.me/${center.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2d5016] font-semibold hover:underline mt-3 inline-flex items-center gap-2"
          >
            <MessageOutlined /> {t.serviceCenter.chatWhatsapp}
          </a>
        )}
        {center.email && (
          <p className="text-gray-600 mt-2">
            <strong>{t.serviceCenter.email}:</strong> {center.email}
          </p>
        )}
      </div>
    ),
  }));

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
      <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl underline font-bold text-[#72c059] mb-4">
          {t.serviceCenter.title.toUpperCase()}
        </h2>
      </div>
      {/* Service Centers List */}
      <div className="space-y-4">
        <Spin 
          spinning={loading || isTranslating} 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#72c059' }} />}
        >
          {!loading && filteredCenters.length > 0 ? (
            <Collapse
              items={items}
              className="bg-white"
              bordered={false}
              style={{ backgroundColor: 'white' }}
              activeKey={activeKeys}
              
              onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
              expandIcon={({ isActive }) =>
                isActive ? (
                  <RightOutlined className="text-[#72bd5a]" rotate={90} />
                ) : (
                  <SearchOutlined className="text-gray-400" />
                )
              }
              expandIconPlacement="end"
            />
          ) : !loading ? (
            <Empty 
              description={t.serviceCenter.noServiceCenters}
              style={{ marginTop: '60px', marginBottom: '60px' }}
            />
          ) : null}
        </Spin>
      </div>

      {/* Contact CTA */}
      <div className="mt-16 pt-8 border-t border-black flex justify-center">
        <Link href={`/${language}/contact`}>
          <button
            type="button"
            className="px-6 sm:px-10 py-2 sm:py-2.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base  tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer"
          >
            {t.contact.title.toUpperCase()}
          </button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default ServiceCenterPage;

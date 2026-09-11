'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useLanguage } from '@/app/providers/LanguageProvider';
import type { Category } from '@/app/lib/category-api';

export default function FeaturedSection() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParentCategories();
  }, []);

  const loadParentCategories = async () => {
    try {
      // Get categories without auth (public endpoint)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}/category`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      const allCategories = result.data || result;
      
      // Filter only parent categories (no parentId)
      const parentCategories = Array.isArray(allCategories)
        ? allCategories
            .filter((cat: Category) => !cat.parentId)
            .slice(0, 4) // Show only first 4
        : [];

      setCategories(parentCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '/images/feature_product.webp';
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${imageUrl}`;
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 underline decoration-2 underline-offset-4">
            {t.home.featuredTitle}
          </h2>
        </div>

        <Spin 
          spinning={loading} 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#72c059' }} />}
        >
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col h-full">
                  <Link href={`/${language}/category/${category.slug}`}>
                    <div className="overflow-hidden rounded-none mb-4 shadow-md hover:scale-110 transition-transform duration-500">
                    <img
                      src={getImageUrl(category.imageUrl)}
                      alt={category.name}
                      className="w-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/images/product.jpg";
                      }}
                    />
                  </div>
                  </Link>
                  <h3 className="text-xl font-bold text-[#1c244b] mb-3">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#324A6D] leading-relaxed">
                    {category.description || t.home.featuredPlaceholder.replace('{category}', category.name)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <Empty 
              description={t.home.noCategories} 
              style={{ marginTop: '60px', marginBottom: '60px' }}
            />
          )}
        </Spin>
      </div>
    </div>
  );
}

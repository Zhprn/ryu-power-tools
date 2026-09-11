'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useLanguage } from '@/app/providers/LanguageProvider';
import type { Article } from '@/app/lib/article-api';
import dayjs from 'dayjs';

export default function NewsArticleSection() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublishedArticles();
  }, []);

  const loadPublishedArticles = async () => {
    try {
      // Get articles without auth (public endpoint)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}/article`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const result = await response.json();
      const allArticles = result.data || result;
      
      // Filter only published articles and get first 4
      const publishedArticles = Array.isArray(allArticles)
        ? allArticles
            .filter((article: Article) => article.status === 'PUBLISHED')
            .slice(0, 4)
        : [];

      setArticles(publishedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '/images/article.jpg';
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${imageUrl}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No date';
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {/* NEWS & ARTICLE */}
        <div className="mb-24">
          <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 underline decoration-2 underline-offset-4">
              {t.home.newsTitle}
            </h2>
          </div>

          <Spin 
            spinning={loading} 
            indicator={<LoadingOutlined style={{ fontSize: 48, color: '#72c059' }} />}
          >
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map((article) => (
                  <Link href={`/${language}/blog/${article.slug}`} key={article.slug || article.id}>
                    <div className="flex flex-col h-full group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="overflow-hidden">
                        <img 
                          src={getImageUrl(article.primaryImage)} 
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4 line-clamp-3 leading-tight group-hover:text-primary transition-colors text-center">
                          {article.title}
                        </h3>
                        <div className="border-t border-gray-300 -mx-6 mt-auto pt-4 px-6">
                          <p className="text-xs text-gray-400 text-center">
                            {formatDate(article.publishedAt || article.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <Empty 
                description={t.home.noArticles}
                style={{ marginTop: '60px', marginBottom: '60px' }}
              />
            )}
          </Spin>
        </div>

      </div>
    </div>
  );
}

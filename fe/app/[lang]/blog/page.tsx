'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useTranslatedData } from '@/app/hooks/useTranslatedData';
import type { Article } from '@/app/lib/article-api';
import { getPublicArticles } from '@/app/lib/article-api';

export default function BlogPage() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Translate all articles
  const { translated: translatedArticles, isLoading: isTranslating } = useTranslatedData(
    articles.length > 0 ? { items: articles } : null,
    language,
    [] // Translate all fields
  );

  useEffect(() => {
    (async () => {
      try {
        const list = await getPublicArticles();
        // sort by publishedAt/createdAt desc and take latest 12
        const sorted = [...list].sort((a, b) => {
          const da = dayjs(a.publishedAt || a.createdAt);
          const db = dayjs(b.publishedAt || b.createdAt);
          return db.valueOf() - da.valueOf();
        });
        setArticles(sorted.slice(0, 12));
      } catch (e) {
        console.error('Failed to load articles', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '/images/article.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${apiBase}${imageUrl}`;
  };

  const formatDate = (date?: string) =>
    date ? dayjs(date).format('DD MMMM YYYY') : '';

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#72c059] underline mb-4">
            {t.blog.title.toUpperCase()}
          </h1>
          <p className="text-lg text-gray-600">
            {t.blog.subtitle}
          </p>
        </div>

        <Spin
          spinning={loading || isTranslating}
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#72c059' }} />}
        >
          {(translatedArticles?.items || articles).length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(translatedArticles?.items || articles).map((article: any) => (
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
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 line-clamp-3 leading-tight group-hover:text-[#72c059] transition-colors text-center">
                        {isTranslating ? '...' : article.title}
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
            <Empty description={t.blog.noArticlesFound} style={{ marginTop: 60, marginBottom: 60 }} />
          )}
        </Spin>
      </div>
    </div>
  );
}

'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Spin, Empty, Card } from 'antd';
import { LoadingOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/app/lib/product-api';
import { searchPublicProducts } from '@/app/lib/product-api';
import { useLanguage } from '@/app/providers/LanguageProvider';

const SearchContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const query = searchParams.get('q') || '';
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const results = await searchPublicProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  const getImageUrl = (product: Product): string => {
    if (product.productImages && product.productImages.length > 0) {
      const url = product.productImages[0].url;
      return url.startsWith('http') ? url : `${apiBase}${url}`;
    }
    return '/images/product.jpg';
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          {query.trim() && (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 decoration-2 underline-offset-4">
                {t.common.search}: &quot;{query}&quot;
              </h2>
              {!loading && (
                <p className="text-lg text-gray-600">
                  {t.search.resultsCount.replace('{count}', products.length.toString())}
                </p>
              )}
            </>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex justify-center">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#72c059' }} />} />
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <Link href={`/${language}/product/${product.id}`} key={product.id}>
                <div className="flex flex-col items-center">
                  <Card
                    hoverable
                    className="w-full border-none shadow-none bg-transparent hover:translate-y-[-8px] transition-all duration-300"
                    cover={
                      <div className="w-full h-full border-none shadow-none flex items-center justify-center bg-white p-5">
                        <Image
                          alt={product.name}
                          src={getImageUrl(product)}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder-product.jpg";
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <h3 className="text-xl font-semibold text-[#2d5016] my-5 text-center">
                          {product.name}
                        </h3>
                      }
                      description={
                        <div className="flex flex-col items-center">
                          <Button
                            type="primary"
                            block
                            className="bg-[#e8e8e8] text-[#4a4a4a] border-none font-semibold h-[45px] rounded-none text-sm tracking-wide uppercase hover:bg-[#2d5016] hover:text-white"
                          >
                            READ MORE
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        ) : !loading && query.trim() && products.length === 0 ? (
          <Empty
            description={
              <span className="text-lg">
                {t.home.noProducts}
              </span>
            }
            style={{ marginTop: '60px', marginBottom: '60px' }}
          >
            <Link href={`/${language}`}>
              <Button type="primary" size="large" className="bg-[#2d5016] hover:bg-[#3d7a3e]">
                {t.common.back}
              </Button>
            </Link>
          </Empty>
        ) : !loading && !query.trim() ? (
          <Empty
            description={
              <span className="text-lg">
                {t.search.enterQuery}
              </span>
            }
            style={{ marginTop: '60px', marginBottom: '60px' }}
          >
            <Link href="/">
              <Button type="primary" size="large" className="bg-[#2d5016] hover:bg-[#3d7a3e]">
                {t.common.back}
              </Button>
            </Link>
          </Empty>
        ) : null}
      </div>
    </div>
  );
};

const SearchPage: React.FC = () => (
  <Suspense
    fallback={
      <div className="bg-white py-20">
        <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16 flex justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#72c059' }} />} />
        </div>
      </div>
    }
  >
    <SearchContent />
  </Suspense>
);

export default SearchPage;

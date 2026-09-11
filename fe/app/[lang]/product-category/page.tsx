"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTranslatedData } from "@/app/hooks/useTranslatedData";
import type { CategoryNode } from "@/app/lib/category-api";
import { getPublicCategoryTree } from "@/app/lib/category-api";

export default function ProductCategoryIndexPage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  const { translated: translatedCategories, isLoading: isTranslating } =
    useTranslatedData(
      categories.length > 0 ? { items: categories } : null,
      language,
      ["name", "description"]
    );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const tree = await getPublicCategoryTree();
        setCategories(tree || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return "/images/product.jpg";
    return imageUrl.startsWith("http") ? imageUrl : `${apiBase}${imageUrl}`;
  };

  const items = useMemo(() => {
    return (translatedCategories?.items || categories).filter(Boolean);
  }, [translatedCategories, categories]);

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-12">
          {loading ? (
            <div className="py-20">
              <Spin
                indicator={
                  <LoadingOutlined style={{ fontSize: 48, color: "#72c059" }} />
                }
              />
            </div>  
          ) : (
            <>
              <h1 className="text-5xl font-bold text-[#72c059] mb-3">
                Product Categories
              </h1>
              <p className="text-lg text-gray-600">
                Explore categories and find the right tools.
              </p>
            </>
          )}
        </div>

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {items.map((category: any) => (
              <Link
                href={`/${language}/product-category/${category.slug}`}
                key={category.id}
              >
                <div className="flex flex-col items-center">
                  <Card
                    hoverable
                    className="w-full border-none shadow-none bg-transparent hover:translate-y-[-8px] transition-all duration-300"
                    cover={
                      <div className="w-full h-full border-none shadow-none flex items-center justify-center bg-white p-5">
                        <Image
                          alt={category.name}
                          src={getImageUrl(category.imageUrl)}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <h3 className="text-xl font-semibold text-[#72c059] my-5 text-center">
                          {isTranslating ? "..." : category.name}
                        </h3>
                      }
                      description={
                        category.description ? (
                          <p className="text-gray-600 text-center">
                            {isTranslating ? "..." : category.description}
                          </p>
                        ) : null
                      }
                    />
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-3xl text-gray-900 mb-3">No Categories</h3>
            <p className="text-base text-gray-600">
              Categories are being updated. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

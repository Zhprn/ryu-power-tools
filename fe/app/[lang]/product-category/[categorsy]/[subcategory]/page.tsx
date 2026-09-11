"use client";

import React, { useState, useEffect, use } from "react";
import { Card, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import type { Product } from "@/app/lib/product-api";
import type { Category } from "@/app/lib/category-api";
import { getPublicProductsByCategorySlug } from "@/app/lib/product-api";
import { getPublicCategoryBySlug } from "@/app/lib/category-api";

interface ProductCategoryPageProps {
  params: Promise<{
    categorsy: string;
    subcategory: string;
  }>;
}

const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({
  params,
}) => {
  const { categorsy, subcategory } = use(params);
  const { language } = useLanguage();
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<
    (Category & { productCount: number })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"products" | "subcategories">(
    "products"
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log('=== Loading category:', subcategory, '===');

        // First, get category data
        const categoryData = await getPublicCategoryBySlug(subcategory);
        console.log('Category data:', categoryData);
        setCategory(categoryData);

        // Try to get children first (prioritas)
        try {
          const { getPublicCategoryChildrenBySlug } = await import("@/app/lib/category-api");
          const childrenData = await getPublicCategoryChildrenBySlug(subcategory);
          console.log('Children data received:', childrenData);
          console.log('Children array:', childrenData?.children);
          console.log('Children length:', childrenData?.children?.length);
          
          // Check if category has children - jika ada subcategory, tampilkan subcategory
          if (childrenData && childrenData.children && childrenData.children.length > 0) {
            console.log('✅ HAS CHILDREN - Showing subcategories:', childrenData.children.length);
            setSubcategories(childrenData.children);
            setViewMode("subcategories");
            setProducts([]); // Clear products when showing subcategories
          } else {
            // If no children, get products - jika tidak ada subcategory, baru tampilkan produk
            console.log('❌ NO CHILDREN - Fetching products for', subcategory);
            const productsData = await getPublicProductsByCategorySlug(subcategory);
            console.log('Products fetched:', productsData?.length);
            setProducts(productsData);
            setSubcategories([]); // Clear subcategories when showing products
            setViewMode("products");
          }
        } catch (childrenError) {
          console.error('⚠️ ERROR fetching children:', childrenError);
          // If error getting children, try to get products
          try {
            const productsData = await getPublicProductsByCategorySlug(subcategory);
            console.log('Fallback: Products fetched:', productsData?.length);
            setProducts(productsData);
            setSubcategories([]);
            setViewMode("products");
          } catch (productError) {
            console.error('⚠️ ERROR fetching products:', productError);
            // Both failed, show empty state
            setProducts([]);
            setSubcategories([]);
            setViewMode("products");
          }
        }
      } catch (error) {
        console.error("❌ Failed to load category:", error);
      } finally {
        setLoading(false);
        console.log('=== Loading complete ===');
      }
    })();
  }, [subcategory]);

  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return "/images/product.jpg";
    return imageUrl.startsWith("http") ? imageUrl : `https://nest-api.ryupowertools.com${imageUrl}`;
  };

  const getProductImageUrl = (product: Product): string => {
    if (product.productImages && product.productImages.length > 0) {
      const url = product.productImages[0].url;
      return url.startsWith("http") ? url : `${apiBase}${url}`;
    }
    return "/images/product.jpg";
  };

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
                {category?.name || "Category"}
              </h1>
              {category?.description && (
                <p className="text-lg text-gray-600">{category.description}</p>
              )}
            </>
          )}
        </div>

        {!loading && viewMode === "subcategories" && subcategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {subcategories.map((subcat) => (
              <Link
                href={`/${language}/product-category/${categorsy}/${subcategory}/${subcat.slug}`}
                key={subcat.id}
              >
                <div className="flex flex-col items-center">
                  <Card
                    hoverable
                    className="w-full border-none shadow-none bg-transparent hover:translate-y-[-8px] transition-all duration-300"
                    cover={
                      <div className="w-full h-full border-none shadow-none flex items-center justify-center bg-white p-5">
                        <Image
                          alt={subcat.name}
                          src={getImageUrl(subcat.imageUrl)}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder-product.jpg";
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <h3 className="text-xl font-semibold text-[#72c059] my-5 text-center">
                          {subcat.name}
                        </h3>
                      }
                      description={
                        <div className="flex flex-col items-center">
                          <p className="text-gray-600 mb-4 text-center">
                            {subcat.productCount || 0} Product
                            {subcat.productCount !== 1 ? "s" : ""}
                          </p>
                          <Button
                            type="primary"
                            block
                            className="bg-[#e8e8e8] text-[#4a4a4a] border-none font-semibold h-[45px] rounded-none text-sm tracking-wide uppercase hover:bg-[#589244] hover:text-white"
                          >
                            VIEW PRODUCTS
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && viewMode === "products" && products.length > 0 ? (
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
                          src={getProductImageUrl(product)}
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
                        <h3 className="text-xl font-semibold text-[#72c059] my-5 text-center">
                          {product.name}
                        </h3>
                      }
                      description={
                        <div className="flex flex-col items-center">
                          <Button
                            type="primary"
                            block
                            className="bg-[#72c059] text-[#4a4a4a] border-none font-semibold h-[45px] rounded-none text-sm tracking-wide uppercase hover:bg-[#589244] hover:text-white"
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
        ) : !loading && viewMode === "products" && products.length === 0 && subcategories.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-3xl text-gray-900 mb-3">
              No Products Available
            </h3>
            <p className="text-base text-gray-600 mb-8">
              Products for this category are coming soon.
            </p>
            <Link href="/">
              <Button
                type="primary"
                size="large"
                className="bg-[#2d5016] hover:bg-[#3d7a3e]"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCategoryPage;

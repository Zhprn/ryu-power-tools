"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Spin, Empty } from "antd";
import { useLanguage } from "@/app/providers/LanguageProvider";
import {
  getPublicProductById,
  getPublicLatestProducts,
  Product as ApiProduct,
  ProductImage as ApiProductImage,
  ProductCategory,
} from "@/app/lib/product-api";
import {
  getPublicCategoryTree,
  CategoryNode as ApiCategoryNode,
} from "@/app/lib/category-api";
import { useTranslatedData } from "@/app/hooks/useTranslatedData";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "/images/product.jpg";
  if (url.startsWith("http")) return url;
  return `${apiBase}${url}`;
};

// ZoomableImage component for preview modal
const ZoomableImage = ({ src, alt }: { src: string; alt: string }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((prev) => Math.min(Math.max(1, prev + delta), 4));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <img
      src={src}
      alt={alt}
      className="max-w-full max-h-[70vh] object-contain select-none"
      style={{
        transform: `scale(${scale}) translate(${position.x / scale}px, ${
          position.y / scale
        }px)`,
        cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
        transition: isDragging ? "none" : "transform 0.2s",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => scale === 1 && setScale(2)}
      onDoubleClick={() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/images/product.jpg";
      }}
      draggable={false}
    />
  );
};

export default function ProductDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [latestProducts, setLatestProducts] = useState<ApiProduct[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<
    ApiCategoryNode[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Translate product
  const { translated: translatedProduct, isLoading: isTranslatingProduct } = useTranslatedData(
    product,
    language,
    ['name', 'description']
  );

  // Translate latest products
  const { translated: translatedLatestProducts, isLoading: isTranslatingLatest } = useTranslatedData(
    latestProducts.length > 0 ? { items: latestProducts } : null,
    language,
    [] // Translate all fields
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product by ID
        const productData = await getPublicProductById(productId);
        if (productData) {
          setProduct(productData);
        }

        // Fetch latest products
        const latestData = await getPublicLatestProducts(6);
        if (latestData) {
          setLatestProducts(latestData);
        }

        // Fetch parent categories from tree for featured section
        const categoryTree = await getPublicCategoryTree();
        if (categoryTree) {
          setFeaturedCategories(
            Array.isArray(categoryTree) ? categoryTree.slice(0, 4) : []
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-white py-20 flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white py-20">
        <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16 text-center">
          <Empty description={t.product.productNotFound} />
          <Link
            href="/"
            className="text-[#2d5016] hover:underline mt-4 inline-block"
          >
            {t.product.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = product.productImages?.[selectedImageIndex] ||
    product.productImages?.[0] || {
      url: "/images/product.jpg",
    };
  const primaryImageUrl = getImageUrl(primaryImage.url);

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Info */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2d5016] mb-6">
              {isTranslatingProduct ? '...' : translatedProduct?.name || product?.name}
            </h1>

            <div className="mb-6">
              <div className="prose prose-lg max-w-none">
                <span className="text-[#333] font-bold min-w-[100px] text-base">
                  {t.product.specifications}:
                </span>
                <pre className="whitespace-pre-wrap font-sans text-black leading-relaxed  py-4 rounded-lg text-sm">
                  {isTranslatingProduct ? '...' : translatedProduct?.description || product?.description}
                </pre>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <span className="text-[#333] font-bold min-w-[100px] text-base">
                  {t.product.categories}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.productCategory?.map((cat, index) => (
                    <span
                      key={index}
                      className="text-[#2d5016] hover:underline cursor-pointer"
                    >
                      {cat.category.name}
                      {index < (product.productCategory?.length || 0) - 1 &&
                        ", "}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <div className="flex justify-center sm:justify-start">
              <Link href={`/${language}/contact`}>
                <button className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base font-semibold tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer mb-8">
                  {t.product.contactUs}
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg sticky top-24 relative group">
              <div
                className="overflow-hidden cursor-zoom-in"
                style={{ position: "relative" }}
                tabIndex={0}
                onClick={() => setShowPreview(true)}
              >
                <img
                  src={primaryImageUrl}
                  alt={product.name}
                  className="w-full h-auto object-contain transition-none"
                  style={{ transition: "none" }}
                  onMouseMove={(e) => {
                    const img = e.currentTarget;
                    const rect = img.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    img.style.transformOrigin = `${x}% ${y}%`;
                    img.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget;
                    img.style.transform = "scale(1)";
                    img.style.transformOrigin = "center center";
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/images/product.jpg";
                  }}
                />
                {/* View Image Button */}
                <button
                  type="button"
                  className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(true);
                  }}
                  title="View Image"
                >
                  {/* Magnifier Icon SVG */}
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#2d5016"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                  </svg>
                </button>
              </div>

              {/* Thumbnail Images */}
              {product.productImages && product.productImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto p-2">
                  {product.productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImageIndex === index
                          ? "border-[#2d5016] ring-2 ring-[#2d5016]"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={getImageUrl(img.url)}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/product.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Preview Modal */}
              {showPreview && (
                <div
                  className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
                  onClick={() => setShowPreview(false)}
                >
                  <div
                    className="relative bg-white rounded-lg p-4 max-w-3xl w-full flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                      onClick={() => setShowPreview(false)}
                      aria-label="Close"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#2d5016"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="6" y1="18" x2="18" y2="6" />
                      </svg>
                    </button>
                    <div
                      className="overflow-hidden cursor-zoom-in w-full flex justify-center items-center"
                      style={{ maxHeight: "70vh" }}
                      tabIndex={0}
                      onClick={(e) => {
                        // Prevent closing modal on image click
                        e.stopPropagation();
                      }}
                    >
                      <ZoomableImage src={primaryImageUrl} alt={product.name} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Products Section */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 decoration-2 underline-offset-4">
              {t.product.latest}
            </h2>
            <p className="text-gray-600">{t.product.latestSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {(translatedLatestProducts?.items || latestProducts).map((item: any) => {
              const itemImage = item.productImages?.[0];
              const itemImageUrl = getImageUrl(itemImage.url);

              return (
                <Link href={`/${language}/product/${item.id}`} key={item.id}>
                  <div className="flex flex-col h-full items-center justify-between">
                    <div className="bg-white border-3 border-[#72c059] flex items-center justify-center aspect-square w-full overflow-hidden ">
                      <img
                        src={itemImageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/product.jpg";
                        }}
                      />
                    </div>
                    <h4 className="text-xl font-semibold text-[#72c059] my-5 text-center">
                      {isTranslatingLatest ? '...' : item.name}
                    </h4>
                    <button className="px-6 py-2 bg-primary text-white border-none font-semibold text-sm tracking-wide uppercase hover:bg-[#2d5016] hover:text-white transition-colors cursor-pointer">
                      {t.product.readMore}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Products Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 underline decoration-2 underline-offset-4">
              {t.product.featured}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category) => (
              <div key={category.id} className="group">
                <Link
                  href={`/${language}/product-category/${category.slug}`}
                  className="block cursor-pointer"
                >
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
                <Link
                  href={`/${language}/product-category/${category.slug}`}
                  className="block cursor-pointer"
                >
                  <h4 className="text-xl font-bold text-[#72c059] mb-2 hover:text-[#72bd5a] transition-colors">
                    {category.name}
                  </h4>
                </Link>
                <p className="text-[#324A6D] text-sm lg:text-base leading-relaxed select-text cursor-text group-hover:cursor-text">
                  {category.description || t.product.exploreRange}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

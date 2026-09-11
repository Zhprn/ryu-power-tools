"use client";

import { Button, Row, Col, Card } from "antd";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function AboutSection() {
  const { t, language } = useLanguage();

  const categories = [
    {
      src: "/images/welding.webp",
      label: t.home.categories.welding,
      alt: "Welding Tools",
      width: "w-full",
      height: { mobile: "h-32", desktop: "md:h-[200px]" },
    },
    {
      src: "/images/powertools.webp",
      label: t.home.categories.powerTools,
      alt: "Power Tools",
      width: "w-full",
      height: { mobile: "h-64", desktop: "md:h-[400px]" },
    },
    {
      src: "/images/engine.webp",
      label: t.home.categories.engine,
      alt: "Engine",
      width: "w-full",
      height: { mobile: "h-64", desktop: "md:h-[400px]" },
    },
    {
      src: "/images/accessories.webp",
      label: t.home.categories.accessories,
      alt: "Accessories",
      width: "w-full",
      height: { mobile: "h-32", desktop: "md:h-[200px]" },
    },
  ];

  return (
    <div
      className="py-20"
      style={{ background: 'linear-gradient(to top, #a3a3a3 0%, #ffffff 25%)', overflowX: 'hidden' }}
    >
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <Row gutter={[{ xs: 8, sm: 16, md: 40, lg: 80 }, 80]} align="middle">
          <Col xs={{ span: 24, order: 2 }} lg={{ span: 12, order: 1 }}>
            <Row gutter={[{ xs: 8, sm: 16, md: 20, lg: 20 }, 20]}>
              <Col xs={12}>
              <div className="md:space-y-4">
                {/* WELDING */}
                <div
                className={`flex justify-end relative overflow-hidden ${categories[0].height.mobile} ${categories[0].height.desktop}`}
                >
                <img
                  src={categories[0].src}
                  alt={categories[0].alt}
                  className="h-full object-contain"
                />
                </div>

                {/* ENGINE */}
                <div
                className={`flex justify-end relative overflow-hidden ${categories[2].height.mobile} ${categories[2].height.desktop}`}
                >
                <img
                  src={categories[2].src}
                  alt={categories[2].alt}
                  className="h-full object-contain"
                />
                </div>
              </div>
              </Col>

              <Col xs={12}>
              <div className="md:space-y-4">
                {/* POWER TOOLS */}
                <div
                className={`flex justify-start relative overflow-hidden ${categories[1].height.mobile} ${categories[1].height.desktop}`}
                >
                <img
                  src={categories[1].src}
                  alt={categories[1].alt}
                  className="h-full object-contain"
                />
                </div>

                {/* ACCESSORIES */}
                <div
                className={`flex justify-start relative overflow-hidden ${categories[3].height.mobile} ${categories[3].height.desktop}`}
                >
                <img
                  src={categories[3].src}
                  alt={categories[3].alt}
                  className="h-full object-contain"
                />
                </div>
              </div>
              </Col>
            </Row>
            </Col>

          <Col xs={{ span: 24, order: 1 }} lg={{ span: 12, order: 2 }}>
            <div className="pl-0 lg:pl-5 text-center lg:text-left">
              <h2 className="text-4xl lg:text-6xl font-bold text-[#72c059] mb-8 leading-tight">
                {t.home.aboutTitle}
              </h2>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-10 whitespace-pre-wrap">
                {t.home.aboutDescription}
              </p>
              <button
                type="button"
                className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer"
                onClick={() => (window.location.href = `/${language}/contact`)}
              >
                {t.home.aboutCTA}
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button, Input } from "antd";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";

const socialIcons = [
  {
    icon: "/images/icon/facebook.png",
    link: "https://facebook.com/ryupowertools.id",
    alt: "Facebook",
  },
  {
    icon: "/images/icon/instagram.png",
    link: "https://instagram.com/ryupowertools/",
    alt: "Instagram",
  },
  {
    icon: "/images/icon/youtube.png",
    link: "https://youtube.com/@ryupowertools1866",
    alt: "Youtube",
  },
  {
    icon: "/images/icon/tik-tok.png",
    link: "https://tiktok.com/@ryupowertools",
    alt: "TikTok",
  },
];

export default function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-white">
      {/* Top Section */}
      <div className="primary py-3 px-10 text-center">

        <p className=" text-sm text-white">
          © RYU POWER TOOLS 2025
        </p>
      </div>

      {/* Main Content */}
      <div className="py-20 border-b border-gray-200">
        <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            {/* Logo */}
            <div className="md:col-span-1">
              <div className="w-32 h-20  rounded flex items-center justify-center">
                <img
                  src="/images/logoNew.png"
                  alt="RYU Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-anton text-lg text-black mb-2">{t.footer.followUs}</h3>
              <div className="flex gap-1">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition"
                    style={{ backgroundColor: "#72c059" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#589244")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#72c059")
                    }
                  >
                    <img
                      src={social.icon}
                      alt={social.alt}
                      className="w-4 h-4 object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Official Store */}
            <div>
              <h3 className="font-anton text-lg text-black mb-2">
                {t.footer.officialStore}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://tokopedia.com/ryuofficial"
                    style={{ color: "#000000" }}
                    className="text-black hover:text-[#2a6932] text-sm no-underline"
                  >
                    Tokopedia
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://shopee.co.id/ryuofficial"
                    style={{ color: "#000000" }}
                    className="text-black hover:text-[#2a6932] text-sm no-underline"
                  >
                    Shopee
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.monotaro.id/shopbybrand/brand?brand=ryu"
                    style={{ color: "#000000" }}
                    className="text-black hover:text-[#2a6932] text-sm no-underline"
                  >
                    Monotaro
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-anton text-lg text-black mb-2">
                {t.footer.quickLinks}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${language}/contact`}
                    style={{ color: "#000000" }}
                    className="text-black hover:text-[#2a6932] text-sm no-underline"
                  >
                    {t.nav.contact}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/service-center`}
                    style={{ color: "#000000" }}
                    className="text-black hover:text-[#2a6932] text-sm no-underline"
                  >
                    {t.nav.serviceCenter}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/warranty`}
                    style={{ color: "#000000" }}
                    className="text-black hover:text-[#2a6932] text-sm no-underline"
                  >
                    {t.nav.warranty}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/where-to-buy`}
                    style={{ color: "#000000" }}
                    className="text-black hover:text-[#2a6932] text-sm no-underline"
                  >
                    {t.nav.whereToBuy}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-anton text-lg text-black mb-2">{t.footer.newsletter}</h3>
              <p className="text-sm text-black mb-4">
                {t.footer.newsletterDescription}
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder={t.footer.newsletterPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!mb-4 !w-full !bg-transparent !border-0 !border-b !border-gray-400 !rounded-none !px-0 !py-2 !text-base !text-black placeholder:text-gray-500 focus:!shadow-none focus:!outline-none focus:!border-gray-600"
                />
                <Button
                  className="!bg-transparent !border-none !h-auto !w-full !font-thin !text-black !p-0 !rounded-none !shadow-none hover:!bg-transparent !flex !items-center !justify-start !text-left !text-sm"
                  style={{ letterSpacing: "0.08em", textAlign: "left" }}
                  onClick={() => {
                    // Handle subscription
                    setEmail("");
                  }}
                >
                  {t.footer.subscribe} →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#72c059] text-white py-4 px-10 text-center">
        <p className="font-semibold text-sm">© RYU POWER TOOLS 2025</p>
      </div>
    </footer>
  );
}

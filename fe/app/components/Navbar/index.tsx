'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Input, Menu, Drawer, message } from 'antd';
import { SearchOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { CategoryNode } from '@/app/lib/category-api';
import { getPublicCategoryTree } from '@/app/lib/category-api';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { languages, type Language } from '@/app/i18n';
import styles from "./navbar.module.css";

// Dropdown arrow icon component
const DropdownArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    width={14}
    height={14}
    className="ml-1 text-xs hidden lg:inline"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
    />
  </svg>
);

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t, setLanguage } = useLanguage();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryItems, setCategoryItems] = useState<MenuProps['items']>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [catalogueUrl, setCatalogueUrl] = useState<string | null>(null);

  // Fetch catalogue URL from backend
  useEffect(() => {
    (async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/catalogue`);
        
        if (response.ok) {
          const data = await response.json();
          const catalogue = data.data || data;
          
          if (catalogue && catalogue.fileUrl) {
            setCatalogueUrl(`${API_BASE}${catalogue.fileUrl}`);
          }
        }
      } catch (error) {
        console.error('Failed to load catalogue:', error);
      }
    })();
  }, []);

  // Handle catalog click
  const handleCatalogClick = (e: React.MouseEvent) => {
    if (!catalogueUrl) {
      e.preventDefault();
      message.warning( 'Catalog is not available at the moment');
    }
  };

  // Build menu items with translations
  const menuItems = useMemo((): MenuProps['items'] => [
    {
      key: 'home',
      label: <Link href={`/${language}`}>{t.nav.home}</Link>,
    },
    {
      key: 'blog',
      label: <Link href={`/${language}/blog`}>{t.nav.blog}</Link>,
    },
    {
      key: 'category',
      label: (
        <span className="flex items-center gap-1">
          {t.nav.category}
          <DropdownArrow />
        </span>
      ),
      children: categoryItems,
    },
    {
      key: 'catalog',
      label: catalogueUrl ? (
        <a 
          href={catalogueUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleCatalogClick}
        >
          {t.nav.viewCatalog}
        </a>
      ) : (
        <span 
          className="cursor-not-allowed opacity-50"
          onClick={handleCatalogClick}
        >
          {t.nav.viewCatalog}
        </span>
      ),
    },
    {
      key: 'service-support',
      label: (
        <span className="flex items-center gap-1">
          {t.nav.serviceSupport}
          <DropdownArrow />
        </span>
      ),
      children: [
        { key: 'service-center', label: <Link href={`/${language}/service-center`}>{t.nav.serviceCenter}</Link> },
        { key: 'where-to-buy', label: <Link href={`/${language}/where-to-buy`}>{t.nav.whereToBuy}</Link> },
        { 
          key: 'altama-ecare', 
          label: (
            <a 
              href="https://play.google.com/store/apps/details?id=id.co.carepoint&pli=1" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t.nav.altamaEcare}
            </a>
          )
        },
        { key: 'contact', label: <Link href={`/${language}/contact`}>{t.nav.contact}</Link> },
        { key: 'warranty', label: <Link href={`/${language}/warranty`}>{t.nav.warranty}</Link> },
      ],
    },
  ], [t, categoryItems, catalogueUrl, language]);

  // Helper function to find menu key by pathname
  const findMenuKeyByPath = (items: MenuProps['items'], path: string, parentKeys: string[] = []): { key: string | null; parents: string[] } => {
    if (!items) return { key: null, parents: [] };
    
    for (const item of items) {
      const menuItem = item as any;
      if (menuItem.label && typeof menuItem.label === 'object') {
        const href = menuItem.label.props?.href;
        if (href && normalizePathForMenu(path) === normalizePathForMenu(href)) {
          return { key: menuItem.key, parents: parentKeys };
        }
      }
      
      if (menuItem.children) {
        const result = findMenuKeyByPath(menuItem.children, path, [...parentKeys, menuItem.key]);
        if (result.key) return result;
      }
    }
    
    return { key: null, parents: [] };
  };

  const normalizePathForMenu = (path: string) => {
    const normalized = path.replace(/^\/(en|id|in)(?=\/|$)/, '');
    return normalized === '' ? '/' : normalized;
  };

  // Update selected keys based on pathname
  useEffect(() => {
    const pathForMatch = normalizePathForMenu(pathname);

    if (pathForMatch === '/') {
      setSelectedKeys(['home']);
    } else if (pathForMatch.startsWith('/blog')) {
      setSelectedKeys(['blog']);
    } else if (pathForMatch.startsWith('/service-center')) {
      setSelectedKeys(['service-center']);
    } else if (pathForMatch.startsWith('/where-to-buy')) {
      setSelectedKeys(['where-to-buy']);
    } else if (pathForMatch.startsWith('/contact')) {
      setSelectedKeys(['contact']);
    } else if (pathForMatch.startsWith('/warranty')) {
      setSelectedKeys(['warranty']);
    } else if (pathForMatch.startsWith('/product-category')) {
      const result = findMenuKeyByPath(menuItems, pathname);
      if (result.key) {
        setSelectedKeys([result.key]);
      } else {
        setSelectedKeys([]);
      }
    } else {
      setSelectedKeys([]);
    }
  }, [pathname, menuItems]);

  // Fetch categories from database (no translation needed)
  useEffect(() => {
    (async () => {
      try {
        const categoryTree = await getPublicCategoryTree();
        const items = buildCategoryMenu(categoryTree);
        setCategoryItems(items);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    })();
  }, []);

  const buildCategoryMenu = (categories: CategoryNode[], parentPath: string = ''): MenuProps['items'] => {
    if (!categories || categories.length === 0) return [];

    return categories.map((cat) => {
      const hasChildren = cat.children && cat.children.length > 0;
      const currentPath = parentPath ? `${parentPath}/${cat.slug}` : cat.slug;
      const fullPath = `/${language}/product-category/${currentPath}`;
      
      return {
        key: cat.id,
        label: <Link href={fullPath}>{cat.name}</Link>,
        children: hasChildren ? buildCategoryMenu(cat.children!, currentPath) : undefined,
      };
    });
  };

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const toggleSearch = () => setSearchVisible(!searchVisible);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return;
    if (!searchQuery.trim()) return;

    router.push(`/${language}/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setSearchVisible(false);
  };

  const renderDesktopMenuItems = (items: MenuProps['items']): MenuProps['items'] => {
    if (!items) return [];
    
    return items.map((item: any) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: renderDesktopMenuItems(item.children),
        };
      }
      return item;
    });
  };

  // Language switcher component
  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
      {languages.map((lang) => (
        <button 
          key={lang.code}
          type="button" 
          className={`w-9 h-8 rounded-md border-0 bg-transparent cursor-pointer flex items-center justify-center transition-all hover:bg-gray-200 hover:scale-105 ${
            language === lang.code ? 'bg-white shadow-sm' : ''
          }`}
          onClick={() => handleLanguageChange(lang.code)}
          aria-label={lang.name}
        >
          <img 
            src={lang.flag} 
            alt={lang.name} 
            className="w-6 h-4 object-cover rounded-sm" 
          />
        </button>
      ))}
    </div>
  );

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-[100]">
      <div className="flex items-center justify-between gap-6 px-4 lg:px-8 py-3 max-w-[1400px] mx-auto">
        {/* Hamburger Menu */}
        <button 
          className="lg:hidden flex items-center justify-center p-2 text-[#1d1b1b] hover:bg-gray-100 rounded transition-colors"
          onClick={toggleDrawer} 
          aria-label={t.common.menu}
        >
          <MenuOutlined className="text-2xl" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center h-12 flex-1 lg:flex-none justify-center lg:justify-start">
          <Image
            src="/images/logoNew.png"
            alt="Ryu Power Tools"
            width={140}
            height={48}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1">
          <Menu
            mode="horizontal"
            items={renderDesktopMenuItems(menuItems)}
            selectedKeys={selectedKeys}
            className={styles.desktopMenu}
            style={{ 
              border: 'none',
              background: 'transparent',
              flex: 1,
            }}
          />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button 
            className="lg:hidden flex items-center justify-center p-2 text-[#1d1b1b] hover:bg-gray-100 rounded transition-colors"
            onClick={toggleSearch} 
            aria-label={t.common.search}
          >
            <SearchOutlined className="text-xl" />
          </button>
          
          {/* Desktop Search */}
            <div className="hidden lg:block">
              <Input
                size="large"
                allowClear
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                prefix={<SearchOutlined className="text-gray-400" />}
                suffix={searchQuery ? (<button onClick={() => handleSearch()} className="text-gray-400 hover:text-gray-600" type="button"><SearchOutlined /></button>) : null}
                placeholder={t.nav.searchPlaceholder}
                style={{
                  borderRadius: '9999px',
                  width: '240px'
                }}
              />
            </div>

          {/* Language Switcher - Desktop */}
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchVisible && (
        <div className="lg:hidden px-4 py-3 border-t border-gray-200 bg-white">
          <Input
            size="large"
            allowClear
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            prefix={<SearchOutlined className="text-gray-400" />}
            suffix={
              searchQuery ? (
                <button
                  onClick={() => handleSearch()}
                  className="text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <SearchOutlined />
                </button>
              ) : null
            }
            placeholder={t.nav.searchPlaceholder}
            className="w-full rounded-full"
          />
        </div>
      )}

      {/* Mobile Drawer Menu */}
      <Drawer
        placement="left"
        onClose={toggleDrawer}
        open={drawerVisible}
        size={280}
        closeIcon={<CloseOutlined className="text-xl text-white" />}
        title={
          <div className="flex items-center justify-start">
            <Image
              src="/images/logoNew.png"
              alt="Ryu Power Tools"
              width={100}
              height={36}
              className="h-9 w-auto"
            />
          </div>
        }
        styles={{
          header: {
            background: '#72c059',
            borderBottom: 'none',
            padding: '16px 20px',
            color: '#ffffff'
          },
          body: {
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }
        }}
      >
        <div className="flex-1 overflow-y-auto pt-2">
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={selectedKeys}
            onClick={toggleDrawer}
            className="border-0 bg-transparent"
          />
        </div>
        
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {t.nav.language}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
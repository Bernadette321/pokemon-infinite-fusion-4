"use client";
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const switchLanguage = (locale: string) => {
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLanguage('en')}
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('zh')}
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        中文
      </button>
    </div>
  );
} 
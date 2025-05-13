import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold">{t('title')}</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/calculator" className="text-gray-600 hover:text-gray-900">
                {t('calculator')}
              </Link>
              <Link href="/dex" className="text-gray-600 hover:text-gray-900">
                {t('dex')}
              </Link>
              <Link href="/install-guide" className="text-gray-600 hover:text-gray-900">
                {t('installGuide')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 
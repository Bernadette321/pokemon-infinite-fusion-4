"use client";
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as Select from '@radix-ui/react-select';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const handleLanguageChange = (value: string) => {
    const newPath = pathname.replace(/^\/(en|zh)/, `/${value}`);
    router.push(newPath);
  };

  return (
    <Select.Root defaultValue="en" onValueChange={handleLanguageChange}>
      <Select.Trigger className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50">
        <Select.Value>{t('language')}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
          <Select.Viewport className="p-1">
            <Select.Item value="en" className="text-sm rounded-sm px-2 py-1 hover:bg-gray-100 cursor-pointer">
              English
            </Select.Item>
            <Select.Item value="zh" className="text-sm rounded-sm px-2 py-1 hover:bg-gray-100 cursor-pointer">
              中文
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
} 
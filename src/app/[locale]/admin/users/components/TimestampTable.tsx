import { useLocale, useTranslations } from 'next-intl';
import { Locale } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { useRef } from 'react';
import { formatTimestamp } from '@/lib/utils/utils';

type Props = {
  timestamp: number;
};
function TimestampTable({ timestamp }: Props) {
  const locale = useLocale();
  const tTime = useTranslations('TimeSection');
  const t = useTranslations('GlobalSection');
  const localeMap = useRef<{ [key: string]: Locale }>({
    en: enUS,
    fr: fr
  });

  if (!timestamp) return t('never');

  return (
    <span>
      {formatTimestamp(timestamp, tTime, localeMap.current[locale || 'fr'])}
    </span>
  );
}

export default TimestampTable;

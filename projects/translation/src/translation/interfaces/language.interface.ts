import { Locale as DateFnsLocale } from 'date-fns';

export interface ILanguage {
  id?: string;
  code: string;
  label: string;
  isRtl: boolean;
  flag?: string;
  dateFnsLocale?: DateFnsLocale;
  isLocked?: boolean;
  translationValuesCount?: number;
}

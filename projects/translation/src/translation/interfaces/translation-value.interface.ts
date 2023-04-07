import { ILanguage } from './language.interface';

export interface ITranslationValue {
  defaultValue: string | null;
  overriddenValue: string | null;
  language: ILanguage;
}

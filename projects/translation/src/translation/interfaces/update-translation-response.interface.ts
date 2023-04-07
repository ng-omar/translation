import { ITranslationKey } from './translation-key.interface';
import { ILanguage } from './language.interface';

export interface IUpdateTranslationResponse {
  translationKey: ITranslationKey;
  overriddenValue?: string;
  defaultValue?: string;
  language: ILanguage;
}

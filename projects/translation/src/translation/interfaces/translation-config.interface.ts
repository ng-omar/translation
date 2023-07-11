import { ILanguage } from './language.interface';
import { StringsOrLocales } from './strings.interface';

export type TranslationConfigForRoot =
  | ITranslationConfigFolder
  | ITranslationConfigEndpoint
  | ITranslationConfigString;

export type TranslationConfigForChild = {
  module?: string;
  strings?: StringsOrLocales;
};

export interface ITranslationConfigFolder extends ITranslationConfigBase {
  type: 'folder';
  languages: ILanguage[];
  i18nFolderPath: string;
  module: string;
}

export interface ITranslationConfigEndpoint extends ITranslationConfigBase {
  type: 'endpoint';
  translationEndpoint: string;
  module?: string;
}

export interface ITranslationConfigString extends ITranslationConfigBase {
  type: 'strings';
  languages: ILanguage[];
  strings: StringsOrLocales;
}

export interface ITranslationConfigBase {
  defaultLanguage?: string;
  localStorageKey?: string;
  strings?: StringsOrLocales;
  dateFnsLocales?: { code: string; locale: any }[];
}

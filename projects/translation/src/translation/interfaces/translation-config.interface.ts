import { ILanguage } from './language.interface';
import { StringsOrList } from './strings.interface';

export type TranslationConfigForRoot =
  | ITranslationConfigFolder
  | ITranslationConfigEndpoint
  | ITranslationConfigString;

export type TranslationConfigForChild = {
  module?: string;
  strings?: StringsOrList;
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
  strings: StringsOrList;
}

export interface ITranslationConfigBase {
  defaultLanguage?: string;
  localStorageKey?: string;
}

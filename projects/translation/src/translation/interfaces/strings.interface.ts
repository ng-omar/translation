import { ILocale } from './locale.interface';

export interface IStrings {
  [key: string]: string | { [key: string]: string };
}

export type StringsOrLocales = IStrings | ILocale[];

export interface IStrings {
  [key: string]: string | { [key: string]: string };
}

export type StringsOrList = IStrings | { lang: string; data: IStrings }[];

export interface ITranslationKeyList {
  id: string;
  key: string;
  module: string;
  section: string | null;
  defaultValue: string | null;
  overriddenValue: string | null;
  valuesCount: number;
}

import { ITranslationValue } from './translation-value.interface';

export interface ITranslationKey {
  id: string;
  key: string;
  module: string;
  section: string | null;
  valuesCount: number;
  values: ITranslationValue[];
}

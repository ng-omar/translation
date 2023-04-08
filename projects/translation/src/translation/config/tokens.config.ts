import { InjectionToken } from '@angular/core';
import { ILanguage } from '../interfaces';

export const TRANSLATION_CONFIG_FOR_CHILD = new InjectionToken<ILanguage[]>(
  'TRANSLATION_CONFIG_FOR_CHILD'
);

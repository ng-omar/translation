import { InjectionToken } from '@angular/core';
import { ILanguage } from '../interfaces';

export const IS_ROOT_TOKEN = new InjectionToken<boolean>('IS_ROOT');

export const TRANSLATION_CONFIG_FOR_CHILD = new InjectionToken<ILanguage[]>(
  'TRANSLATION_CONFIG_FOR_CHILD'
);

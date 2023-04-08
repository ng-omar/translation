import {
  APP_INITIALIZER,
  Inject,
  ModuleWithProviders,
  NgModule,
  Optional,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationService } from './translation.service';
import {
  TranslationConfigForRoot,
  TranslationConfigForChild,
} from './interfaces';
import { TRANSLATION_CONFIG_FOR_CHILD } from './config';
import { LoadTranslationsResolver } from './resolvers/load-translations.resolver';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TranslateModule],
})
export class TranslationModule {
  public static isInitialized = false;

  public constructor(
    @Optional()
    @Inject(TRANSLATION_CONFIG_FOR_CHILD)
    translationConfigForChild?: TranslationConfigForChild
  ) {}

  public static forRoot(
    config: TranslationConfigForRoot
  ): ModuleWithProviders<TranslationModule> {
    if (TranslationModule.isInitialized) {
      throw new Error('You cannot use forRoot multiple times');
    }

    TranslationModule.isInitialized = true;

    return {
      ngModule: TranslationModule,
      providers: [
        TranslationService,
        LoadTranslationsResolver,
        {
          provide: APP_INITIALIZER,
          useFactory: (translationService: TranslationService) => {
            return () => translationService.init(config);
          },
          deps: [TranslationService],
          multi: true,
        },
      ],
    };
  }

  public static forChild(
    config?: TranslationConfigForChild
  ): ModuleWithProviders<TranslationModule> {
    if (!TranslationModule.isInitialized) {
      throw new Error('You cannot use forChild before forRoot');
    }

    return {
      ngModule: TranslationModule,
      providers: [
        {
          provide: TRANSLATION_CONFIG_FOR_CHILD,
          useFactory: (s: TranslationService) =>
            config ? s.loadTranslations(config) : null,
          deps: [TranslationService],
          multi: true,
        },
      ],
    };
  }
}

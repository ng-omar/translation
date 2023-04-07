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
import { IS_ROOT_TOKEN, TRANSLATION_CONFIG_FOR_CHILD } from './config';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TranslateModule],
})
export class TranslationModule {
  public static isInitialized = false;

  public constructor(
    private readonly translationService: TranslationService,
    @Inject(IS_ROOT_TOKEN) isRoot: boolean,
    @Optional()
    @Inject(TRANSLATION_CONFIG_FOR_CHILD)
    translationConfigForChild?: TranslationConfigForChild
  ) {
    if (isRoot && TranslationModule.isInitialized) {
      throw new Error('You cannot use forRoot multiple times');
    }

    if (!isRoot && !TranslationModule.isInitialized) {
      throw new Error('You cannot use forChild before forRoot');
    }

    TranslationModule.isInitialized = true;
  }

  public static forRoot(
    config: TranslationConfigForRoot
  ): ModuleWithProviders<TranslationModule> {
    return {
      ngModule: TranslationModule,
      providers: [
        { provide: IS_ROOT_TOKEN, useValue: true },
        TranslationService,
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
    return {
      ngModule: TranslationModule,
      providers: [
        { provide: IS_ROOT_TOKEN, useValue: false },
        {
          provide: TRANSLATION_CONFIG_FOR_CHILD,
          useFactory: (s: TranslationService) => s.loadTranslations(config),
          deps: [TranslationService],
          multi: true,
        },
      ],
    };
  }
}

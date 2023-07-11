import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import {
  ILanguage,
  IStrings,
  TranslationConfigForChild,
  TranslationConfigForRoot,
  StringsOrLocales,
  IUpdateTranslationResponse,
  ILocale,
} from './interfaces';
import { flattenStrings } from './utils';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TranslationApiClass } from './classes';

@Injectable()
export class TranslationService {
  public languages: ILanguage[] = [];

  private localStorageKey!: string;

  private defaultLanguage?: string;

  public translationApi: TranslationApiClass;

  public constructor(
    public readonly translateService: TranslateService,
    private readonly rendererFactory: RendererFactory2,
    private readonly dateFnsConfig: DateFnsConfigurationService,
    http: HttpClient
  ) {
    this.translationApi = new TranslationApiClass(http);
  }

  public get currentLanguage(): ILanguage {
    const currentLang = this.getLanguage(this.translateService.currentLang);
    if (!currentLang) throw new Error('Language not found');
    return currentLang;
  }

  public async init(config: TranslationConfigForRoot): Promise<void> {
    this.localStorageKey = config.localStorageKey || 'selected-language';
    this.defaultLanguage = config.defaultLanguage;

    const renderer = this.rendererFactory.createRenderer(null, null);

    if (config.type === 'strings') {
      this.languages = config.languages;
    } else if (config.type === 'folder') {
      this.languages = config.languages;
      this.translationApi.i18nFolderPath = config.i18nFolderPath;
    } else if (config.type === 'endpoint') {
      this.translationApi.translationEndPoint = config.translationEndpoint;
      this.languages = await this.translationApi
        .getLanguages('', 0, -1)
        .pipe(map((data) => data.items))
        .toPromise();
    }

    this.translateService.addLangs(this.languages.map((l) => l.code));

    const selectedLanguage = this.getSavedUserLanguageOrDefault();

    this.setLanguage(selectedLanguage, renderer);

    await this.loadTranslations(config);

    if (config.defaultLanguage)
      this.translateService.setDefaultLang(config.defaultLanguage);

    this.translateService.use(selectedLanguage.code);

    const dateFnsLocale =
      selectedLanguage.dateFnsLocale ||
      config.dateFnsLocales?.find((l) => l.code === selectedLanguage.code)
        ?.locale;

    if (dateFnsLocale) this.dateFnsConfig.setLocale(dateFnsLocale);
  }

  public async loadTranslations(
    config: TranslationConfigForChild
  ): Promise<void> {
    if (config.strings) this.setTranslations(config.strings);

    if (config.module) {
      await this.setTranslationsViaHttp(config.module).toPromise();
    }
  }

  public setLanguage(language: ILanguage, renderer?: Renderer2): void {
    localStorage.setItem(this.localStorageKey, language.code);

    if (!renderer) {
      window.location.reload();
      return;
    }

    const { documentElement } = window.document;
    renderer.setAttribute(documentElement, 'lang', language.code);
    renderer.setAttribute(
      documentElement,
      'dir',
      language.isRtl ? 'rtl' : 'ltr'
    );
    this.translateService.use(language.code);
  }

  public setTranslations(strings: StringsOrLocales): IStrings {
    const list: ILocale[] = [];

    if (Array.isArray(strings))
      strings.forEach((item) => {
        if (item.code !== this.currentLanguage.code) return;
        list.push(item);
      });
    else
      list.push({
        code: this.currentLanguage.code,
        strings: flattenStrings(strings),
      });

    list.forEach((item) =>
      this.translateService.setTranslation(item.code, item.strings, true)
    );

    const currentLanguageStrings = list.find(
      (l) => l.code === this.currentLanguage.code
    );

    return currentLanguageStrings?.strings ?? {};
  }

  public updateAndSetTranslation(
    translationKeyId: string,
    language: ILanguage,
    value: string
  ): Observable<IUpdateTranslationResponse> {
    return this.translationApi
      .update(translationKeyId, language.id!, value)
      .pipe(
        tap((data) => {
          const isTheSameLanguage =
            language.code === this.translateService.currentLang;
          if (data && isTheSameLanguage) {
            const value = data.overriddenValue || data.defaultValue || '';
            const { key } = data.translationKey;
            this.setTranslations({ [key]: value });
          }
        })
      );
  }

  private setTranslationsViaHttp(module: string): Observable<IStrings> {
    const language = this.translateService.currentLang;

    if (
      !this.translationApi.i18nFolderPath &&
      !this.translationApi.translationEndPoint
    ) {
      throw new Error('Please set i18nFolderPath or translationEndPoint');
    }

    const obs = this.translationApi.i18nFolderPath
      ? this.translationApi.getStringsViaFolder(module, language)
      : this.translationApi.getStringsViaApi(module, language);

    return obs.pipe(tap((strings) => this.setTranslations(strings)));
  }

  private getSavedUserLanguageOrDefault(): ILanguage {
    // Throw error if no languages are available
    if (this.languages.length === 0)
      throw new Error(
        'No Languages available. please add language to LANGUAGES array'
      );

    // Check if language is stored in local storage
    const savedLangInLocalStorage = localStorage.getItem(this.localStorageKey);
    if (savedLangInLocalStorage) {
      const language = this.getLanguage(savedLangInLocalStorage);
      if (language) return language;
    }

    // Get default application language
    const defaultAppLanguage = this.languages.find(
      (lang) => lang.code === this.defaultLanguage
    );
    if (defaultAppLanguage) return defaultAppLanguage;

    // Check if user language that stored in browser is supported
    const browserLanguage = this.translateService.getBrowserLang();
    if (browserLanguage) {
      const language = this.getLanguage(browserLanguage);
      if (language) return language;
    }

    // Return first language
    return this.languages[0];
  }

  private getLanguage(code: string): ILanguage | undefined {
    return this.languages.find((lang) => lang.code === code);
  }
}

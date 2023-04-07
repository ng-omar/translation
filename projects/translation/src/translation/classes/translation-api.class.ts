import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ILanguage,
  IStrings,
  ITableResult,
  IResponse,
  ITranslationKeyList,
  IUpdateTranslationResponse,
} from '../interfaces';
import { map, tap } from 'rxjs/operators';
import { HttpCache } from './http-cache.class';

export class TranslationApiClass {
  public httpCache: HttpCache;

  public get endpoint(): string | undefined {
    return this.translationEndPoint || this.i18nFolderPath;
  }

  public constructor(
    private readonly http: HttpClient,
    public i18nFolderPath?: string,
    public translationEndPoint?: string
  ) {
    this.httpCache = new HttpCache(http);
  }

  public getLanguages(
    keyword: string,
    pageNumber: number,
    pageSize: number
  ): Observable<ITableResult<ILanguage>> {
    let params = new HttpParams();
    params = params.append('keyword', keyword);
    params = params.append('pageNumber', `${pageNumber + 1}`);
    params = params.append('pageSize', `${pageSize}`);

    const url = `${this.endpoint}/api/v1/languages`;
    return this.http
      .get<IResponse<ITableResult<ILanguage>>>(url, { params })
      .pipe(map((response) => response.data));
  }

  public getLanguage(id: string): Observable<ILanguage> {
    const url = `${this.endpoint}/api/v1/languages/${id}`;
    return this.http
      .get<IResponse<ILanguage>>(url)
      .pipe(map((response) => response.data));
  }

  public createLanguage(language: ILanguage): Observable<ILanguage> {
    const url = `${this.endpoint}/api/v1/languages`;
    return this.http
      .post<IResponse<ILanguage>>(url, language)
      .pipe(map((response) => response.data));
  }

  public updateLanguage(language: ILanguage): Observable<ILanguage> {
    const url = `${this.endpoint}/api/v1/languages/${language.id}`;
    return this.http
      .put<IResponse<ILanguage>>(url, language)
      .pipe(map((response) => response.data));
  }

  public deleteLanguage(id: string): Observable<void> {
    const url = `${this.endpoint}/api/v1/languages/${id}`;
    return this.http.delete<void>(url);
  }

  public getTranslationKeys(
    key: string,
    translation: string,
    language: ILanguage,
    isChangedOnly: boolean,
    isEqualToValue: boolean,
    hasNoValue: boolean,
    pageNumber: number,
    pageSize: number
  ): Observable<ITableResult<ITranslationKeyList>> {
    let params = new HttpParams();
    params = params.append('key', key);
    params = params.append('translation', translation);
    params = params.append('languageId', language.id!);
    params = params.append('isChangedOnly', isChangedOnly);
    params = params.append('isEqualToValue', isEqualToValue);
    params = params.append('hasNoValue', hasNoValue);
    params = params.append('pageNumber', `${pageNumber + 1}`);
    params = params.append('pageSize', `${pageSize}`);

    return this.http
      .get<IResponse<ITableResult<ITranslationKeyList>>>(
        `${this.endpoint}/api/v1/translation-keys`,
        { params }
      )
      .pipe(map((result) => result.data));
  }

  public getStringsViaApi(
    module: string,
    languageCode: string
  ): Observable<IStrings> {
    const url = `${this.endpoint}/api/v1/translations/${module}/${languageCode}`;
    return this.httpCache
      .get<IResponse<IStrings>>(url)
      .pipe(map((response) => response.data));
  }

  public getStringsViaFolder(
    module: string,
    languageCode: string
  ): Observable<IStrings> {
    return this.httpCache.get<IStrings>(
      `${this.endpoint}/${module}/${languageCode}.json`
    );
  }

  public update(
    translationKeyId: string,
    languageId: string,
    value: string
  ): Observable<IUpdateTranslationResponse> {
    const url = `${this.endpoint}/api/v1/translation-values`;
    return this.http
      .put<IResponse<IUpdateTranslationResponse>>(url, {
        translationKeyId,
        languageId,
        value,
      })
      .pipe(
        map((result) => result.data),
        tap((data) => {
          const key = `${this.endpoint}/api/v1/translations/${data.translationKey.module}/${data.language.code}`;
          const result = this.httpCache.cache.get(key);

          if (!result?.response?.data) return;

          const section = data.translationKey.section || '';

          if (!result.response.data[section])
            result.response.data[section] = {};

          result.response.data[section][data.translationKey.key] =
            data.overriddenValue || data.defaultValue;

          this.httpCache.cache.set(key, result);
        })
      );
  }
}

import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { TranslationService } from '../translation.service';
import { map } from 'rxjs/operators';

@Injectable()
export class LoadTranslationsResolver implements Resolve<boolean> {
  public constructor(private readonly translationService: TranslationService) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot
  ): Observable<boolean> {
    const module = route.data['module'] || route.routeConfig?.path;

    if (!module) return of(true);

    return from(this.translationService.loadTranslations({ module })).pipe(
      map(() => true)
    );
  }
}

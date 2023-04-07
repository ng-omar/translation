import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export class HttpCache {
  public cache: Map<string, { response: any; expiry: number }> = new Map();

  public constructor(private http: HttpClient) {}

  public get<T>(url: string): Observable<T> {
    const cachedResponse = this.getKey<T>(url);

    if (cachedResponse) return cachedResponse;

    return this.http
      .get<T>(url)
      .pipe(tap((event) => this.put(url, event, 600000)));
  }

  private getKey<T>(key: string): Observable<T> | undefined {
    const cached = this.cache.get(key);

    if (!cached) return undefined;

    if (cached.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return of({ ...cached.response });
  }

  private put(key: string, response: any, ttl: number) {
    this.cache.set(key, { response, expiry: Date.now() + ttl });
  }
}

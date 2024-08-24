import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RssService {

  constructor(private http: HttpClient) { }

  getFeed(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((response) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response, 'application/xml');
        const items = Array.from(xml.querySelectorAll('item'));
        return items.map(item => {
          const description = item.querySelector('description')?.textContent || '';
          const cdataMatch = description.match(/<img[^>]+src="([^">]+)"/);
          const imageUrl = cdataMatch ? cdataMatch[1] : null;
          const textDescription = description.replace(/<[^>]+>/g, '').slice(0, -4);

          return {
            title: item.querySelector('title')?.textContent,
            link: item.querySelector('link')?.textContent,
            description: textDescription,
            pubDate: item.querySelector('pubDate')?.textContent,
            imageUrl: imageUrl
          };
        });
      })
    );
  }
}
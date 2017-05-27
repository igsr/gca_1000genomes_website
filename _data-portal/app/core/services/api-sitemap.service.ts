import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Sitemap } from '../../shared/api-types/sitemap';
import { SearchHits } from '../../shared/api-types/search-hits';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiSitemapService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  textSearch(text: string): Observable<SearchHits<Sitemap>> {
    if (!text) {
      return Observable.of<SearchHits<Sitemap>>(null);
    }
    let body = {
      _source: ['url', 'title'],
      highlight: {
        fields: {content: {}},
        pre_tags: ["<em><strong>"],
        post_tags: ["</strong></em>"],
      },
      query: {
        match_phrase: {content: text},
      }
    };
    return this.apiTimeoutService.handleTimeout<SearchHits<Sitemap>>(
      this.apiErrorService.handleError(
        this.http.post(`http://www.internationalgenome.org/api/sitemap/_search`, body)
      ).map((r:Response): SearchHits<Sitemap> => {
        let h: {hits: SearchHits<Sitemap>} = r.json() as {hits: SearchHits<Sitemap>};
        return h.hits;
      })
    );
  }
}

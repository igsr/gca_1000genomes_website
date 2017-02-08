import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { SitemapList } from '../../shared/api-types/sitemap';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiSitemapService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  textSearch(text: string): Observable<SitemapList> {
    if (!text) {
      return Observable.of<SitemapList>(null);
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
    return this.apiTimeoutService.handleTimeout<SitemapList>(
      this.apiErrorService.handleError(
        this.http.post(`http://www.internationalgenome.org/api/sitemap/_search`, body)
      ).map((r:Response): SitemapList => {
        let h: {hits: SitemapList} = r.json() as {hits: SitemapList};
        return h.hits;
      })
    );
  }
}

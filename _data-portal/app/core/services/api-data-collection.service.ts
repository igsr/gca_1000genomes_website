import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { DataCollection } from '../../shared/api-types/data-collection';
import { SearchHits } from '../../shared/api-types/search-hits';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiDataCollectionService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  // private properties:
  private dcListSource: ReplaySubject<SearchHits<DataCollection>>;

  // public properties:
  readonly titleMap: {[key: string]: string} = {};

  // public methods

  getAll(): Observable<SearchHits<DataCollection>>{
    if (!this.dcListSource) {
      this.setDcListSource();
    }
    return this.dcListSource.asObservable();
  }

  get(id: string): Observable<DataCollection> {
    return this.getAll().map((l: SearchHits<DataCollection>): DataCollection => {
      if (l && l.hits) {
        for (let dc of l.hits) {
          if (dc._id && dc._id === id) {
            return dc._source;
          }
        }
      }
      return null;
    });
  }

  getText(id: string): Observable<string> {
      return this.http.get(`/data-portal/data-collections/${id}.html`)
        .catch((err, caught): Observable<Response> => Observable.of<Response>(null))
        .map((r:Response): string => {
          let text: string = r ? r.text() : ''
          return text.startsWith(`<!DOCTYPE`) ? '' : text;
        });
  }

  textSearch(text: string, hitsPerPage: number): Observable<SearchHits<DataCollection>> {
    let trimmedText: string = (text || '').trim();
    if (!trimmedText) {
      return Observable.of<SearchHits<DataCollection>>(null);
    }
    let shouldClauses: any[] = [
      {
        multi_match: {
          query: trimmedText,
          type: "most_fields",
          fields: [
            'title.std',
            'shortTitle.std',
            'sequence.std',
            'alignment.std',
            'variants.std'
          ],
        }
      }
    ];
    shouldClauses = shouldClauses.concat(this.buildAnalysisGroupClauses(trimmedText));
    let body = {
      size: hitsPerPage,
      _source: [ 'title' ],
      query: {
        bool: {
          should: shouldClauses,
          minimum_should_match: 1,
        }
      }
    }
    return this.apiTimeoutService.handleTimeout<SearchHits<DataCollection>>(
      this.apiErrorService.handleError(
        this.http.post(`/api/beta/data-collection/_search`, body)
      ).map((r:Response): SearchHits<DataCollection> => {
        let h: {hits: SearchHits<DataCollection>} = r.json() as {hits: SearchHits<DataCollection>};
        return h.hits;
      })
    );
  }

  // private methods

  private setDcListSource() {
    let query = {
      size: -1,
      sort: ['displayOrder'],
    };
    this.dcListSource = new ReplaySubject<SearchHits<DataCollection>>(1);
    this.apiTimeoutService.handleTimeout<SearchHits<DataCollection>>(
      this.apiErrorService.handleError(
        this.http.post(`/api/beta/data-collection/_search`, query)
      ).map((r:Response): SearchHits<DataCollection> => {
          let h: {hits: SearchHits<DataCollection>} = r.json() as {hits: SearchHits<DataCollection>};
          for (let dc of h.hits.hits) {
            if (dc._source.shortTitle && dc._source.title) {
              this.titleMap[dc._source.title] = dc._source.shortTitle;
            }
          }
          return h.hits;
      })
    ).subscribe((l: SearchHits<DataCollection>) => this.dcListSource.next(l));
  }

  private buildAnalysisGroupClauses(text: string): any[] {
    let wildcardValue = this.buildWildcardValue(text);
    if (!wildcardValue) {
      return [];
    }
    let fields = [
      'sequence.keyword',
      'alignment.keyword',
      'variants.keyword',
    ];
    return fields.map((field: string) => ({
      wildcard: {
        [field]: {
          value: wildcardValue,
          case_insensitive: true,
        }
      }
    }));
  }

  private buildWildcardValue(text: string): string {
    let cleaned = text.replace(/[*?]/g, '').trim();
    return cleaned ? `*${cleaned}*` : '';
  }
}

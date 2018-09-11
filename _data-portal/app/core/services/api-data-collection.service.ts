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
    if (!text) {
      return Observable.of<SearchHits<DataCollection>>(null);
    }
    let body = {
      size: hitsPerPage,
      _source: [ 'title' ],
      query: {
        multi_match: {
          query: text,
          type: "most_fields",
          fields: [
            'title.std',
            'shortTitle.std'
          ],
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
}

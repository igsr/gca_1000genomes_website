import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { DataCollectionList } from '../../shared/api-types/data-collection-list';
import { DataCollection } from '../../shared/api-types/data-collection';
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
  private dcListSource: ReplaySubject<DataCollectionList>;

  // public properties:
  readonly titleMap: {[key: string]: string} = {};

  // public methods

  getAll(): Observable<DataCollectionList>{
    if (!this.dcListSource) {
      this.setDcListSource();
    }
    return this.dcListSource.asObservable();
  }

  get(id: string): Observable<DataCollection> {
    return this.getAll().map((l: DataCollectionList): DataCollection => {
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

  // private methods

  private setDcListSource() {
    let query = {
      size: -1,
      sort: ['displayOrder'],
    };
    this.dcListSource = new ReplaySubject<DataCollectionList>(1);
    this.apiTimeoutService.handleTimeout<DataCollectionList>(
      this.apiErrorService.handleError(
        this.http.post(`http://www.internationalgenome.org/api/beta/data-collection/_search`, query)
      ).map((r:Response): DataCollectionList => {
          let h: {hits: DataCollectionList} = r.json() as {hits: DataCollectionList};
          for (let dc of h.hits.hits) {
            if (dc._source.shortTitle && dc._source.title) {
              this.titleMap[dc._source.title] = dc._source.shortTitle;
            }
          }
          return h.hits;
      })
    ).subscribe((l: DataCollectionList) => this.dcListSource.next(l));
  }
}

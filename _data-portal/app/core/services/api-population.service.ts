import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { ApiHits } from '../../shared/api-types/api-hits';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiPopulationService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  // private properties:
  private popListSource: ReplaySubject<ApiHits>;

  // public methods

  getAll(): Observable<ApiHits>{
    if (!this.popListSource) {
      this.setPopListSource();
    }
    return this.popListSource.asObservable();
  }

  // private methods

  private setPopListSource() {
    let query = {
      size: -1,
      sort: ['code'],
      fields: ['code', 'name'],
    };
    this.popListSource = new ReplaySubject<ApiHits>(1);
    this.apiTimeoutService.handleTimeout<ApiHits>(
      this.apiErrorService.handleError(
        this.http.post(`http://www.internationalgenome.org/api/beta/population/_search`, query)
      ).map((r:Response): ApiHits => {
          let h: {hits: ApiHits} = r.json() as {hits: ApiHits};
          return h.hits;
      })
    ).subscribe((h: ApiHits) => this.popListSource.next(h));
  }
}

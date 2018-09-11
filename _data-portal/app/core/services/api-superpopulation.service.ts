import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { SuperPopulation } from '../../shared/api-types/superpopulation';
import { SearchHits } from '../../shared/api-types/search-hits';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiSuperPopulationService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  // private properties:
  private spListSource: ReplaySubject<SearchHits<SuperPopulation>>;

  // public properties:
  readonly titleMap: {[key: string]: string} = {};

  // public methods

  getAll(): Observable<SearchHits<SuperPopulation>>{
    if (!this.spListSource) {
      this.setSpListSource();
    }
    return this.spListSource.asObservable();
  }

  // private methods

  private setSpListSource() {
    let query = {
      size: -1,
      sort: ['display_order'],
    };
    this.spListSource = new ReplaySubject<SearchHits<SuperPopulation>>(1);
    this.apiTimeoutService.handleTimeout<SearchHits<SuperPopulation>>(
      this.apiErrorService.handleError(
        this.http.post(`/api/beta/superpopulation/_search`, query)
      ).map((r:Response): SearchHits<SuperPopulation> => {
          let h: {hits: SearchHits<SuperPopulation>} = r.json() as {hits: SearchHits<SuperPopulation>};
          for (let sp of h.hits.hits) {
            //if (sp._source.name && sp._source.name) {
            //  this.titleMap[sp._source.name] = sp._source.shortTitle;
            //}
          }
          return h.hits;
      })
    ).subscribe((l: SearchHits<SuperPopulation>) => this.spListSource.next(l));
  }
}

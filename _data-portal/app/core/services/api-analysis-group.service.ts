import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { AnalysisGroup } from '../../shared/api-types/analysis-group';
import { SearchHits } from '../../shared/api-types/search-hits';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiAnalysisGroupService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  // private properties:
  private agListSource: ReplaySubject<SearchHits<AnalysisGroup>>;

  // public properties:
  readonly titleMap: {[key: string]: string} = {};

  // public methods

  getAll(): Observable<SearchHits<AnalysisGroup>>{
    if (!this.agListSource) {
      this.setAgListSource();
    }
    return this.agListSource.asObservable();
  }

  // private methods

  private setAgListSource() {
    let query = {
      size: -1,
      sort: ['displayOrder'],
    };
    this.agListSource = new ReplaySubject<SearchHits<AnalysisGroup>>(1);
    this.apiTimeoutService.handleTimeout<SearchHits<AnalysisGroup>>(
      this.apiErrorService.handleError(
        this.http.post(`/api/beta/analysis-group/_search`, query)
      ).map((r:Response): SearchHits<AnalysisGroup> => {
          let h: {hits: SearchHits<AnalysisGroup>} = r.json() as {hits: SearchHits<AnalysisGroup>};
          for (let ag of h.hits.hits) {
            if (ag._source.shortTitle && ag._source.title) {
              this.titleMap[ag._source.title] = ag._source.shortTitle;
            }
          }
          return h.hits;
      })
    ).subscribe((l: SearchHits<AnalysisGroup>) => this.agListSource.next(l));
  }
}

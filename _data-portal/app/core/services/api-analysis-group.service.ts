import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { AnalysisGroupList } from '../../shared/api-types/analysis-group-list';
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
  private agListSource: ReplaySubject<AnalysisGroupList>;

  // public methods

  getAll(): Observable<AnalysisGroupList>{
    if (!this.agListSource) {
      this.setDcListSource();
    }
    return this.agListSource.asObservable();
  }

  // private methods

  private setDcListSource() {
    let query = {
      size: -1,
      sort: ['displayOrder'],
    };
    this.agListSource = new ReplaySubject<AnalysisGroupList>(1);
    this.apiTimeoutService.handleTimeout<AnalysisGroupList>(
      this.apiErrorService.handleError(
        this.http.post(`http://www.internationalgenome.org/api/beta/analysis-group/_search`, query)
      ).map((r:Response): AnalysisGroupList => {
          let h: {hits: AnalysisGroupList} = r.json() as {hits: AnalysisGroupList};
          return h.hits;
      })
    ).subscribe((l: AnalysisGroupList) => this.agListSource.next(l));
  }
}

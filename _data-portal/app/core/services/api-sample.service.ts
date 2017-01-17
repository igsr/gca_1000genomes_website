import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ApiHits } from '../../shared/api-types/api-hits';

@Injectable()
export class ApiSampleService {

  constructor(
    private http: Http,
  ) {}

  // public methods

  getAll(): Observable<ApiHits>{
    let query = {
      from: 0,
      size: 50,
      fields: [
        'name', 'sex', 'population.name', 'population.code', 'dataCollections.title', 'dataCollections._analysisGroups',
      ],
    };
    return this.http.post(`http://wwww.internationalgenome.org/api/beta/sample/_search`, query)
      .map((r:Response): ApiHits => {
        let h: {hits: ApiHits} = r.json() as {hits: ApiHits};
        return h.hits;
      });
  }
}

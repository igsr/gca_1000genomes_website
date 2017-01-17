import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { DataCollectionList } from '../../shared/api-types/data-collection-list';

@Injectable()
export class ApiDataCollectionService {

  constructor(
    private http: Http,
  ) {}

  private dcListObservable: Observable<DataCollectionList>;

  // public methods

  getAll(): Observable<DataCollectionList>{
    if (this.dcListObservable) {
      return this.dcListObservable;
    }
    let query = {
      size: -1,
      sort: ['displayOrder'],
    };
    this.dcListObservable = this.http.post(`http://www.internationalgenome.org/api/beta/data-collection/_search`, query)
      .map((r:Response): DataCollectionList => {
        let h: {hits: DataCollectionList} = r.json() as {hits: DataCollectionList};
        return h.hits;
      });
    return this.dcListObservable;
  }
}

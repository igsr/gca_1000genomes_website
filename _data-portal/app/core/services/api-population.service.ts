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

  search(hitsPerPage: number, from: number, query: any): Observable<ApiHits>{
    let body = {
      from: from,
      size: hitsPerPage,
      fields: [
        'code', 'name', 'description', 'superpopulation.code', 'superpopulation.name', 'samples.count', 'dataCollections.title', 'dataCollections._analysisGroups',
      ],
    };
    if (query) {
      body['query'] = query;
    }
    return this.apiTimeoutService.handleTimeout<ApiHits>(
      this.apiErrorService.handleError(
        this.http.post(`http://www.internationalgenome.org/api/beta/population/_search`, body)
      ).map((r:Response): ApiHits => {
        let h: {hits: ApiHits} = r.json() as {hits: ApiHits};
        return h.hits;
      })
    );
  }

  searchExport(query: any, filename: string){
    let body = {
      fields: [
        'code', 'name', 'description', 'superpopulation.code', 'superpopulation.name', 'samples.count', 'dataCollections.title',
      ],
      column_names: [
        'Population code', 'Population name', 'Population description', 'Superpopulation code', 'Superpopulation name', 'Number of samples', 'Data collections',
      ],
    };
    if (query) {
      body['query'] = query;
    }
    let form = document.createElement('form');

    form.action= `http://www.internationalgenome.org/api/beta/population/_search/${filename}.tsv`;
    form.method='POST';
    form.target="_self";
    let input = document.createElement("textarea");
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'json');
    input.value = JSON.stringify(body);
    form.appendChild(input);
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  searchDataCollectionPopulations(dc: string, offset: number, hitsPerPage: number): Observable<ApiHits> {
    let query = {
      constant_score: {
        filter: {
          term: { 'dataCollections.title': dc }
        }
      }
    }
    return this.search(hitsPerPage, offset, query);
  }

  searchDataCollectionPopulationsExport(dc: string) {
    let filename: string = dc.toLowerCase();
    filename.replace(/\s/g, '-');
    let query = {
      constant_score: {
        filter: {
          term: { 'dataCollections.title': dc }
        }
      }
    }
    return this.searchExport(query, `igsr-${filename}.tsv`);
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

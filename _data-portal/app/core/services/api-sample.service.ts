import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ApiHits } from '../../shared/api-types/api-hits';
import { Sample } from '../../shared/api-types/sample';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiSampleService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  // public methods

  search(hitsPerPage: number, from: number, query: any): Observable<ApiHits>{
    let body = {
      from: from,
      size: hitsPerPage,
      fields: [
        'name', 'sex', 'population.name', 'population.code', 'dataCollections.title', 'dataCollections._analysisGroups',
      ],
    };
    if (query) {
      body['query'] = query;
    }
    return this.apiTimeoutService.handleTimeout<ApiHits>(
      this.apiErrorService.handleError(
        //this.http.post(`http://www.internationalgenome.org/api/beta/sample/_search`, body)
        this.http.post(`http://ves-hx-e3:9200/igsr_beta_build3/sample/_search`, body)
      ).map((r:Response): ApiHits => {
        let h: {hits: ApiHits} = r.json() as {hits: ApiHits};
        return h.hits;
      })
    );
  }

  get(name: string): Observable<Sample>{
   return this.apiTimeoutService.handleTimeout<Sample>(
      this.apiErrorService.handleError(
        this.http.get(`http://www.internationalgenome.org/api/beta/sample/${name}`)
      ).map((r: Response) => {
        let s = r.json() as {_source: Sample};
        return s._source;
      })
    );
  }

  searchExport(query: any, filename: string){
    let body = {
      fields: [
        'name', 'sex', 'biosampleId', 'population.code', 'population.name', 'superpopulation.code', 'superpopulation.name', 'dataCollections.title',
      ],
      column_names: [
        'Sample name', 'Sex', 'Biosample ID', 'Population code', 'Population name', 'Superpopulation code', 'Superpopulation name', 'Data collections',
      ],
    };
    if (query) {
      body['query'] = query;
    }
    let form = document.createElement('form');

    form.action= `http://www.internationalgenome.org/api/beta/sample/_search/${filename}.tsv`;
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

  searchDataCollectionSamples(dc: string, offset: number, hitsPerPage: number): Observable<ApiHits> {
    let query = {
      constant_score: {
        filter: {
          term: { 'dataCollections.title': dc }
        }
      }
    }
    return this.search(hitsPerPage, offset, query);
  }

  searchDataCollectionSamplesExport(dc: string) {
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

  textSearch(text: string, hitsPerPage: number): Observable<ApiHits> {
    if (!text) {
      return Observable.of<ApiHits>(null);
    }
    let query = {
      multi_match: {
        query: text,
        fields: [
          'bioSampleID.std',
          'dataCollections.title.std',
          'name.std',
          'population.code.std',
          'population.description.std',
          'population.name.std',
          'superpopulation.code.std',
          'superpopulation.name.std',
        ],
      }
    }
    return this.search(hitsPerPage, 0, query);
  }
}

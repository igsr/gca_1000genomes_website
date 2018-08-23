import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { SearchHits } from '../../shared/api-types/search-hits';
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

  search(hitsPerPage: number, from: number, query: any): Observable<SearchHits<Sample>>{
    let body = {
      from: from,
      size: hitsPerPage,
      _source: true,
      fields: [ 'dataCollections._analysisGroups' ],
    };
    if (query) {
      body['query'] = query;
    }
    return this.apiTimeoutService.handleTimeout<SearchHits<Sample>>(
      this.apiErrorService.handleError(
        this.http.post(`/api/v2/sample/_search`, body)
      ).map((r:Response): SearchHits<Sample> => {
        let h: {hits: SearchHits<Sample>} = r.json() as {hits: SearchHits<Sample>};
        return h.hits;
      })
    );
  }

  get(name: string): Observable<Sample>{
   return this.apiTimeoutService.handleTimeout<Sample>(
      this.apiErrorService.handleError(
        this.http.get(`/api/v2/sample/${name}`)
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

    form.action= `/api/v2/sample/_search/${filename}.tsv`;
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

  searchDataCollectionSamples(dc: string, offset: number, hitsPerPage: number): Observable<SearchHits<Sample>> {
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

  searchPopulationSamples(popCode: string, offset: number, hitsPerPage: number): Observable<SearchHits<Sample>> {
    let query = {
      constant_score: {
        filter: {
          term: { 'population.code': popCode }
        }
      }
    }
    return this.search(hitsPerPage, offset, query);
  }

  searchPopulationSamplesExport(popCode: string) {
    let filename: string = popCode.toLowerCase();
    let query = {
      constant_score: {
        filter: {
          term: { 'population.code': popCode }
        }
      }
    }
    return this.searchExport(query, `igsr-${filename}.tsv`);
  }

  textSearch(text: string, hitsPerPage: number): Observable<SearchHits<Sample>> {
    if (!text) {
      return Observable.of<SearchHits<Sample>>(null);
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

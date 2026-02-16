import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { File } from '../../shared/api-types/file';
import { SearchHits } from '../../shared/api-types/search-hits';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiFileService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  searchDataCollection(dataCollection: string, sampleName: string, populationCode: string, dataTypes: string[], analysisGroups: string[], from: number, hitsPerPage: number): Observable<SearchHits<File>> {
    let body = {
      from: from,
      size: hitsPerPage,
      query: this.buildSearchDataCollectionQuery(dataCollection, sampleName, populationCode, dataTypes, analysisGroups),
    };
    return this.apiTimeoutService.handleTimeout<SearchHits<File>>(
      this.apiErrorService.handleError(
        this.http.post(`/api/beta/file/_search`, body)
      ).map((r:Response): SearchHits<File> => {
        let h: {hits: SearchHits<File>} = r.json() as {hits: SearchHits<File>};
        return h.hits;
      })
    );
  }

  searchDataCollectionExport(dataCollection: string, sampleName: string, populationCode: string, dataTypes: string[], analysisGroups: string[], filename: string) {
    let body = {
      fields: [
        'url', 'md5', 'dataCollections', 'dataType', 'analysisGroup', 'samples', 'populations', 'dataReusePolicy',
      ],
      column_names: [
        'url', 'md5', 'Data collection', 'Data type', 'Analysis group', 'Sample', 'Population', 'Data reuse policy',
      ],
      query: this.buildSearchDataCollectionQuery(dataCollection, sampleName, populationCode, dataTypes, analysisGroups),
    };
    let form = document.createElement('form');

    form.action= `/api/beta/file/_search/${filename}.tsv`;
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

  textSearch(text: string, hitsPerPage: number): Observable<SearchHits<File>> {
    if (!text) {
      return Observable.of<SearchHits<File>>(null);
    }
    let body = {
      size: hitsPerPage,
      _source: [ 'url' ],
      query: {
        multi_match: {
          query: text,
          type: "most_fields",
          fields: [
            'analysisGroup.std',
            'dataCollections.std',
            'dataType.std',
            'samples.std',
            'populations.std',
            'url.keywords',
          ],
        }
      }
    }
    return this.apiTimeoutService.handleTimeout<SearchHits<File>>(
      this.apiErrorService.handleError(
        this.http.post(`/api/beta/file/_search`, body)
      ).map((r:Response): SearchHits<File> => {
        let h: {hits: SearchHits<File>} = r.json() as {hits: SearchHits<File>};
        return h.hits;
      })
    );
  }

  downloadFileList(query: string): void {
    if (!query) {
      console.log('No query provided');
      return;
    }

    // Use server-side export endpoint for full result set (no size limit)
    const body = {
      _source: [ 'url' ],
      query: {
        multi_match: {
          query: query,
          type: "most_fields",
          fields: [
            'analysisGroup.std',
            'dataCollections.std',
            'dataType.std',
            'samples.std',
            'populations.std',
            'url.keywords',
          ],
        }
      }
    };

    const filename = `files-${query}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
    const form = document.createElement('form');
    form.action = `/api/beta/file/_search/${encodeURIComponent(filename)}.tsv`;
    form.method = 'POST';
    form.target = '_self';
    const input = document.createElement('textarea');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'json');
    input.value = JSON.stringify(body);
    form.appendChild(input);
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  private buildSearchDataCollectionQuery(dataCollection: string, sampleName: string, populationCode: string, dataTypes: string[], analysisGroups: string[]): any {
    let filtTerms: any[] = [];
    filtTerms.push({term:{dataCollections: dataCollection}});
    if (sampleName) {
      filtTerms.push({term:{samples: sampleName}});
    }
    if (populationCode) {
      filtTerms.push({term:{populations: populationCode}});
    }
    if (dataTypes.length > 0) {
      filtTerms.push({terms: {dataType: dataTypes}});
    }
    if (analysisGroups.length > 0) {
      filtTerms.push({terms: {analysisGroup: analysisGroups}});
    }
    return {
      constant_score: {
        filter: {
          bool: {
            must: filtTerms,
          }
        }
      }
    };
  }
}

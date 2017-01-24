import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

import { FileList } from '../../shared/api-types/file-list';
import { ApiTimeoutService } from './api-timeout.service';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiFileService {

  constructor(
    private http: Http,
    private apiErrorService: ApiErrorService,
    private apiTimeoutService: ApiTimeoutService,
  ) {}

  searchSample(sampleName: string, dataCollection: string, dataTypes: string[], analysisGroups: string[], from: number, hitsPerPage: number): Observable<FileList> {
    let body = {
      from: from,
      size: hitsPerPage,
      query: this.buildSearchSampleQuery(sampleName, dataCollection, dataTypes, analysisGroups),
    };
    return this.apiTimeoutService.handleTimeout<FileList>(
      this.apiErrorService.handleError(
        this.http.post(`http://www.internationalgenome.org/api/beta/file/_search`, body)
      ).map((r:Response): FileList => {
        let h: {hits: FileList} = r.json() as {hits: FileList};
        return h.hits;
      })
    );
  }

  searchSampleExport(sampleName: string, dataCollection: string, dataTypes: string[], analysisGroups: string[], filename: string) {
    let body = {
      fields: [
        'url', 'md5', 'dataCollections', 'dataType', 'analysisGroup', 'samples', 'populations', 'dataReusePolicy',
      ],
      column_names: [
        'url', 'md5', 'Data collection', 'Data type', 'Analysis group', 'Sample', 'Population', 'Data reuse policy',
      ],
      query: this.buildSearchSampleQuery(sampleName, dataCollection, dataTypes, analysisGroups),
    };
    let form = document.createElement('form');

    form.action= `http://www.internationalgenome.org/api/beta/file/_search/${filename}.tsv`;
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

  private buildSearchSampleQuery(sampleName: string, dataCollection: string, dataTypes: string[], analysisGroups: string[]): any {
    let filtTerms: any[] = [];
    filtTerms.push({term:{dataCollections: dataCollection}});
    filtTerms.push({term:{samples: sampleName}});
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

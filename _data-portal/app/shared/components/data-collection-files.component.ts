import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { DataCollection } from '../api-types/data-collection';
import { SearchHits } from '../api-types/search-hits';
import { File } from '../api-types/file';
import { ApiFileService } from '../../core/services/api-file.service';

let dataCollectionFilesStyles: string = `

table {
  border-top: 2px solid #ddd;
}

button.page-button {
  border-bottom-width: 0;
  border-radius: 15px 15px 0 0;
}

a[role="button"] {
  cursor: pointer;
}

.capitalize {
  text-transform: capitalize;
}

`;

class selectableFilter {
  title: string;
  isFiltered: boolean;
  isDisabled: boolean;
};

@Component({
    templateUrl: './data-collection-files.component.html',
    selector: 'data-collection-files',
    styles: [ dataCollectionFilesStyles ],
})
export class DataCollectionFilesComponent implements OnChanges, OnDestroy {
  @Input() sampleName: string;
  @Input() dataCollection: DataCollection;

  public constructor(
    private apiFileService: ApiFileService,
  ) {};

  public fileList: SearchHits<File> = null;
  public filterDataTypes: selectableFilter[];
  public filterAnalysisGroups: selectableFilter[];

  public offset: number = 0;
  public totalHits: number = -1;
  public displayStart: number = -1;
  public displayStop: number = -1;

  // private properties
  private fileListSource: Subject<Observable<SearchHits<File>>> = null;
  private fileListSubscription: Subscription = null;
  private hitsPerPage: number = 20;

  private filterDataTypesObj: {[key: string]: selectableFilter}
  private filterAnalysisGroupsObj: {[key: string]: selectableFilter}

  ngOnChanges(changes: SimpleChanges) {

    if (!this.fileListSource) {
      this.fileListSource = new Subject<Observable<SearchHits<File>>>();
      this.fileListSubscription = this.fileListSource
          .switchMap((o: Observable<SearchHits<File>>) : Observable<SearchHits<File>> => o)
          .subscribe((fl: SearchHits<File>) => {
            this.fileList = fl
            if (fl) {
              this.totalHits = fl.total;
              this.displayStart = fl.hits && fl.hits.length > 0 ? this.offset + 1 : 0;
              this.displayStop = fl.hits ? this.offset + fl.hits.length : 0;
            }
          });
    }

    this.offset = 0;
    this.totalHits = -1;
    this.filterDataTypes = [];
    this.filterAnalysisGroups = [];
    this.filterDataTypesObj = {};
    this.filterAnalysisGroupsObj = {};


    if (this.dataCollection) {
      let dcObj = this.dataCollection as Object;
      for (let dt of this.dataCollection.dataTypes) {
        this.filterDataTypesObj[dt] = {title: dt, isFiltered: false, isDisabled: false};
        this.filterDataTypes.push(this.filterDataTypesObj[dt]);
        for (let ag of dcObj[dt]) {
          this.filterAnalysisGroupsObj[ag] = {title: ag, isFiltered: false, isDisabled: false};
        }
      }
      for (let ag in this.filterAnalysisGroupsObj) {
        this.filterAnalysisGroups.push(this.filterAnalysisGroupsObj[ag]);
      }
    }
    this.searchFiles();
  }

  public toggleFilterDataType(dt: selectableFilter, isFiltered: boolean) {
    if (dt.isDisabled) {
      return;
    }
    dt.isFiltered = isFiltered;
    this.offset = 0;
    this.totalHits = -1;
    for (let ag of this.filterAnalysisGroups) {
      ag.isDisabled = true;
    }
    var numFilteredDataTypes = 0;
    let dcObj = this.dataCollection as Object;
    for (let dt of this.filterDataTypes) {
      if (dt.isFiltered) {
        for (let ag of dcObj[dt.title]) {
          this.filterAnalysisGroupsObj[ag].isDisabled = false;
        }
        numFilteredDataTypes += 1;
      }
    }
    if (numFilteredDataTypes == 0) {
      for (let ag of this.filterAnalysisGroups) {
        ag.isDisabled = false;
      }
    }
    this.searchFiles();
  }

  public toggleFilterAnalysisGroup(ag: selectableFilter, isFiltered: boolean) {
    if (ag.isDisabled) {
      return;
    }
    ag.isFiltered = isFiltered;
    this.offset = 0;
    this.totalHits = -1;
    for (let dt of this.filterDataTypes) {
      dt.isDisabled = true;
    }
    var numFilteredAnalysisGroups = 0;
    let dcObj = this.dataCollection as Object;
    for (let ag of this.filterAnalysisGroups) {
      if (ag.isFiltered) {
        for (let dtTitle of this.dataCollection.dataTypes) {
          if (dcObj[dtTitle].indexOf(ag.title) > -1) {
            this.filterDataTypesObj[dtTitle].isDisabled = false
          }
        }
        numFilteredAnalysisGroups += 1;
      }
    }
    if (numFilteredAnalysisGroups == 0) {
      for (let dt of this.filterDataTypes) {
        dt.isDisabled = false;
      }
    }
    this.searchFiles();
  }

  hasMore(): boolean {
    if (this.totalHits > this.offset + this.hitsPerPage) {
      return true;
    }
    return false;
  }

  tableNext() {
    if (this.hasMore()) {
      this.offset += this.hitsPerPage;
      this.searchFiles();
    }
  }

  tablePrevious() {
    if (this.offset > 1) {
      this.offset -= this.hitsPerPage;
      this.searchFiles();
    }
  }

  public softHyphens(url: string): string {
    return url ? url.replace(/[\/\.]/g, '$&&shy;') : url;
  }

  public searchFilesExport() {
    if (!this.dataCollection) {
      return;
    }
    this.apiFileService.searchDataCollectionExport(this.dataCollection.title, this.sampleName, null, this.buildSearchDataTypes(), this.buildSearchAnalysisGroups(), `igsr_${this.sampleName}.tsv`);
  }

  private searchFiles() {
    if (!this.dataCollection) {
      this.fileListSource.next(Observable.of<SearchHits<File>>(null));
      return;
    }

    this.fileListSource.next(this.apiFileService.searchDataCollection(this.dataCollection.title, this.sampleName, null, this.buildSearchDataTypes(), this.buildSearchAnalysisGroups(), this.offset, this.hitsPerPage));
  }


  private buildSearchDataTypes(): string[] {
    var dataTypes: string[] = [];
    for (let dt of this.filterDataTypes) {
      if (dt.isFiltered) {
        dataTypes.push(dt.title);
      }
    }
    return dataTypes;
  }

  private buildSearchAnalysisGroups(): string[] {
    var analysisGroups: string[] = [];
    for (let ag of this.filterAnalysisGroups) {
      if (ag.isFiltered) {
        analysisGroups.push(ag.title);
      }
    }
    return analysisGroups;
  }

  ngOnDestroy() {
    if (this.fileListSubscription) {
      this.fileListSubscription.unsubscribe();
    }
  }

};

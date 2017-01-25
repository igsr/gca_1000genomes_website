import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { DataCollection } from '../shared/api-types/data-collection';
import { FileList } from '../shared/api-types/file-list';
import { ApiFileService } from '../core/services/api-file.service';

let dcFilesStyles: string = `


@media (min-width: 786px) {

table {
  border-top: 2px solid #ddd;
}

button.page-button {
  border-bottom-width: 0;
  border-radius: 15px 15px 0 0;
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
    templateUrl: './dc-files.component.html',
    selector: 'dc-files',
    styles: [ dcFilesStyles ],
})
export class DcFilesComponent implements OnChanges, OnDestroy {
  @Input() dc: DataCollection;

  public constructor(
    private apiFileService: ApiFileService,
  ) {};

  public fileList: FileList = null;
  public filterDataTypes: selectableFilter[];
  public filterAnalysisGroups: selectableFilter[];

  public offset: number = 0;
  public totalHits: number = -1;
  public displayStart: number = -1;
  public displayStop: number = -1;

  // private properties
  private fileListSource: Subject<Observable<FileList>> = null;
  private fileListSubscription: Subscription = null;
  private hitsPerPage: number = 20;

  private filterDataTypesObj: {[key: string]: selectableFilter}
  private filterAnalysisGroupsObj: {[key: string]: selectableFilter}

  ngOnChanges(changes: SimpleChanges) {

    if (!this.fileListSource) {
      this.fileListSource = new Subject<Observable<FileList>>();
      this.fileListSubscription = this.fileListSource
          .switchMap((o: Observable<FileList>) : Observable<FileList> => o)
          .subscribe((fl: FileList) => {
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

    if (this.dc) {
      console.log('here2');
      let dcObj: Object = this.dc;
      for (let dt of this.dc.dataTypes) {
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
    let dcObj: Object = this.dc;
    dt.isFiltered = isFiltered;
    this.offset = 0;
    this.totalHits = -1;
    for (let ag of this.filterAnalysisGroups) {
      ag.isDisabled = true;
    }
    var numFilteredDataTypes = 0;
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
    let dcObj: Object = this.dc;
    ag.isFiltered = isFiltered;
    this.offset = 0;
    this.totalHits = -1;
    for (let dt of this.filterDataTypes) {
      dt.isDisabled = true;
    }
    var numFilteredAnalysisGroups = 0;
    for (let ag of this.filterAnalysisGroups) {
      if (ag.isFiltered) {
        for (let dtTitle of this.dc.dataTypes) {
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
    if (!this.dc) {
      return;
    }
    let filename: string = this.dc.title.toLowerCase();
    filename.replace(/\s/g, '-');
    this.apiFileService.searchDataCollectionExport(null, this.dc.title, this.buildSearchDataTypes(), this.buildSearchAnalysisGroups(), `igsr-${filename}.tsv`);
  }

  private searchFiles() {
    if (!this.dc) {
      this.fileListSource.next(Observable.of<FileList>(null));
      return;
    }

    this.fileListSource.next(this.apiFileService.searchDataCollection(null, this.dc.title, this.buildSearchDataTypes(), this.buildSearchAnalysisGroups(), this.offset, this.hitsPerPage));
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

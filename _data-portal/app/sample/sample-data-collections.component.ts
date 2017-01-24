import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Sample } from '../shared/api-types/sample';
import { FileList } from '../shared/api-types/file-list';
import { ApiFileService } from '../core/services/api-file.service';

let sampleDataCollectionStyles: string = `


@media (min-width: 786px) {
  ul.nav-tabs{
    display: flex;
  }
  ul.nav-tabs li {
    display: flex;
    flex: 1;
  }
  ul.nav-tabs li  a {
    flex: 1;
  }
}

a[role="button"] {
  cursor: pointer;
}

`;

class selectableFilter {
  title: string;
  isFiltered: boolean;
  isDisabled: boolean;
};

@Component({
    templateUrl: './sample-data-collections.component.html',
    selector: 'sample-data-collections',
    styles: [ sampleDataCollectionStyles ],
})
export class SampleDataCollectionsComponent implements OnChanges, OnDestroy {
  @Input() sample: Sample;

  public constructor(
    private apiFileService: ApiFileService,
  ) {};

  public currentDC: Object = null;
  public fileList: FileList = null;
  public offset: number = 0;
  public filterDataTypes: selectableFilter[];
  public filterAnalysisGroups: selectableFilter[];

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
          .subscribe((fl: FileList) => this.fileList = fl);
    }

    this.setDC(this.sample.dataCollections ? this.sample.dataCollections[0] : null);
  }

  public setDC(dc: Object) {
    this.currentDC = dc;
    this.offset = 0;
    this.filterDataTypes = [];
    this.filterAnalysisGroups = [];
    this.filterDataTypesObj = {};
    this.filterAnalysisGroupsObj = {};

    if (dc) {
      for (let dt of dc['dataTypes']) {
        this.filterDataTypesObj[dt] = {title: dt, isFiltered: false, isDisabled: false};
        this.filterDataTypes.push(this.filterDataTypesObj[dt]);
        for (let ag of dc[dt]) {
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
    for (let ag of this.filterAnalysisGroups) {
      ag.isDisabled = true;
    }
    var numFilteredDataTypes = 0;
    for (let dt of this.filterDataTypes) {
      if (dt.isFiltered) {
        for (let ag of this.currentDC[dt.title]) {
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
    for (let dt of this.filterDataTypes) {
      dt.isDisabled = true;
    }
    var numFilteredAnalysisGroups = 0;
    for (let ag of this.filterAnalysisGroups) {
      if (ag.isFiltered) {
        for (let dtTitle of this.currentDC['dataTypes']) {
          if (this.currentDC[dtTitle].indexOf(ag.title) > -1) {
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

  private searchFiles() {
    if (!this.currentDC) {
      this.fileListSource.next(Observable.of<FileList>(null));
      return;
    }

    var dataTypes: string[] = [];
    for (let dt of this.filterDataTypes) {
      if (dt.isFiltered) {
        dataTypes.push(dt.title);
      }
    }
    var analysisGroups: string[] = [];
    for (let ag of this.filterAnalysisGroups) {
      if (ag.isFiltered) {
        analysisGroups.push(ag.title);
      }
    }
    this.fileListSource.next(this.apiFileService.searchSample(this.sample.name, this.currentDC['title'], dataTypes, analysisGroups, this.offset, this.hitsPerPage));
  }

  ngOnDestroy() {
    if (this.fileListSubscription) {
      this.fileListSubscription.unsubscribe();
    }
  }

};

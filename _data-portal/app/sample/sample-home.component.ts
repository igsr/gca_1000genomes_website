import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiSampleService } from '../core/services/api-sample.service';
import { ApiAnalysisGroupService } from '../core/services/api-analysis-group.service';
import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { Sample } from '../shared/api-types/sample';

let sampleHomeStyles: string = `

div.table-container {
  padding-right: 90px;
  position: relative;
  overflow-y: auto;
}

h3.current-filters {
  display: inline-block;
}

@media (max-width: 991px) {
  div.table-container {
    width: 100%;
    overflow-x: scroll;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    -webkit-overflow-scrolling: touch;
    padding-right: 0px;
  }
}
div.table-buttons {
  position: absolute;
  top: 0;
}
div.table-buttons h4 {
  margin: 10px 0px;
}

button.page-button {
  border: 1px solid #ddd;
  border-radius: 15px;
  margin: 0px 0px 10px;
}
`;

@Component({
    templateUrl: './sample-home.component.html',
    styles: [ sampleHomeStyles ],
})
export class SampleHomeComponent implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private apiSampleService: ApiSampleService,
    apiAnalysisGroupService: ApiAnalysisGroupService,
    apiDataCollectionService: ApiDataCollectionService,
  ) { 
    this.agTitleMap = apiAnalysisGroupService.titleMap;
    this.dcTitleMap = apiDataCollectionService.titleMap;
  }

  public sampleHits: SearchHits<Sample>;
  public totalHits: number = -1;
  public displayStart: number = -1;
  public displayStop: number = -1;
  public offset: number = 0;
  public viewOption: number = 1;

  public popFilterVisible: boolean = false;
  public popFilters: {[code: string]: boolean} = {};
  public popFiltersArr: string[] = [];

  public agFilterVisible: boolean = false;
  public agFilters: {[code: string]: boolean} = {};
  public agFiltersArr: string[] = [];
  readonly agTitleMap: {[key: string]: string};

  public dcFilterVisible: boolean = false;
  public dcFilters: {[code: string]: boolean} = {};
  public dcFiltersArr: string[] = [];
  readonly dcTitleMap: {[key: string]: string};
  
  private sampleHitsSource: Subject<Observable<SearchHits<Sample>>>;
  private sampleHitsSubscription: Subscription = null;
  private hitsPerPage: number = 50;

  ngOnInit() {
    this.titleService.setTitle('IGSR | samples');
    this.sampleHitsSource = new Subject<Observable<SearchHits<Sample>>>();
    this.sampleHitsSubscription = this.sampleHitsSource
      .switchMap((o: Observable<SearchHits<Sample>>): Observable<SearchHits<Sample>> => o)
      .subscribe((h: SearchHits<Sample>) => {
          this.sampleHits = h;
          if (h) {
            this.totalHits = h.total;
            this.displayStart = h.hits && h.hits.length > 0 ? this.offset + 1 : 0;
            this.displayStop = h.hits ? this.offset + h.hits.length : 0;
          }
        })
    this.search();
  }
  ngOnDestroy() {
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
    }
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
      this.search();
    }
  }

  tablePrevious() {
    if (this.offset > 1) {
      this.offset -= this.hitsPerPage;
      this.search();
    }
  }

  toggleView() {
    this.viewOption = this.viewOption == 1 ? 2 : 1;
  }

  onPopFiltersChange(popFilters: {[code: string]: boolean}) {
    this.offset = 0;
    this.totalHits = -1;
    this.popFiltersArr = [];
    for (let key in popFilters) {
      if (popFilters[key]) {
        this.popFiltersArr.push(key);
      }
    }
    this.search();
  }

  onAgFiltersChange(agFilters: {[code: string]: boolean}) {
    this.offset = 0;
    this.totalHits = -1;
    this.agFiltersArr = [];
    for (let key in agFilters) {
      if (agFilters[key]) {
        this.agFiltersArr.push(key);
      }
    }
    this.search();
  }

  onDcFiltersChange(dcFilters: {[code: string]: boolean}) {
    this.offset = 0;
    this.totalHits = -1;
    this.dcFiltersArr = [];
    for (let key in dcFilters) {
      if (dcFilters[key]) {
        this.dcFiltersArr.push(key);
      }
    }
    this.search();
  }

  search() {
    this.sampleHitsSource.next( this.apiSampleService.search(this.hitsPerPage, this.offset, this.buildQuery()));
  }
  searchExport() {
    this.apiSampleService.searchExport(this.buildQuery(), 'igsr_samples');
  }

  private buildQuery() {
    let mustArray: any[] = [];
    if (this.popFiltersArr.length > 0) {
      mustArray.push({terms: {'population.code': this.popFiltersArr}});
    }
    for (let ag of this.agFiltersArr) {
      mustArray.push({term: {'dataCollections._analysisGroups': ag}});
    }
    for (let dc of this.dcFiltersArr) {
      mustArray.push({term: {'dataCollections.title': dc}});
    }
    return mustArray.length == 0 ? null
       : { constant_score: { filter: { bool: { must: mustArray } } } };
  }
};

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiPopulationService } from '../core/services/api-population.service';
import { ApiAnalysisGroupService } from '../core/services/api-analysis-group.service';
import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';

let populationHomeStyles: string = `

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
    templateUrl: './population-home.component.html',
    styles: [ populationHomeStyles ],
})
export class PopulationHomeComponent implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private apiPopulationService: ApiPopulationService,
    apiAnalysisGroupService: ApiAnalysisGroupService,
    apiDataCollectionService: ApiDataCollectionService,
  ) { 
    this.agTitleMap = apiAnalysisGroupService.titleMap;
    this.dcTitleMap = apiDataCollectionService.titleMap;
  }

  public populationHits: SearchHits<Population>;
  public viewOption: number = 0;

  public agFilterVisible: boolean = false;
  public agFilters: {[code: string]: boolean} = {};
  public agFiltersArr: string[] = [];
  readonly agTitleMap: {[key: string]: string};

  public dcFilterVisible: boolean = false;
  public dcFilters: {[code: string]: boolean} = {};
  public dcFiltersArr: string[] = [];
  readonly dcTitleMap: {[key: string]: string};

	public mapKeyVisible: boolean = false;
  
  private populationHitsSource: Subject<Observable<SearchHits<Population>>>;
  private populationHitsSubscription: Subscription = null;
  private hitsPerPage: number = 50;

  ngOnInit() {
    this.titleService.setTitle('IGSR | populations');
    this.populationHitsSource = new Subject<Observable<SearchHits<Population>>>();
    this.populationHitsSubscription = this.populationHitsSource
      .switchMap((o: Observable<SearchHits<Population>>): Observable<SearchHits<Population>> => o)
      .subscribe((h: SearchHits<Population>) => this.populationHits = h )
    this.search();
  }
  ngOnDestroy() {
    if (this.populationHitsSubscription) {
      this.populationHitsSubscription.unsubscribe();
    }
  }

	//mapView() {
	//	this.viewOption = 0;
//	}

	dataCollectionView() {
		this.viewOption = 1;
	}

	technologyView() {
		this.viewOption = 2;
	}

  onAgFiltersChange(agFilters: {[code: string]: boolean}) {
    this.agFiltersArr = [];
    for (let key in agFilters) {
      if (agFilters[key]) {
        this.agFiltersArr.push(key);
      }
    }
    this.search();
  }

  onDcFiltersChange(dcFilters: {[code: string]: boolean}) {
    this.dcFiltersArr = [];
    for (let key in dcFilters) {
      if (dcFilters[key]) {
        this.dcFiltersArr.push(key);
      }
    }
    this.search();
  }

  search() {
    this.populationHitsSource.next( this.apiPopulationService.search(-1, 0, this.buildQuery()));
  }
  searchExport() {
    this.apiPopulationService.searchExport(this.buildQuery(), 'igsr_populations');
  }

  private buildQuery() {
    let mustArray: any[] = [];
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

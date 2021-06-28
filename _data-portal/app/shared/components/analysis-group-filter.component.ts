/*
IGSR-328 Retain portal filters when using back button
Author: ranjits@ebi.ac.uk
Date: 28 June 2021
Changes: 
	Save the filter in sessionStorage (changeFilter function) whenever user select/unselect a filter in this page
	In ngOnInit(), get the saved sessionStorage. If value(s) exist, assign this value(s) to this.filter	
*/

import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiAnalysisGroupService} from '../../core/services/api-analysis-group.service';
import { SearchHits } from  '../api-types/search-hits';
import { AnalysisGroup } from  '../api-types/analysis-group';

let agFilterStyles: string = `
  div.panel {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  div.checkbox {
    width: 50%;
    display: inline-block;
    margin: 2px 0;
  }
`;

@Component({
    selector: 'analysis-group-filter',
    templateUrl: './analysis-group-filter.component.html',
    styles: [ agFilterStyles ],
})
export class AnalysisGroupFilterComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() filters: {[code: string]: boolean};
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filtersChange = new EventEmitter<{[code: string]: boolean}>();


  constructor(
    private apiAnalysisGroupService: ApiAnalysisGroupService,
  ){};
  
  // public properties:
  public agList: SearchHits<AnalysisGroup>;

  // private properties:
  private agListSubscription: Subscription = null;

  ngOnInit() {
    // IGSR - 328 - START
    var previousFiltersAg = sessionStorage.getItem('FILTER_LIST_AG');
    var filterListAg = JSON.parse(previousFiltersAg);
    if (filterListAg) {
      this.filters = filterListAg;
      this.filtersChange.emit(this.filters);
    }
    // IGSR - 328 - END
    this.agListSubscription = this.apiAnalysisGroupService.getAll()
      .subscribe((h: SearchHits<AnalysisGroup>) => this.agList = h);
  }

  ngOnDestroy() {
    if (this.agListSubscription) {
      this.agListSubscription.unsubscribe();
    }
  }

  changeFilter(code: string, isFiltered: boolean) {
    this.filters[code] = isFiltered;
    this.filtersChange.emit(this.filters);
    // IGSR - 328 - START
    sessionStorage.setItem('FILTER_LIST_AG', JSON.stringify(this.filters));
    // IGSR - 328 - END
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

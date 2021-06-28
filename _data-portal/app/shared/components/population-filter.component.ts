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

import { ApiPopulationService} from '../../core/services/api-population.service';
import { SearchHits } from '../api-types/search-hits';
import { Population } from '../api-types/population';

let popFilterStyles: string = `
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
    selector: 'population-filter',
    templateUrl: './population-filter.component.html',
    styles: [ popFilterStyles ],
})
export class PopulationFilterComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() filters: {[code: string]: boolean};
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filtersChange = new EventEmitter<{[code: string]: boolean}>();


  constructor(
    private apiPopulationService: ApiPopulationService,
  ){};
  
  // public properties:
  public popHits: SearchHits<Population>;

  // private properties:
  private popHitsSubscription: Subscription = null;

  ngOnInit() {
    // IGSR - 328 - START
    var previousFilters = sessionStorage.getItem('FILTER_LIST');
    var filterList = JSON.parse(previousFilters);
    if (filterList) {
      this.filters = filterList;
      this.filtersChange.emit(this.filters);
    }   
    // IGSR - 328 - END
    this.popHitsSubscription = this.apiPopulationService.getAll()
      .subscribe((h: SearchHits<Population>) => this.popHits = h);
  }

  ngOnDestroy() {
    if (this.popHitsSubscription) {
      this.popHitsSubscription.unsubscribe();
    }
  }

  changeFilter(code: string, isFiltered: boolean) {
    this.filters[code] = isFiltered;
    this.filtersChange.emit(this.filters);
    // IGSR - 328 - START
    sessionStorage.setItem('FILTER_LIST', JSON.stringify(this.filters));
    // IGSR - 328 - END    
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

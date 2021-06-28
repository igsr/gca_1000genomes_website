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

import { ApiDataCollectionService} from '../../core/services/api-data-collection.service';
import { SearchHits } from '../api-types/search-hits';
import { DataCollection } from '../api-types/data-collection';

let dcFilterStyles: string = `
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
    selector: 'data-collection-filter',
    templateUrl: './data-collection-filter.component.html',
    styles: [ dcFilterStyles ],
})
export class DataCollectionFilterComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() filters: {[code: string]: boolean};
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filtersChange = new EventEmitter<{[code: string]: boolean}>();


  constructor(
    private apiDataCollectionService: ApiDataCollectionService,
  ){};
  
  // public properties:
  public dcList: SearchHits<DataCollection>;

  // private properties:
  private dcListSubscription: Subscription = null;

  ngOnInit() {
    // IGSR - 328 - START
    var previousFiltersDc = sessionStorage.getItem('FILTER_LIST_DC');
    var filterListDc = JSON.parse(previousFiltersDc);
    if (filterListDc) {
      this.filters = filterListDc;
      this.filtersChange.emit(this.filters);
    }    
    // IGSR - 328 - END
    this.dcListSubscription = this.apiDataCollectionService.getAll()
      .subscribe((h: SearchHits<DataCollection>) => this.dcList = h);
  }

  ngOnDestroy() {
    if (this.dcListSubscription) {
      this.dcListSubscription.unsubscribe();
    }
  }

  changeFilter(code: string, isFiltered: boolean) {
    this.filters[code] = isFiltered;
    this.filtersChange.emit(this.filters);
    // IGSR - 328 - START
    sessionStorage.setItem('FILTER_LIST_DC', JSON.stringify(this.filters));
    // IGSR - 328 - END    
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

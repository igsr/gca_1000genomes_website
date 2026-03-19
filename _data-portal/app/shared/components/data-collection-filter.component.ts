import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiDataCollectionService} from '../../core/services/api-data-collection.service';
import { SearchHits } from '../api-types/search-hits';
import { DataCollection } from '../api-types/data-collection';
import { FilterSelectionChange } from '../filter-builder-base';

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
  @Output() filtersChange = new EventEmitter<FilterSelectionChange>();


  constructor(
    private apiDataCollectionService: ApiDataCollectionService,
  ){};
  
  // public properties:
  public dcList: SearchHits<DataCollection>;

  // private properties:
  private dcListSubscription: Subscription = null;

  ngOnInit() {
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
    this.filtersChange.emit({ filters: this.filters, code, isFiltered });
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

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
  div.panel-body {
    overflow: visible;
  }
  div.filter-options-scroll {
    overflow-x: auto;
    overflow-y: visible;
  }
  div.form.filter-options-grid {
    align-content: flex-start;
    display: flex;
    flex-flow: column wrap;
    height: 240px;
  }
  div.checkbox {
    display: block;
    flex: 0 0 auto;
    margin: 2px 0;
    padding-right: 16px;
    width: 320px;
  }
  div.checkbox label {
    display: block;
    font-weight: 400;
    line-height: 1.35;
    white-space: normal;
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
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

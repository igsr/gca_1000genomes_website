import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiPopulationService} from '../../core/services/api-population.service';
import { ApiHits } from '../api-types/api-hits';

let popFilterStyles: string = `
  div.panel {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  div.checkbox {
    width: 80px;
    display: inline-block;
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
  public popHits: ApiHits;

  // private properties:
  private popHitsSubscription: Subscription = null;

  ngOnInit() {
    this.popHitsSubscription = this.apiPopulationService.getAll()
      .subscribe((h: ApiHits) => this.popHits = h);
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

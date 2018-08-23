import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiSuperPopulationService} from '../core/services/api-superpopulation.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { SuperPopulation } from '../shared/api-types/superpopulation';

let popMapKeyStyles: string = `
  div.panel {
  }
	ul {
		width: 20%;
		display: block;
		float: left;
		list-style-type: none;
	}
`;

@Component({
    selector: 'population-map-key',
    templateUrl: './population-map-key.component.html',
    styles: [ popMapKeyStyles ],
})
export class PopulationMapKeyComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  //@Input() filters: {[code: string]: boolean};
  @Output() visibleChange = new EventEmitter<boolean>();
  //@Output() filtersChange = new EventEmitter<{[code: string]: boolean}>();


  constructor(
    private apiSuperPopulationService: ApiSuperPopulationService,
  ){};
  
  // public properties:
  public superpopHits: SearchHits<SuperPopulation>;

  // private properties:
  private popHitsSubscription: Subscription = null;

  ngOnInit() {
    this.popHitsSubscription = this.apiSuperPopulationService.getAll()
      .subscribe((h: SearchHits<SuperPopulation>) => this.superpopHits = h);
  }

  ngOnDestroy() {
    if (this.popHitsSubscription) {
      this.popHitsSubscription.unsubscribe();
    }
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

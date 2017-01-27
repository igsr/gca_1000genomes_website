import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiPopulationService } from '../core/services/api-population.service';
import { ApiHits } from '../shared/api-types/api-hits';

let searchPopulationsStyles: string = `
  ul.list-group {
    margin: 0;
    max-height: 200px;
    overflow-y: scroll;
  }
  .list-group-item {
    padding: 5px 15px;
  }
`;

@Component({
    templateUrl: './search-populations.component.html',
    selector: 'search-populations',
    styles: [ searchPopulationsStyles ],
})
export class SearchPopulationsComponent implements OnChanges, OnDestroy {
  @Input() query: string;

  public constructor(
    private apiPopulationService: ApiPopulationService,
  ) {};

  public popHits: ApiHits = null;

  // private properties
  private popHitsSource: Subject<Observable<ApiHits>> = null;
  private popHitsSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.popHitsSource) {
      this.popHitsSource = new Subject<Observable<ApiHits>>();
      this.popHitsSubscription = this.popHitsSource
          .switchMap((o: Observable<ApiHits>) : Observable<ApiHits> => o)
          .subscribe((h: ApiHits) => {
            this.popHits = h
          });
    }

    this.popHitsSource.next(this.apiPopulationService.textSearch(this.query, this.hitsPerPage));
  }

  ngOnDestroy() {
    if (this.popHitsSubscription) {
      this.popHitsSubscription.unsubscribe();
    }
  }

};

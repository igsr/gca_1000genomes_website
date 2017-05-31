import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiPopulationService } from '../core/services/api-population.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';

let searchPopulationsStyles: string = `
  ul.list-group {
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
  }
  a.list-group-item {
    padding: 5px 15px;
    color: #337ab7;
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

  public popHits: SearchHits<Population> = null;

  // private properties
  private popHitsSource: Subject<Observable<SearchHits<Population>>> = null;
  private popHitsSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.popHitsSource) {
      this.popHitsSource = new Subject<Observable<SearchHits<Population>>>();
      this.popHitsSubscription = this.popHitsSource
          .switchMap((o: Observable<SearchHits<Population>>) : Observable<SearchHits<Population>> => o)
          .subscribe((h: SearchHits<Population>) => {
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

import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';
import { ApiPopulationService } from '../core/services/api-population.service';

let dcPopulationsStyles: string = `

table {
  border-top: 2px solid #ddd;
}

button.page-button {
  border-bottom-width: 0;
  border-radius: 15px 15px 0 0;
}

`;

@Component({
    templateUrl: './dc-populations.component.html',
    selector: 'dc-populations',
    styles: [ dcPopulationsStyles ],
})
export class DcPopulationsComponent implements OnChanges, OnDestroy {
  @Input() dc: string;

  public constructor(
    private apiPopulationService: ApiPopulationService,
  ) {};

  public apiHits: SearchHits<Population> = null;

  public offset: number = 0;
  public totalHits: number = -1;

  // private properties
  private populationListSource: Subject<Observable<SearchHits<Population>>> = null;
  private populationListSubscription: Subscription = null;
  private hitsPerPage: number = 10;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.populationListSource) {
      this.populationListSource = new Subject<Observable<SearchHits<Population>>>();
      this.populationListSubscription = this.populationListSource
          .switchMap((o: Observable<SearchHits<Population>>) : Observable<SearchHits<Population>> => o)
          .subscribe((h: SearchHits<Population>) => {
            this.apiHits = h;
            if (h) {
              this.totalHits = h.total;
            }
          });
    }

    this.offset = 0;
    this.totalHits = -1;
    this.searchPopulations();
  }

  hasMore(): boolean {
    if (this.totalHits > this.offset + this.hitsPerPage) {
      return true;
    }
    return false;
  }

  tableNext() {
    if (this.hasMore()) {
      this.offset += this.hitsPerPage;
      this.searchPopulations();
    }
  }

  tablePrevious() {
    if (this.offset > 1) {
      this.offset -= this.hitsPerPage;
      this.searchPopulations();
    }
  }

  public searchPopulationsExport() {
    this.apiPopulationService.searchDataCollectionPopulationsExport(this.dc);
  }

  private searchPopulations() {
    this.populationListSource.next(this.apiPopulationService.searchDataCollectionPopulations(this.dc, this.offset, this.hitsPerPage));
  }

  ngOnDestroy() {
    if (this.populationListSubscription) {
      this.populationListSubscription.unsubscribe();
    }
  }

};

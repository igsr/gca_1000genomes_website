import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { ApiHits } from '../shared/api-types/api-hits';

let searchDataCollectionsStyles: string = `
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
    templateUrl: './search-data-collections.component.html',
    selector: 'search-data-collections',
    styles: [ searchDataCollectionsStyles ],
})
export class SearchDataCollectionsComponent implements OnChanges, OnDestroy {
  @Input() query: string;

  public constructor(
    private apiDataCollectionService: ApiDataCollectionService,
  ) {};

  public dcHits: ApiHits = null;

  // private properties
  private dcHitsSource: Subject<Observable<ApiHits>> = null;
  private dcHitsSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.dcHitsSource) {
      this.dcHitsSource = new Subject<Observable<ApiHits>>();
      this.dcHitsSubscription = this.dcHitsSource
          .switchMap((o: Observable<ApiHits>) : Observable<ApiHits> => o)
          .subscribe((h: ApiHits) => {
            this.dcHits = h
          });
    }

    this.dcHitsSource.next(this.apiDataCollectionService.textSearch(this.query, this.hitsPerPage));
  }

  ngOnDestroy() {
    if (this.dcHitsSubscription) {
      this.dcHitsSubscription.unsubscribe();
    }
  }

};

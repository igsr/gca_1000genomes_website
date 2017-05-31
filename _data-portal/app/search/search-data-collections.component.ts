import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { DataCollection } from '../shared/api-types/data-collection';

let searchDataCollectionsStyles: string = `
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
    templateUrl: './search-data-collections.component.html',
    selector: 'search-data-collections',
    styles: [ searchDataCollectionsStyles ],
})
export class SearchDataCollectionsComponent implements OnChanges, OnDestroy {
  @Input() query: string;

  public constructor(
    private apiDataCollectionService: ApiDataCollectionService,
  ) {};

  public dcHits: SearchHits<DataCollection> = null;

  // private properties
  private dcHitsSource: Subject<Observable<SearchHits<DataCollection>>> = null;
  private dcHitsSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.dcHitsSource) {
      this.dcHitsSource = new Subject<Observable<SearchHits<DataCollection>>>();
      this.dcHitsSubscription = this.dcHitsSource
          .switchMap((o: Observable<SearchHits<DataCollection>>) : Observable<SearchHits<DataCollection>> => o)
          .subscribe((h: SearchHits<DataCollection>) => {
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

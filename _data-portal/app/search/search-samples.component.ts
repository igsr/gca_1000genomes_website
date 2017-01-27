import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiSampleService } from '../core/services/api-sample.service';
import { ApiHits } from '../shared/api-types/api-hits';

let searchSamplesStyles: string = `
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
    templateUrl: './search-samples.component.html',
    selector: 'search-samples',
    styles: [ searchSamplesStyles ],
})
export class SearchSamplesComponent implements OnChanges, OnDestroy {
  @Input() query: string;

  public constructor(
    private apiSampleService: ApiSampleService,
  ) {};

  public sampleHits: ApiHits = null;

  // private properties
  private sampleHitsSource: Subject<Observable<ApiHits>> = null;
  private sampleHitsSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.sampleHitsSource) {
      this.sampleHitsSource = new Subject<Observable<ApiHits>>();
      this.sampleHitsSubscription = this.sampleHitsSource
          .switchMap((o: Observable<ApiHits>) : Observable<ApiHits> => o)
          .subscribe((h: ApiHits) => {
            this.sampleHits = h
          });
    }

    this.sampleHitsSource.next(this.apiSampleService.textSearch(this.query, this.hitsPerPage));
  }

  ngOnDestroy() {
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
    }
  }

};

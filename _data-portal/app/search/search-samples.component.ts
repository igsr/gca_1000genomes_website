import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiSampleService } from '../core/services/api-sample.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { Sample } from '../shared/api-types/sample';

let searchSamplesStyles: string = `
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
    templateUrl: './search-samples.component.html',
    selector: 'search-samples',
    styles: [ searchSamplesStyles ],
})
export class SearchSamplesComponent implements OnChanges, OnDestroy {
  @Input() query: string;

  public constructor(
    private apiSampleService: ApiSampleService,
  ) {};

  public sampleHits: SearchHits<Sample> = null;

  // private properties
  private sampleHitsSource: Subject<Observable<SearchHits<Sample>>> = null;
  private sampleHitsSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.sampleHitsSource) {
      this.sampleHitsSource = new Subject<Observable<SearchHits<Sample>>>();
      this.sampleHitsSubscription = this.sampleHitsSource
          .switchMap((o: Observable<SearchHits<Sample>>) : Observable<SearchHits<Sample>> => o)
          .subscribe((h: SearchHits<Sample>) => {
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

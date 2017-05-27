import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { SearchHits } from '../shared/api-types/search-hits';
import { Sample } from '../shared/api-types/sample';
import { ApiSampleService } from '../core/services/api-sample.service';

let dcSamplesStyles: string = `

table {
  border-top: 2px solid #ddd;
}

button.page-button {
  border-bottom-width: 0;
  border-radius: 15px 15px 0 0;
}

`;

@Component({
    templateUrl: './dc-samples.component.html',
    selector: 'dc-samples',
    styles: [ dcSamplesStyles ],
})
export class DcSamplesComponent implements OnChanges, OnDestroy {
  @Input() dc: string;

  public constructor(
    private apiSampleService: ApiSampleService,
  ) {};

  public apiHits: SearchHits<Sample> = null;

  public offset: number = 0;
  public totalHits: number = -1;

  // private properties
  private sampleListSource: Subject<Observable<SearchHits<Sample>>> = null;
  private sampleListSubscription: Subscription = null;
  private hitsPerPage: number = 10;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.sampleListSource) {
      this.sampleListSource = new Subject<Observable<SearchHits<Sample>>>();
      this.sampleListSubscription = this.sampleListSource
          .switchMap((o: Observable<SearchHits<Sample>>) : Observable<SearchHits<Sample>> => o)
          .subscribe((h: SearchHits<Sample>) => {
            this.apiHits = h;
            if (h) {
              this.totalHits = h.total;
            }
          });
    }

    this.offset = 0;
    this.totalHits = -1;
    this.searchSamples();
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
      this.searchSamples();
    }
  }

  tablePrevious() {
    if (this.offset > 1) {
      this.offset -= this.hitsPerPage;
      this.searchSamples();
    }
  }

  public searchSamplesExport() {
    this.apiSampleService.searchDataCollectionSamplesExport(this.dc);
  }

  private searchSamples() {
    this.sampleListSource.next(this.apiSampleService.searchDataCollectionSamples(this.dc, this.offset, this.hitsPerPage));
  }

  ngOnDestroy() {
    if (this.sampleListSubscription) {
      this.sampleListSubscription.unsubscribe();
    }
  }

};

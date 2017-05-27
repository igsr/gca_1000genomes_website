import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Population } from '../shared/api-types/population';
import { Sample } from '../shared/api-types/sample';
import { SearchHits } from '../shared/api-types/search-hits';
import { ApiSampleService } from '../core/services/api-sample.service';

let populationSamplesStyles: string = `

button.page-button {
  border-bottom-width: 0;
  border-radius: 15px 15px 0 0;
}

a[role="button"] {
  cursor: pointer;
}

.capitalize {
  text-transform: capitalize;
}

`;

@Component({
    templateUrl: './population-samples.component.html',
    selector: 'population-samples',
    styles: [ populationSamplesStyles ],
})
export class PopulationSamplesComponent implements OnChanges, OnDestroy {
  @Input() population: Population;

  public constructor(
    private apiSampleService: ApiSampleService,
  ) {};

  public sampleHits: SearchHits<Sample> = null;

  public offset: number = 0;
  public totalHits: number = -1;

  // private properties
  private sampleHitsSource: Subject<Observable<SearchHits<Sample>>> = null;
  private sampleHitsSubscription: Subscription = null;
  private hitsPerPage: number = 10;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.sampleHitsSource) {
      this.sampleHitsSource = new Subject<Observable<SearchHits<Sample>>>();
      this.sampleHitsSubscription = this.sampleHitsSource
          .switchMap((o: Observable<SearchHits<Sample>>) : Observable<SearchHits<Sample>> => o)
          .subscribe((h: SearchHits<Sample>) => {
            this.sampleHits = h
            if (h) {
              this.totalHits = h.total;
            }
          });
    }

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
    if (!this.population) {
      return;
    }
    this.apiSampleService.searchPopulationSamplesExport(this.population.code);
  }

  private searchSamples() {
    if (!this.population) {
      this.sampleHitsSource.next(Observable.of<SearchHits<Sample>>(null));
      return;
    }

    this.sampleHitsSource.next(this.apiSampleService.searchPopulationSamples(this.population.name, this.offset, this.hitsPerPage));
  }



  ngOnDestroy() {
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
    }
  }

};

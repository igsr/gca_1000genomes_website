/*
IGSR-327 Bug fix to remove soft hyphens in URLs when copying to browser
Author: ranjits@ebi.ac.uk
Date: 25 June 2021
Changes:  
  Replace: return url ? url.replace(/[\/\.]/g, '$&&shy;') : url;
  with:    return url ? url.replace(/[\/\.]/g, '$&<wbr>') : url;
*/ 
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiPopulationService } from '../core/services/api-population.service';
import { ApiSampleService } from '../core/services/api-sample.service';
import { Population } from '../shared/api-types/population';
import { SearchHits } from '../shared/api-types/search-hits';
import { File } from '../shared/api-types/file';
import { DataCollection } from '../shared/api-types/data-collection';

@Component({
    templateUrl: './population-detail.component.html',
    styles: [`
button.page-button {
  border-bottom-width: 0;
  border-radius: 15px 15px 0 0;
}

button.download-button {
  display: block;
  margin: 0 auto 15px;
}

.capitalize {
  text-transform: capitalize;
}

table > thead > tr {
  border-top: 2px solid #ddd;
}
`],
})
export class PopulationDetailComponent implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private apiPopulationService: ApiPopulationService,
    private apiSampleService: ApiSampleService,
  ) {}

  public popCode: string;
  public pop: Population;
  public currentDC: DataCollection;
  public files: SearchHits<File>;
  public sampleHits: SearchHits<any> = null;
  public sampleOffset: number = 0;
  public sampleTotalHits: number = -1;

  // private properties
  private routeSubscription: Subscription = null;
  private popSource: Subject<Observable<Population>> = null;
  private popSubscription: Subscription = null;
  private sampleHitsSource: Subject<Observable<SearchHits<any>>> = null;
  private sampleHitsSubscription: Subscription = null;
  private hitsPerPage: number = 10;

  ngOnInit() {
    this.popSource = new Subject<Observable<Population>>();
    this.popSubscription = this.popSource
        .switchMap((o: Observable<Population>) : Observable<Population> => o)
        .subscribe((p: Population) => {
          this.pop = p;
          this.sampleOffset = 0;
          this.sampleTotalHits = -1;
          this.searchSamples();
        });
    this.sampleHitsSource = new Subject<Observable<SearchHits<any>>>();
    this.sampleHitsSubscription = this.sampleHitsSource
        .switchMap((o: Observable<SearchHits<any>>) : Observable<SearchHits<any>> => o)
        .subscribe((h: SearchHits<any>) => {
          this.sampleHits = h;
          if (h) {
            this.sampleTotalHits = h.total;
          }
        });
    this.routeSubscription = this.activatedRoute.params.subscribe((params: {popCode: string}) => {
      this.popCode = params.popCode;
      this.titleService.setTitle( `${this.popCode} | IGSR population`);
      if (this.popCode) {
        this.popSource.next(this.apiPopulationService.get(this.popCode));
      }
    });
  }

  public softHyphens(url: string): string {
     /** return url ? url.replace(/[\/\.]/g, '$&&shy;') : url;  **/
    return url ? url.replace(/[\/\.]/g, '$&<wbr>') : url;
  }

  hasMoreSamples(): boolean {
    return this.sampleTotalHits > this.sampleOffset + this.hitsPerPage;
  }

  sampleTableNext() {
    if (this.hasMoreSamples()) {
      this.sampleOffset += this.hitsPerPage;
      this.searchSamples();
    }
  }

  sampleTablePrevious() {
    if (this.sampleOffset > 0) {
      this.sampleOffset -= this.hitsPerPage;
      this.searchSamples();
    }
  }

  searchSamplesExport() {
    if (this.pop) {
      this.apiSampleService.searchPopulationSamplesExport(this.pop.elasticId);
    }
  }
    
  ngOnDestroy() {
    if (this.popSubscription) {
      this.popSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
    }
  }

  private searchSamples() {
    if (!this.sampleHitsSource) {
      return;
    }
    if (!this.pop) {
      this.sampleHits = null;
      this.sampleTotalHits = -1;
      return;
    }
    this.sampleHitsSource.next(this.apiSampleService.searchPopulationSamples(this.pop.elasticId, this.sampleOffset, this.hitsPerPage));
  }

};

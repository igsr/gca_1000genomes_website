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

import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { ApiPopulationService } from '../core/services/api-population.service';
import { ApiSampleService } from '../core/services/api-sample.service';
import { DataCollection } from '../shared/api-types/data-collection';
import { SearchHits } from '../shared/api-types/search-hits';
import { File } from '../shared/api-types/file';
import { Population } from '../shared/api-types/population';
import { Sample } from '../shared/api-types/sample';

let dataCollectionStyles: string = `

table {
  border-top: 2px solid #ddd;
}

button.page-button {
  border-bottom-width: 0;
  border-radius: 15px 15px 0 0;
}

`;

@Component({
    templateUrl: './data-collection-detail.component.html',
    styles: [ dataCollectionStyles ],
})
export class DataCollectionDetailComponent implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private apiDataCollectionService: ApiDataCollectionService,
    private apiPopulationService: ApiPopulationService,
    private apiSampleService: ApiSampleService,
  ) {}

  public dc: DataCollection;
  public description: string;
  public files: SearchHits<File>;
  public sampleHits: SearchHits<Sample> = null;
  public populationHits: SearchHits<Population> = null;
  public sampleOffset: number = 0;
  public populationOffset: number = 0;
  public sampleTotalHits: number = -1;
  public populationTotalHits: number = -1;

  // private properties
  private routeSubscription: Subscription = null;
  private dataCollectionSource: Subject<Observable<DataCollection>> = null;
  private dataCollectionSubscription: Subscription = null;
  private descriptionSource: Subject<Observable<string>> = null;
  private descriptionSubscription: Subscription = null;
  private sampleListSource: Subject<Observable<SearchHits<Sample>>> = null;
  private sampleListSubscription: Subscription = null;
  private populationListSource: Subject<Observable<SearchHits<Population>>> = null;
  private populationListSubscription: Subscription = null;
  private hitsPerPage: number = 10;

  ngOnInit() {
    this.dataCollectionSource = new Subject<Observable<DataCollection>>();
    this.dataCollectionSubscription = this.dataCollectionSource
        .switchMap((o: Observable<DataCollection>) : Observable<DataCollection> => o)
        .subscribe((dc: DataCollection) => {
          this.dc = dc;
          if (dc) {
            this.titleService.setTitle( `${dc.shortTitle} | IGSR data collection`);
            this.sampleOffset = 0;
            this.populationOffset = 0;
            this.sampleTotalHits = -1;
            this.populationTotalHits = -1;
            this.searchSamples();
            this.searchPopulations();
          }
        });
    this.descriptionSource = new Subject<Observable<string>>();
    this.descriptionSubscription = this.descriptionSource
        .switchMap((o: Observable<string>) : Observable<string> => o)
        .subscribe((description: string) => this.description = description);
    this.sampleListSource = new Subject<Observable<SearchHits<Sample>>>();
    this.sampleListSubscription = this.sampleListSource
        .switchMap((o: Observable<SearchHits<Sample>>) : Observable<SearchHits<Sample>> => o)
        .subscribe((h: SearchHits<Sample>) => {
          this.sampleHits = h;
          if (h) {
            this.sampleTotalHits = h.total;
          }
        });
    this.populationListSource = new Subject<Observable<SearchHits<Population>>>();
    this.populationListSubscription = this.populationListSource
        .switchMap((o: Observable<SearchHits<Population>>) : Observable<SearchHits<Population>> => o)
        .subscribe((h: SearchHits<Population>) => {
          this.populationHits = h;
          if (h) {
            this.populationTotalHits = h.total;
          }
        });

    this.routeSubscription = this.activatedRoute.params.subscribe((params: {dataCollectionID: string}) => {
      this.titleService.setTitle( `${params.dataCollectionID} | IGSR data collection`);
      if (params.dataCollectionID) {
        this.dataCollectionSource.next(this.apiDataCollectionService.get(params.dataCollectionID));
        this.descriptionSource.next(this.apiDataCollectionService.getText(params.dataCollectionID));
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

  hasMorePopulations(): boolean {
    return this.populationTotalHits > this.populationOffset + this.hitsPerPage;
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

  populationTableNext() {
    if (this.hasMorePopulations()) {
      this.populationOffset += this.hitsPerPage;
      this.searchPopulations();
    }
  }

  populationTablePrevious() {
    if (this.populationOffset > 0) {
      this.populationOffset -= this.hitsPerPage;
      this.searchPopulations();
    }
  }

  searchSamplesExport() {
    if (this.dc) {
      this.apiSampleService.searchDataCollectionSamplesExport(this.dc.title);
    }
  }

  searchPopulationsExport() {
    if (this.dc) {
      this.apiPopulationService.searchDataCollectionPopulationsExport(this.dc.title);
    }
  }
  
  ngOnDestroy() {
    if (this.dataCollectionSubscription) {
      this.dataCollectionSubscription.unsubscribe();
    }
    if (this.descriptionSubscription) {
      this.descriptionSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.sampleListSubscription) {
      this.sampleListSubscription.unsubscribe();
    }
    if (this.populationListSubscription) {
      this.populationListSubscription.unsubscribe();
    }
  }

  private searchSamples() {
    if (this.dc && this.sampleListSource) {
      this.sampleListSource.next(this.apiSampleService.searchDataCollectionSamples(this.dc.title, this.sampleOffset, this.hitsPerPage));
    }
  }

  private searchPopulations() {
    if (this.dc && this.populationListSource) {
      this.populationListSource.next(this.apiPopulationService.searchDataCollectionPopulations(this.dc.title, this.populationOffset, this.hitsPerPage));
    }
  }

};

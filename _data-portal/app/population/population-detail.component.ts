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

  // private properties
  private routeSubscription: Subscription = null;
  private popSource: Subject<Observable<Population>> = null;
  private popSubscription: Subscription = null;

  ngOnInit() {
    this.popSource = new Subject<Observable<Population>>();
    this.popSubscription = this.popSource
        .switchMap((o: Observable<Population>) : Observable<Population> => o)
        .subscribe((p: Population) => this.pop = p);
    this.routeSubscription = this.activatedRoute.params.subscribe((params: {popCode: string}) => {
      this.popCode = params.popCode;
      this.titleService.setTitle( `${this.popCode} | IGSR population`);
      if (this.popCode) {
        this.popSource.next(this.apiPopulationService.get(this.popCode));
      }
    });
  }

  public softHyphens(url: string): string {
    return url ? url.replace(/[\/\.]/g, '$&&shy;') : url;
  }

  ngOnDestroy() {
    if (this.popSubscription) {
      this.popSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

};

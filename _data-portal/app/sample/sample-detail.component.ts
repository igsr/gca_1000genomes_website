import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiSampleService } from '../core/services/api-sample.service';
import { Sample } from '../shared/api-types/sample';

let sampleDetailStyles: string = `
.capitalize {
  text-transform: capitalize;
}
`;

@Component({
    templateUrl: './sample-detail.component.html',
    styles: [ sampleDetailStyles ],
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private apiSampleService: ApiSampleService,
  ) {}

  public sampleName: string;
  public sample: Sample;

  // private properties
  private routeSubscription: Subscription = null;
  private sampleSource: Subject<Observable<Sample>> = null;
  private sampleSubscription: Subscription = null;

  ngOnInit() {
    this.sampleSource = new Subject<Observable<Sample>>();
    this.sampleSubscription = this.sampleSource
        .switchMap((o: Observable<Sample>) : Observable<Sample> => o)
        .subscribe((s: Sample) => this.sample = s);
    this.routeSubscription = this.activatedRoute.params.subscribe((params: {sampleName: string}) => {
      this.sampleName = params.sampleName;
      this.titleService.setTitle( `${this.sampleName} | IGSR sample`);
      if (this.sampleName) {
        this.sampleSource.next(this.apiSampleService.get(this.sampleName));
      }
    });
  }

  ngOnDestroy() {
    if (this.sampleSubscription) {
      this.sampleSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

};

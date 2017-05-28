import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { DataCollection } from '../shared/api-types/data-collection';
import { SearchHits } from '../shared/api-types/search-hits';
import { File } from '../shared/api-types/file';

let dataCollectionStyles: string = `

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
  ) {}

  public dc: DataCollection;
  public description: string;
  public files: SearchHits<File>;

  // private properties
  private routeSubscription: Subscription = null;
  private dataCollectionSource: Subject<Observable<DataCollection>> = null;
  private dataCollectionSubscription: Subscription = null;
  private descriptionSource: Subject<Observable<string>> = null;
  private descriptionSubscription: Subscription = null;

  ngOnInit() {
    this.dataCollectionSource = new Subject<Observable<DataCollection>>();
    this.dataCollectionSubscription = this.dataCollectionSource
        .switchMap((o: Observable<DataCollection>) : Observable<DataCollection> => o)
        .subscribe((dc: DataCollection) => {
          this.dc = dc;
          if (dc) {
            this.titleService.setTitle( `${dc.shortTitle} | IGSR data collection`);
          }
        });
    this.descriptionSource = new Subject<Observable<string>>();
    this.descriptionSubscription = this.descriptionSource
        .switchMap((o: Observable<string>) : Observable<string> => o)
        .subscribe((description: string) => this.description = description);

    this.routeSubscription = this.activatedRoute.params.subscribe((params: {dataCollectionID: string}) => {
      this.titleService.setTitle( `${params.dataCollectionID} | IGSR data collection`);
      if (params.dataCollectionID) {
        this.dataCollectionSource.next(this.apiDataCollectionService.get(params.dataCollectionID));
        this.descriptionSource.next(this.apiDataCollectionService.getText(params.dataCollectionID));
      }
    });
  }

  public softHyphens(url: string): string {
    return url ? url.replace(/[\/\.]/g, '$&&shy;') : url;
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
  }

};

import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiFileService } from '../core/services/api-file.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { File } from '../shared/api-types/file';

let searchFilesStyles: string = `
  ul.list-group {
    margin: 0;
    max-height: 200px;
    overflow: auto;
  }
  .list-group-item {
    padding: 5px 15px;
    white-space: nowrap;
  }
`;

@Component({
    templateUrl: './search-files.component.html',
    selector: 'search-files',
    styles: [ searchFilesStyles ],
})
export class SearchFilesComponent implements OnChanges, OnDestroy {
  @Input() query: string;

  public constructor(
    private apiFileService: ApiFileService,
  ) {};

  public fileHits: SearchHits<File> = null;

  // private properties
  private fileHitsSource: Subject<Observable<SearchHits<File>>> = null;
  private fileHitsSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.fileHitsSource) {
      this.fileHitsSource = new Subject<Observable<SearchHits<File>>>();
      this.fileHitsSubscription = this.fileHitsSource
          .switchMap((o: Observable<SearchHits<File>>) : Observable<SearchHits<File>> => o)
          .subscribe((h: SearchHits<File>) => {
            this.fileHits = h
          });
    }

    this.fileHitsSource.next(this.apiFileService.textSearch(this.query, this.hitsPerPage));
  }

  ngOnDestroy() {
    if (this.fileHitsSubscription) {
      this.fileHitsSubscription.unsubscribe();
    }
  }

};

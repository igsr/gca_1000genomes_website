import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { ApiFileService } from '../core/services/api-file.service';
import { ApiPopulationService } from '../core/services/api-population.service';
import { ApiSampleService } from '../core/services/api-sample.service';
import { ApiSitemapService } from '../core/services/api-sitemap.service';
import { DataCollection } from '../shared/api-types/data-collection';
import { File } from '../shared/api-types/file';
import { Population } from '../shared/api-types/population';
import { Sample } from '../shared/api-types/sample';
import { SearchHits } from '../shared/api-types/search-hits';
import { Sitemap } from '../shared/api-types/sitemap';

let searchResultStyles: string = `
  form {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  ul.list-group {
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
  }
  a.list-group-item {
    padding: 5px 15px;
    color: #337ab7;
  }
  .file-results a.list-group-item {
    overflow-x: auto;
    white-space: nowrap;
  }
  button.download-button {
    float: right;
  }
  .panel-heading {
    overflow: auto;
  }
`;

@Component({
    templateUrl: './search-results.component.html',
    styles: [ searchResultStyles ],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiDataCollectionService: ApiDataCollectionService,
    private apiFileService: ApiFileService,
    private apiPopulationService: ApiPopulationService,
    private apiSampleService: ApiSampleService,
    private apiSitemapService: ApiSitemapService,
  ) {}

  // public properties
  public query: string;
  public sampleHits: SearchHits<Sample> = null;
  public popHits: SearchHits<Population> = null;
  public dcHits: SearchHits<DataCollection> = null;
  public fileHits: SearchHits<File> = null;
  public sitemapList: SearchHits<Sitemap> = null;

  // private properties
  private routeSubscription: Subscription = null;
  private sampleHitsSubscription: Subscription = null;
  private popHitsSubscription: Subscription = null;
  private dcHitsSubscription: Subscription = null;
  private fileHitsSubscription: Subscription = null;
  private sitemapListSubscription: Subscription = null;
  private hitsPerPage: number = 100;

  setUrl(query: string) {
    this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {q: query}})
  }

  ngOnInit() {
    this.titleService.setTitle( 'IGSR search');
    this.routeSubscription = this.activatedRoute.queryParams
      .pipe(debounceTime(300))
      .subscribe((params: {q: string}) => {
        this.query = params.q;
        this.search();
      });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.unsubscribeSearches();
  }

  public downloadFileList = (): void => {
    this.apiFileService.downloadFileList(this.query);
  }

  public joinHighlights(highlight: {content: string[]}): string {
    return highlight && highlight.content ? highlight.content.join('&#133') : '';
  }

  private search() {
    this.unsubscribeSearches();
    if (!this.query) {
      this.sampleHits = null;
      this.popHits = null;
      this.dcHits = null;
      this.fileHits = null;
      this.sitemapList = null;
      return;
    }
    this.sampleHitsSubscription = this.apiSampleService.textSearch(this.query, this.hitsPerPage)
      .subscribe((h: SearchHits<Sample>) => this.sampleHits = h);
    this.popHitsSubscription = this.apiPopulationService.textSearch(this.query, this.hitsPerPage)
      .subscribe((h: SearchHits<Population>) => this.popHits = h);
    this.dcHitsSubscription = this.apiDataCollectionService.textSearch(this.query, this.hitsPerPage)
      .subscribe((h: SearchHits<DataCollection>) => this.dcHits = h);
    this.fileHitsSubscription = this.apiFileService.textSearch(this.query, this.hitsPerPage)
      .subscribe((h: SearchHits<File>) => this.fileHits = h);
    this.sitemapListSubscription = this.apiSitemapService.textSearch(this.query)
      .subscribe((h: SearchHits<Sitemap>) => this.sitemapList = h);
  }

  private unsubscribeSearches() {
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
      this.sampleHitsSubscription = null;
    }
    if (this.popHitsSubscription) {
      this.popHitsSubscription.unsubscribe();
      this.popHitsSubscription = null;
    }
    if (this.dcHitsSubscription) {
      this.dcHitsSubscription.unsubscribe();
      this.dcHitsSubscription = null;
    }
    if (this.fileHitsSubscription) {
      this.fileHitsSubscription.unsubscribe();
      this.fileHitsSubscription = null;
    }
    if (this.sitemapListSubscription) {
      this.sitemapListSubscription.unsubscribe();
      this.sitemapListSubscription = null;
    }
  }
};

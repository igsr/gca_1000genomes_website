import { Component, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiSitemapService } from '../core/services/api-sitemap.service';
import { SitemapList } from '../shared/api-types/sitemap';

@Component({
    templateUrl: './search-sitemap.component.html',
    selector: 'search-sitemap',
})
export class SearchSitemapComponent implements OnChanges, OnDestroy {
  @Input() query: string;

  public constructor(
    private apiSitemapService: ApiSitemapService,
  ) {};

  public sitemapList: SitemapList = null;

  // private properties
  private sitemapListSource: Subject<Observable<SitemapList>> = null;
  private sitemapListSubscription: Subscription = null;

  ngOnChanges(changes: SimpleChanges) {

    if (!this.sitemapListSource) {
      this.sitemapListSource = new Subject<Observable<SitemapList>>();
      this.sitemapListSubscription = this.sitemapListSource
          .switchMap((o: Observable<SitemapList>) : Observable<SitemapList> => o)
          .subscribe((h: SitemapList) => this.sitemapList = h );
    }

    this.sitemapListSource.next(this.apiSitemapService.textSearch(this.query));
  }

  ngOnDestroy() {
    if (this.sitemapListSubscription) {
      this.sitemapListSubscription.unsubscribe();
    }
  }

  public joinHighlights(highlight: {content: string[]}): string {
    return highlight && highlight.content ? highlight.content.join('&#133') : '';
  }

};

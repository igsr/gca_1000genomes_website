import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiSampleService } from '../core/services/api-sample.service';
import { ApiAnalysisGroupService } from '../core/services/api-analysis-group.service';
import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { ApiPopulationService } from '../core/services/api-population.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { Sample } from '../shared/api-types/sample';
import { buildReadableFilterSummary as buildReadableFilterSummaryFromRpn } from '../shared/filter-builder-summary';
import { FilterBuilderBase, FilterTokenBase } from '../shared/filter-builder-base';
import { filterBuilderStyles } from '../shared/filter-builder.styles';

interface FilterToken extends FilterTokenBase<'pop' | 'dc' | 'ag'> {}

let sampleHomeStyles: string = filterBuilderStyles;

@Component({
    templateUrl: './sample-home.component.html',
    styles: [ sampleHomeStyles ],
})
export class SampleHomeComponent extends FilterBuilderBase<'pop' | 'dc' | 'ag', FilterToken> implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private apiSampleService: ApiSampleService,
    apiAnalysisGroupService: ApiAnalysisGroupService,
    apiDataCollectionService: ApiDataCollectionService,
    apiPopulationService: ApiPopulationService,
  ) {
    super();
    this.agTitleMap = apiAnalysisGroupService.titleMap;
    this.dcTitleMap = apiDataCollectionService.titleMap;
    this.popElasticIdDescriptionMap = apiPopulationService.elasticIdDescriptionMap;
  }

  public sampleHits: SearchHits<Sample>;
  public totalHits: number = -1;
  public displayStart: number = -1;
  public displayStop: number = -1;
  public offset: number = 0;
  public viewOption: number = 1;

  public popFilterVisible: boolean = false;
  public popFilters: {[code: string]: boolean} = {};
  public popFiltersArr: string[] = [];
  readonly popElasticIdDescriptionMap: {[key: string]: string};

  public agFilterVisible: boolean = false;
  public agFilters: {[code: string]: boolean} = {};
  public agFiltersArr: string[] = [];
  readonly agTitleMap: {[key: string]: string};

  public dcFilterVisible: boolean = false;
  public dcFilters: {[code: string]: boolean} = {};
  public dcFiltersArr: string[] = [];
  readonly dcTitleMap: {[key: string]: string};

  public readableFilterSummary: string = '';

  private sampleHitsSource: Subject<Observable<SearchHits<Sample>>>;
  private sampleHitsSubscription: Subscription = null;
  private hitsPerPage: number = 10;

  ngOnInit() {
    this.titleService.setTitle('IGSR | samples');
    this.sampleHitsSource = new Subject<Observable<SearchHits<Sample>>>();
    this.sampleHitsSubscription = this.sampleHitsSource
      .switchMap((o: Observable<SearchHits<Sample>>): Observable<SearchHits<Sample>> => o)
      .subscribe((h: SearchHits<Sample>) => {
          this.sampleHits = h;
          if (h) {
            this.totalHits = h.total;
            this.displayStart = h.hits && h.hits.length > 0 ? this.offset + 1 : 0;
            this.displayStop = h.hits ? this.offset + h.hits.length : 0;
          }
        });
    this.search();
  }

  ngOnDestroy() {
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
    }
  }

  hasMore(): boolean {
    return this.totalHits > this.offset + this.hitsPerPage;
  }

  tableNext() {
    if (this.hasMore()) {
      this.offset += this.hitsPerPage;
      this.search();
    }
  }

  tablePrevious() {
    if (this.offset > 1) {
      this.offset -= this.hitsPerPage;
      this.search();
    }
  }

  dataCollectionView() {
    this.viewOption = 1;
  }

  technologyView() {
    this.viewOption = 2;
  }

  onPopFiltersChange(popFilters: {[code: string]: boolean}) {
    this.offset = 0;
    this.totalHits = -1;
    let nextKeys = this.extractSelectedKeys(popFilters);
    this.updateTokenOrder('pop', this.popFiltersArr, nextKeys);
    this.popFiltersArr = nextKeys;
    this.search();
  }

  onAgFiltersChange(agFilters: {[code: string]: boolean}) {
    this.offset = 0;
    this.totalHits = -1;
    let nextKeys = this.extractSelectedKeys(agFilters);
    this.updateTokenOrder('ag', this.agFiltersArr, nextKeys);
    this.agFiltersArr = nextKeys;
    this.search();
  }

  onDcFiltersChange(dcFilters: {[code: string]: boolean}) {
    this.offset = 0;
    this.totalHits = -1;
    let nextKeys = this.extractSelectedKeys(dcFilters);
    this.updateTokenOrder('dc', this.dcFiltersArr, nextKeys);
    this.dcFiltersArr = nextKeys;
    this.search();
  }

  toggleChainOperator(index: number) {
    super.toggleChainOperator(index);
    this.search();
  }

  groupSelection() {
    super.groupSelection();
    this.search();
  }

  ungroupSelection() {
    super.ungroupSelection();
    this.search();
  }

  toggleNegationForSelection() {
    super.toggleNegationForSelection();
    this.search();
  }

  search() {
    this.readableFilterSummary = this.buildReadableFilterSummary();
    this.sampleHitsSource.next(this.apiSampleService.search(this.hitsPerPage, this.offset, this.buildFilterQuery()));
  }

  searchExport() {
    this.apiSampleService.searchExport(this.buildFilterQuery(), 'igsr_samples');
  }

  removeTokenFromFilters(token: FilterToken) {
    if (token.type === 'pop') {
      this.popFilters[token.key] = false;
      this.onPopFiltersChange(this.popFilters);
      return;
    }
    if (token.type === 'dc') {
      this.dcFilters[token.key] = false;
      this.onDcFiltersChange(this.dcFilters);
      return;
    }
    this.agFilters[token.key] = false;
    this.onAgFiltersChange(this.agFilters);
  }

  protected createToken(type: 'pop' | 'dc' | 'ag', key: string, id: string): FilterToken {
    return { id, type, key, negated: false };
  }

  private buildFilterQuery() {
    return super.buildQuery((token: FilterToken) => this.buildTokenClause(token));
  }

  private buildReadableFilterSummary(): string {
    if (this.filterTokens.length === 0) {
      return '';
    }
    return buildReadableFilterSummaryFromRpn(this.buildRpnTokens(), {
      entityLabel: 'samples',
      getFilterTypeLabel: (type: string) => this.getFilterTypeLabel(type),
      getFilterTypePluralLabel: (type: string) => this.getFilterTypePluralLabel(type),
      getTokenDisplayLabel: (token: FilterToken) => this.getTokenDisplayLabel(token),
    });
  }

  private getFilterTypeLabel(type: string): string {
    if (type === 'pop') {
      return 'population';
    }
    if (type === 'dc') {
      return 'data collection';
    }
    return 'technology';
  }

  private getFilterTypePluralLabel(type: string): string {
    if (type === 'pop') {
      return 'populations';
    }
    if (type === 'dc') {
      return 'data collections';
    }
    return 'technologies';
  }

  private getTokenDisplayLabel(token: FilterToken): string {
    if (token.type === 'pop') {
      return this.popElasticIdDescriptionMap[token.key] || token.key;
    }
    if (token.type === 'dc') {
      return this.dcTitleMap[token.key] || token.key;
    }
    return this.agTitleMap[token.key] || token.key;
  }

  private buildTokenClause(token: FilterToken): any {
    if (token.type === 'pop') {
      if (token.negated) {
        return { bool: { must_not: [{ term: { 'populations.elasticId': token.key } }] } };
      }
      return { term: { 'populations.elasticId': token.key } };
    }
    if (token.type === 'dc') {
      if (token.negated) {
        return { bool: { must_not: [{ term: { 'dataCollections.title': token.key } }] } };
      }
      return { term: { 'dataCollections.title': token.key } };
    }
    if (token.negated) {
      return { bool: { must_not: [{ term: { 'dataCollections._analysisGroups': token.key } }] } };
    }
    return { term: { 'dataCollections._analysisGroups': token.key } };
  }
}

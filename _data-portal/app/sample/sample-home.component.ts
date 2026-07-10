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
import { AnalysisGroup } from '../shared/api-types/analysis-group';
import { DataCollection } from '../shared/api-types/data-collection';
import { SearchHit, SearchHits } from '../shared/api-types/search-hits';
import { Sample } from '../shared/api-types/sample';
import { buildReadableFilterSummary as buildReadableFilterSummaryFromRpn } from '../shared/filter-builder-summary';
import { FilterBuilderBase, FilterSelectionChange, FilterTokenBase } from '../shared/filter-builder-base';
import { filterBuilderStyles } from '../shared/filter-builder.styles';

interface FilterToken extends FilterTokenBase<'pop' | 'dc' | 'ag'> {}

let sampleHomeStyles: string = filterBuilderStyles;
sampleHomeStyles += `

.capitalize {
  text-transform: capitalize;
}

table {
  margin-top: 70px;
}

div.matrix-dot {
  text-align: center;
  font-size: 20px;
  cursor: default;
}

th.matrix-dot {
  width: 70px;
  white-space: nowrap;
  padding: 0;
}

th.matrix-dot > div {
  transform: translate(100%, 0) rotate(315deg);
  transform-origin: left bottom;
  width: inherit;
}

th.matrix-dot > div > div {
  border-bottom: 1px solid #ccc;
  width: 125px;
  height: 49px;
  line-height: 49px;
  cursor: pointer;
}

.data-collection-dot {
  color: #DAA406;
}

.analysis-group-dot {
  color: #79C7E7;
}

@media (max-width: 991px) {
  table {
    margin-top: 80px;
  }
  th.matrix-dot > div {
    transform: translate(100%, 0) rotate(270deg);
  }
  th.matrix-dot {
    width: 55px;
  }
  th.matrix-dot > div > div {
    height: 55px;
    line-height: 55px;
    text-indent: 5px;
  }
}
`;

@Component({
    templateUrl: './sample-home.component.html',
    styles: [ sampleHomeStyles ],
})
export class SampleHomeComponent extends FilterBuilderBase<'pop' | 'dc' | 'ag', FilterToken> implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private apiSampleService: ApiSampleService,
    private apiAnalysisGroupService: ApiAnalysisGroupService,
    private apiDataCollectionService: ApiDataCollectionService,
    apiPopulationService: ApiPopulationService,
  ) {
    super();
    this.agTitleMap = this.apiAnalysisGroupService.titleMap;
    this.dcTitleMap = this.apiDataCollectionService.titleMap;
    this.popElasticIdDescriptionMap = apiPopulationService.elasticIdDescriptionMap;
  }

  public sampleHits: SearchHits<Sample>;
  public dataCollectionList: SearchHits<DataCollection>;
  public analysisGroupList: SearchHits<AnalysisGroup>;
  public totalHits: number = -1;
  public displayStart: number = -1;
  public displayStop: number = -1;
  public offset: number = 0;
  public viewOption: number = 1;
  public filterBuilderCollapsed: boolean = true;

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
  private dataCollectionSubscription: Subscription = null;
  private analysisGroupSubscription: Subscription = null;
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
    this.dataCollectionSubscription = this.apiDataCollectionService.getAll()
      .subscribe((l: SearchHits<DataCollection>) => this.dataCollectionList = l);
    this.analysisGroupSubscription = this.apiAnalysisGroupService.getAll()
      .subscribe((l: SearchHits<AnalysisGroup>) => this.analysisGroupList = l);
    this.search();
  }

  ngOnDestroy() {
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
    }
    if (this.dataCollectionSubscription) {
      this.dataCollectionSubscription.unsubscribe();
    }
    if (this.analysisGroupSubscription) {
      this.analysisGroupSubscription.unsubscribe();
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

  onPopFiltersChange(change: FilterSelectionChange) {
    this.offset = 0;
    this.totalHits = -1;
    let nextKeys = this.buildSelectedKeysFromChange(this.popFiltersArr, change);
    this.updateTokenOrder('pop', this.popFiltersArr, nextKeys);
    this.popFilters = change.filters;
    this.popFiltersArr = nextKeys;
    this.filterBuilderCollapsed = this.filterTokens.length === 0;
    this.search();
  }

  onAgFiltersChange(change: FilterSelectionChange) {
    this.offset = 0;
    this.totalHits = -1;
    let nextKeys = this.buildSelectedKeysFromChange(this.agFiltersArr, change);
    this.updateTokenOrder('ag', this.agFiltersArr, nextKeys);
    this.agFilters = change.filters;
    this.agFiltersArr = nextKeys;
    this.filterBuilderCollapsed = this.filterTokens.length === 0;
    this.search();
  }

  onDcFiltersChange(change: FilterSelectionChange) {
    this.offset = 0;
    this.totalHits = -1;
    let nextKeys = this.buildSelectedKeysFromChange(this.dcFiltersArr, change);
    this.updateTokenOrder('dc', this.dcFiltersArr, nextKeys);
    this.dcFilters = change.filters;
    this.dcFiltersArr = nextKeys;
    this.filterBuilderCollapsed = this.filterTokens.length === 0;
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

  toggleDcFilter(code: string) {
    this.dcFilters[code] = !this.dcFilters[code];
    this.onDcFiltersChange({ filters: this.dcFilters, code, isFiltered: this.dcFilters[code] });
  }

  toggleAgFilter(code: string) {
    this.agFilters[code] = !this.agFilters[code];
    this.onAgFiltersChange({ filters: this.agFilters, code, isFiltered: this.agFilters[code] });
  }

  public hasDataCollection(sample: Sample, dc: DataCollection): boolean {
    if (!sample.dataCollections) {
      return false;
    }
    for (let sampleDc of sample.dataCollections) {
      if (sampleDc.title === dc.title) {
        return true;
      }
    }
    return false;
  }

  public hasAnalysisGroup(sampleHit: SearchHit<Sample>, ag: AnalysisGroup): boolean {
    if (sampleHit.fields && sampleHit.fields.hasOwnProperty('dataCollections._analysisGroups')) {
      for (let agTitle of sampleHit.fields['dataCollections._analysisGroups']) {
        if (agTitle === ag.title) {
          return true;
        }
      }
    }
    return false;
  }

  removeTokenFromFilters(token: FilterToken) {
    if (token.type === 'pop') {
      this.popFilters[token.key] = false;
      this.onPopFiltersChange({ filters: this.popFilters, code: token.key, isFiltered: false });
      return;
    }
    if (token.type === 'dc') {
      this.dcFilters[token.key] = false;
      this.onDcFiltersChange({ filters: this.dcFilters, code: token.key, isFiltered: false });
      return;
    }
    this.agFilters[token.key] = false;
    this.onAgFiltersChange({ filters: this.agFilters, code: token.key, isFiltered: false });
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

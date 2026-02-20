import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiPopulationService } from '../core/services/api-population.service';
import { ApiAnalysisGroupService } from '../core/services/api-analysis-group.service';
import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';
import { buildReadableFilterSummary as buildReadableFilterSummaryFromRpn } from '../shared/filter-builder-summary';
import { FilterBuilderBase, FilterTokenBase } from '../shared/filter-builder-base';
import { filterBuilderStyles } from '../shared/filter-builder.styles';

interface FilterToken extends FilterTokenBase<'dc' | 'ag'> {}

let populationHomeStyles: string = filterBuilderStyles;

@Component({
    templateUrl: './population-home.component.html',
    styles: [ populationHomeStyles ],
})
export class PopulationHomeComponent extends FilterBuilderBase<'dc' | 'ag', FilterToken> implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private apiPopulationService: ApiPopulationService,
    apiAnalysisGroupService: ApiAnalysisGroupService,
    apiDataCollectionService: ApiDataCollectionService,
  ) {
    super();
    this.agTitleMap = apiAnalysisGroupService.titleMap;
    this.dcTitleMap = apiDataCollectionService.titleMap;
  }

  public populationHits: SearchHits<Population>;
  public viewOption: number = 0;

  public agFilterVisible: boolean = false;
  public agFilters: {[code: string]: boolean} = {};
  public agFiltersArr: string[] = [];
  readonly agTitleMap: {[key: string]: string};

  public dcFilterVisible: boolean = false;
  public dcFilters: {[code: string]: boolean} = {};
  public dcFiltersArr: string[] = [];
  readonly dcTitleMap: {[key: string]: string};

  public readableFilterSummary: string = '';
  public mapKeyVisible: boolean = false;

  private populationHitsSource: Subject<Observable<SearchHits<Population>>>;
  private populationHitsSubscription: Subscription = null;

  ngOnInit() {
    this.titleService.setTitle('IGSR | populations');
    this.populationHitsSource = new Subject<Observable<SearchHits<Population>>>();
    this.populationHitsSubscription = this.populationHitsSource
      .switchMap((o: Observable<SearchHits<Population>>): Observable<SearchHits<Population>> => o)
      .subscribe((h: SearchHits<Population>) => this.populationHits = h);
    this.search();
  }

  ngOnDestroy() {
    if (this.populationHitsSubscription) {
      this.populationHitsSubscription.unsubscribe();
    }
  }

  mapView() {
    this.viewOption = 0;
  }

  dataCollectionView() {
    this.viewOption = 1;
  }

  technologyView() {
    this.viewOption = 2;
  }

  onAgFiltersChange(agFilters: {[code: string]: boolean}) {
    let nextKeys = this.extractSelectedKeys(agFilters);
    this.updateTokenOrder('ag', this.agFiltersArr, nextKeys);
    this.agFiltersArr = nextKeys;
    this.search();
  }

  onDcFiltersChange(dcFilters: {[code: string]: boolean}) {
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
    this.populationHitsSource.next(this.apiPopulationService.search(-1, 0, this.buildFilterQuery()));
  }

  searchExport() {
    this.apiPopulationService.searchExport(this.buildFilterQuery(), 'igsr_populations');
  }

  removeTokenFromFilters(token: FilterToken) {
    if (token.type === 'dc') {
      this.dcFilters[token.key] = false;
      this.onDcFiltersChange(this.dcFilters);
      return;
    }
    this.agFilters[token.key] = false;
    this.onAgFiltersChange(this.agFilters);
  }

  protected createToken(type: 'dc' | 'ag', key: string, id: string): FilterToken {
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
      entityLabel: 'populations',
      getFilterTypeLabel: (type: string) => this.getFilterTypeLabel(type),
      getFilterTypePluralLabel: (type: string) => this.getFilterTypePluralLabel(type),
      getTokenDisplayLabel: (token: FilterToken) => this.getTokenDisplayLabel(token),
    });
  }

  private getFilterTypeLabel(type: string): string {
    if (type === 'dc') {
      return 'data collection';
    }
    return 'technology';
  }

  private getFilterTypePluralLabel(type: string): string {
    if (type === 'dc') {
      return 'data collections';
    }
    return 'technologies';
  }

  private getTokenDisplayLabel(token: FilterToken): string {
    if (token.type === 'dc') {
      return this.dcTitleMap[token.key] || token.key;
    }
    return this.agTitleMap[token.key] || token.key;
  }

  private buildTokenClause(token: FilterToken): any {
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

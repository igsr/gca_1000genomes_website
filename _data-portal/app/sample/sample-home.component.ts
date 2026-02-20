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
import { buildReadableFilterSummary as buildReadableFilterSummaryFromRpn } from '../shared/filter-summary';
import { FilterBuilderBase, FilterTokenBase } from '../shared/filter-builder-base';

interface FilterToken extends FilterTokenBase<'pop' | 'dc' | 'ag'> {}

let sampleHomeStyles: string = `

div.table-container {
  padding-right: 90px;
  position: relative;
  overflow-y: auto;
}

h3.current-filters {
  display: inline-block;
}

.filter-selected {
  outline: 3px solid #1f2937;
  box-shadow: 0 0 0 2px rgba(31, 41, 55, 0.25);
}

.group-controls {
  margin-left: 0;
}

.tools-row {
  margin-bottom: 8px;
}

.filter-builder-panel {
  margin-top: 12px;
  border-color: #d9d9d9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.filter-builder-panel .panel-body {
  background-color: #fafafa;
}

h3.current-filters.section-indicator {
  background-color: #f4f4f4;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  color: #505050;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  margin: 0 10px 0 0;
  min-width: 92px;
  padding: 6px 10px;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
}

.filter-builder-help {
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 18px;
}

.filter-builder-steps {
  margin: 6px 0 0 24px;
  padding-left: 18px;
}

.filter-builder-steps li {
  margin-bottom: 10px;
}

.filter-builder-steps li:last-child {
  margin-bottom: 0;
}

.filter-builder-steps li strong {
  color: #444;
  display: block;
  font-weight: 700;
  margin-bottom: 2px;
}

.filter-builder-steps li code {
  background-color: #ececec;
  border-radius: 3px;
  padding: 0 3px;
}

.group-control-btn {
  min-width: 70px;
  text-align: center;
}

.group-paren {
  font-weight: 800;
  font-size: 20px;
  margin: 0 6px;
  color: #222;
}

p.readable-filter-summary {
  display: inline-block;
  margin: 0;
  color: #6b7280;
  font-size: 15px;
  font-style: italic;
  vertical-align: middle;
}

p.readable-filter-summary strong {
  font-style: normal;
  font-weight: 700;
}

.filter-builder-help p {
  margin: 0;
}

.query-description-block {
  margin-top: 10px;
  margin-bottom: 12px;
}

@media (max-width: 991px) {
  div.table-container {
    width: 100%;
    overflow-x: scroll;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    -webkit-overflow-scrolling: touch;
    padding-right: 0px;
  }
}
div.table-buttons {
  position: absolute;
  top: 0;
}
div.table-buttons h4 {
  margin: 10px 0px;
}

button.page-button {
  border: 1px solid #ddd;
  border-radius: 15px;
  margin: 0px 0px 10px;
}

button.operator-chip {
  border-radius: 12px;
  font-weight: bold;
  margin: 0 6px;
  padding: 3px 10px;
}

.filter-negated {
  overflow: hidden;
  padding-left: 50px;
  position: relative;
}

.chip-negation-flag {
  align-items: center;
  background-color: #c9302c;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  bottom: 0;
  color: #fff;
  display: flex;
  font-size: 10px;
  font-weight: bold;
  justify-content: center;
  letter-spacing: 0.25px;
  left: 0;
  line-height: 1;
  position: absolute;
  top: 0;
  width: 42px;
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

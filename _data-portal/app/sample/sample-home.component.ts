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

interface FilterToken {
  id: string;
  type: 'pop' | 'dc' | 'ag';
  key: string;
  negated: boolean;
}

interface FilterExpressionNode {
  type: 'term' | 'op';
  token?: FilterToken;
  op?: 'AND' | 'OR';
  left?: FilterExpressionNode;
  right?: FilterExpressionNode;
}

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
  margin-left: 10px;
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
  padding: 6px 10px;
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
  margin-bottom: 4px;
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
  margin: 0 0 0 10px;
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
export class SampleHomeComponent implements OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private apiSampleService: ApiSampleService,
    apiAnalysisGroupService: ApiAnalysisGroupService,
    apiDataCollectionService: ApiDataCollectionService,
		apiPopulationService: ApiPopulationService,
  ) { 
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

  public filterTokens: FilterToken[] = [];
  public filterOperators: string[] = [];
  public selectedTokenIds: {[id: string]: boolean} = {};
  public groups: {id: number, tokenIds: string[]}[] = [];
  public groupStartIds: {[id: string]: boolean} = {};
  public groupEndIds: {[id: string]: boolean} = {};
  public groupedTokenIds: {[id: string]: boolean} = {};
  public autoGroupStartCount: {[id: string]: number} = {};
  public autoGroupEndCount: {[id: string]: number} = {};
  public readableFilterSummary: string = '';
  private groupIdCounter: number = 0;
  
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
        })
    this.search();
  }
  ngOnDestroy() {
    if (this.sampleHitsSubscription) {
      this.sampleHitsSubscription.unsubscribe();
    }
  }

  hasMore(): boolean {
    if (this.totalHits > this.offset + this.hitsPerPage) {
      return true;
    }
    return false;
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
    if (index < 0 || index >= this.filterOperators.length) {
      return;
    }
    this.filterOperators[index] = this.filterOperators[index] === 'AND' ? 'OR' : 'AND';
    if (this.allOperatorsSame()) {
      this.groups = [];
    }
    this.rebuildGroupMarkers();
    this.search();
  }

  search() {
    this.readableFilterSummary = this.buildReadableFilterSummary();
    this.sampleHitsSource.next( this.apiSampleService.search(this.hitsPerPage, this.offset, this.buildQuery()));
  }
  searchExport() {
    this.apiSampleService.searchExport(this.buildQuery(), 'igsr_samples');
  }

  private buildQuery() {
    if (this.filterTokens.length == 0) {
      return null;
    }
    let rpn = this.buildRpnTokens();
    let combined = this.evalRpn(rpn);
    return combined ? { constant_score: { filter: combined } } : null;
  }

  private buildReadableFilterSummary(): string {
    if (this.filterTokens.length === 0) {
      return '';
    }
    let expression = this.buildExpressionTree(this.buildRpnTokens());
    if (!expression) {
      return '';
    }
    let includeExcludeSummary = this.tryBuildIncludeExcludeSummary(expression);
    if (includeExcludeSummary) {
      return `Showing samples ${includeExcludeSummary}.`;
    }
    let positiveAndSummary = this.tryBuildPositiveAndSummary(expression);
    if (positiveAndSummary) {
      return `Showing samples ${positiveAndSummary}.`;
    }
    let positiveOrSummary = this.tryBuildPositiveOrSummary(expression);
    if (positiveOrSummary) {
      return `Showing samples ${positiveOrSummary}.`;
    }
    let exclusionOnlySummary = this.tryBuildExclusionOnlySummary(expression);
    if (exclusionOnlySummary) {
      return `Showing samples ${exclusionOnlySummary}.`;
    }
    let oneOfEachSummary = this.tryBuildOneOfEachSummary(expression);
    if (oneOfEachSummary) {
      return `Showing samples ${oneOfEachSummary}.`;
    }
    let eitherOrBothSummary = this.tryBuildEitherOrBothSummary(expression);
    if (eitherOrBothSummary) {
      return `Showing samples ${eitherOrBothSummary}.`;
    }
    let withWhereSummary = this.tryBuildWithWhereSummary(expression);
    if (withWhereSummary) {
      return `Showing samples ${withWhereSummary}.`;
    }
    return `Showing samples where ${this.describeExpression(expression, true)}.`;
  }

  private tryBuildPositiveAndSummary(expression: FilterExpressionNode): string {
    let terms = this.getPositiveTermsForOperatorExpression(expression, 'AND');
    if (!terms) {
      return '';
    }
    return `from ${this.describeTypedValues(terms, 'and')}`;
  }

  private tryBuildPositiveOrSummary(expression: FilterExpressionNode): string {
    let terms = this.getPositiveTermsForOperatorExpression(expression, 'OR');
    if (!terms) {
      return '';
    }
    return `matching any of ${this.describeTypedValues(terms, 'or')}`;
  }

  private tryBuildExclusionOnlySummary(expression: FilterExpressionNode): string {
    let negatedTerms = this.getNegativeTermsForAndExpression(expression);
    if (!negatedTerms) {
      return '';
    }
    return `excluding ${this.describeTypedValues(negatedTerms, 'and')}`;
  }

  private tryBuildOneOfEachSummary(expression: FilterExpressionNode): string {
    if (!expression || expression.type !== 'op' || expression.op !== 'AND') {
      return '';
    }
    let leftTerms = this.getPositiveTermsForOperatorExpression(expression.left, 'OR');
    let rightTerms = this.getPositiveTermsForOperatorExpression(expression.right, 'OR');
    if (!leftTerms || !rightTerms) {
      return '';
    }
    return `matching ${this.describeOneOfChoices(leftTerms)} and ${this.describeOneOfChoices(rightTerms)}`;
  }

  private buildExpressionTree(tokens: any[]): FilterExpressionNode {
    let stack: FilterExpressionNode[] = [];
    for (let tok of tokens) {
      if (tok.type === 'term') {
        stack.push({type: 'term', token: tok.token});
        continue;
      }
      if (tok.type === 'op') {
        if (stack.length < 2) {
          return null;
        }
        let right = stack.pop();
        let left = stack.pop();
        stack.push({type: 'op', op: tok.op, left, right});
      }
    }
    return stack.length === 1 ? stack[0] : null;
  }

  private tryBuildIncludeExcludeSummary(expression: FilterExpressionNode): string {
    let conjuncts = this.flattenByOperator(expression, 'AND');
    if (conjuncts.length < 2) {
      return '';
    }
    let positiveConjuncts: FilterExpressionNode[] = [];
    let negativeTerms: FilterToken[] = [];
    for (let conjunct of conjuncts) {
      if (this.isSimpleNegatedTerm(conjunct)) {
        negativeTerms.push(conjunct.token);
        continue;
      }
      if (this.containsNegation(conjunct)) {
        return '';
      }
      positiveConjuncts.push(conjunct);
    }
    if (positiveConjuncts.length === 0 || negativeTerms.length === 0) {
      return '';
    }
    let includeTree = this.combineNodesWithAnd(positiveConjuncts);
    if (!includeTree) {
      return '';
    }
    let includeText = this.buildIncludeSummaryText(includeTree);
    let excludeText = this.describeTypedValues(negativeTerms, 'and');
    return `${includeText}, then excluding ${excludeText}`;
  }

  private buildIncludeSummaryText(includeTree: FilterExpressionNode): string {
    let pureOrTerms = this.getPositiveTermsForOperatorExpression(includeTree, 'OR');
    if (pureOrTerms) {
      return `matching any of ${this.describeTypedValues(pureOrTerms, 'or')}`;
    }
    return `from ${this.describeFromExpression(includeTree, true)}`;
  }

  private tryBuildWithWhereSummary(expression: FilterExpressionNode): string {
    if (!expression || expression.type !== 'op' || expression.op !== 'AND') {
      return '';
    }
    let leftHasOr = this.containsOperator(expression.left, 'OR');
    let rightHasOr = this.containsOperator(expression.right, 'OR');
    if (leftHasOr === rightHasOr) {
      return '';
    }
    let groupedSide = leftHasOr ? expression.left : expression.right;
    let baseSide = leftHasOr ? expression.right : expression.left;
    if (this.containsNegation(baseSide)) {
      return '';
    }
    return `with ${this.describeFromExpression(baseSide, true)}, where ${this.describeExpression(groupedSide, true)}`;
  }

  private tryBuildEitherOrBothSummary(expression: FilterExpressionNode): string {
    if (!expression || expression.type !== 'op' || expression.op !== 'OR') {
      return '';
    }
    let leftIsAndGroup = !!(expression.left && expression.left.type === 'op' && expression.left.op === 'AND');
    let rightIsAndGroup = !!(expression.right && expression.right.type === 'op' && expression.right.op === 'AND');
    if (leftIsAndGroup === rightIsAndGroup) {
      return '';
    }
    let andGroup = leftIsAndGroup ? expression.left : expression.right;
    let singleSide = leftIsAndGroup ? expression.right : expression.left;
    let singleText = this.containsNegation(singleSide)
      ? this.describeExpression(singleSide, true)
      : this.describeFromExpression(singleSide, true);
    return `matching either ${singleText} or ${this.describeBothExpression(andGroup)}`;
  }

  private combineNodesWithAnd(nodes: FilterExpressionNode[]): FilterExpressionNode {
    if (nodes.length === 0) {
      return null;
    }
    let combined = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
      combined = {type: 'op', op: 'AND', left: combined, right: nodes[i]};
    }
    return combined;
  }

  private flattenByOperator(node: FilterExpressionNode, operator: 'AND' | 'OR'): FilterExpressionNode[] {
    if (!node || node.type !== 'op' || node.op !== operator) {
      return [node];
    }
    return this.flattenByOperator(node.left, operator).concat(this.flattenByOperator(node.right, operator));
  }

  private getPositiveTermsForOperatorExpression(node: FilterExpressionNode, operator: 'AND' | 'OR'): FilterToken[] {
    if (!node) {
      return null;
    }
    let parts = this.flattenByOperator(node, operator);
    if (parts.length < 2) {
      return null;
    }
    let tokens: FilterToken[] = [];
    for (let part of parts) {
      if (!part || part.type !== 'term' || !part.token || part.token.negated) {
        return null;
      }
      tokens.push(part.token);
    }
    return tokens;
  }

  private getNegativeTermsForAndExpression(node: FilterExpressionNode): FilterToken[] {
    if (!node) {
      return null;
    }
    let parts = this.flattenByOperator(node, 'AND');
    if (parts.length === 0) {
      return null;
    }
    let tokens: FilterToken[] = [];
    for (let part of parts) {
      if (!this.isSimpleNegatedTerm(part)) {
        return null;
      }
      tokens.push(part.token);
    }
    return tokens;
  }

  private isSimpleNegatedTerm(node: FilterExpressionNode): boolean {
    return !!(node && node.type === 'term' && node.token && node.token.negated);
  }

  private containsNegation(node: FilterExpressionNode): boolean {
    if (!node) {
      return false;
    }
    if (node.type === 'term') {
      return !!(node.token && node.token.negated);
    }
    return this.containsNegation(node.left) || this.containsNegation(node.right);
  }

  private containsOperator(node: FilterExpressionNode, operator: 'AND' | 'OR'): boolean {
    if (!node || node.type !== 'op') {
      return false;
    }
    if (node.op === operator) {
      return true;
    }
    return this.containsOperator(node.left, operator) || this.containsOperator(node.right, operator);
  }

  private describeBothExpression(node: FilterExpressionNode): string {
    let parts = this.flattenByOperator(node, 'AND');
    if (parts.length >= 2 && parts.every((part: FilterExpressionNode) => part && part.type === 'term' && part.token && !part.token.negated)) {
      return `both ${this.describeTypedValues(parts.map((part: FilterExpressionNode) => part.token), 'and')}`;
    }
    return `both ${this.describeExpression(node, true)}`;
  }

  private describeExpression(node: FilterExpressionNode, isTopLevel: boolean): string {
    if (!node) {
      return '';
    }
    if (node.type === 'term') {
      let token = node.token;
      return this.describeTokenComparison(token);
    }
    let leftText = this.describeExpression(node.left, false);
    let rightText = this.describeExpression(node.right, false);
    let text: string;
    if (node.op === 'OR') {
      text = isTopLevel ? `${leftText} or ${rightText}` : `either ${leftText} or ${rightText}`;
    } else {
      text = `${leftText} and ${rightText}`;
    }
    return isTopLevel ? text : `(${text})`;
  }

  private describeFromExpression(node: FilterExpressionNode, isTopLevel: boolean): string {
    if (!node) {
      return '';
    }
    if (node.type === 'term') {
      let token = node.token;
      let typeLabel = this.formatStrong(this.escapeHtml(this.getFilterTypeLabel(token.type)));
      let valueLabel = this.formatStrong(this.quoteValue(this.getTokenDisplayLabel(token)));
      if (token.negated) {
        return `${typeLabel} not ${valueLabel}`;
      }
      return `${typeLabel} ${valueLabel}`;
    }
    let operatorText = node.op === 'OR' ? ' or ' : ' and ';
    let text = `${this.describeFromExpression(node.left, false)}${operatorText}${this.describeFromExpression(node.right, false)}`;
    return isTopLevel ? text : `(${text})`;
  }

  private describeTypedValues(tokens: FilterToken[], conjunction: 'and' | 'or'): string {
    if (!tokens || tokens.length === 0) {
      return '';
    }
    if (tokens.length === 1) {
      return this.describeTokenTypeAndValue(tokens[0]);
    }
    let firstType = tokens[0].type;
    let sameType = tokens.every((token: FilterToken) => token.type === firstType);
    if (sameType) {
      let values = tokens.map((token: FilterToken) => this.formatStrong(this.quoteValue(this.getTokenDisplayLabel(token))));
      return `${this.formatStrong(this.escapeHtml(this.getFilterTypePluralLabel(firstType)))} ${this.joinWithConjunction(values, conjunction)}`;
    }
    let typedValues = tokens.map((token: FilterToken) => this.describeTokenTypeAndValue(token));
    return this.joinWithConjunction(typedValues, conjunction);
  }

  private describeOneOfChoices(tokens: FilterToken[]): string {
    if (!tokens || tokens.length === 0) {
      return '';
    }
    let firstType = tokens[0].type;
    let sameType = tokens.every((token: FilterToken) => token.type === firstType);
    if (sameType) {
      let values = tokens.map((token: FilterToken) => this.formatStrong(this.quoteValue(this.getTokenDisplayLabel(token))));
      return `one of these ${this.formatStrong(this.escapeHtml(this.getFilterTypePluralLabel(firstType)))}: ${this.joinWithConjunction(values, 'or')}`;
    }
    let typedValues = tokens.map((token: FilterToken) => this.describeTokenTypeAndValue(token));
    return `one of: ${this.joinWithConjunction(typedValues, 'or')}`;
  }

  private getFilterTypeLabel(type: 'pop' | 'dc' | 'ag'): string {
    if (type === 'pop') {
      return 'population';
    }
    if (type === 'dc') {
      return 'data collection';
    }
    return 'technology';
  }

  private getFilterTypePluralLabel(type: 'pop' | 'dc' | 'ag'): string {
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

  private quoteValue(value: string): string {
    let safe = this.escapeHtml((value || '').replace(/"/g, '\''));
    return `"${safe}"`;
  }

  private describeTokenComparison(token: FilterToken): string {
    let typeLabel = this.formatStrong(this.escapeHtml(this.getFilterTypeLabel(token.type)));
    let valueLabel = this.formatStrong(this.quoteValue(this.getTokenDisplayLabel(token)));
    if (token.negated) {
      return `${typeLabel} is not ${valueLabel}`;
    }
    return `${typeLabel} is ${valueLabel}`;
  }

  private describeTokenTypeAndValue(token: FilterToken): string {
    let typeLabel = this.formatStrong(this.escapeHtml(this.getFilterTypeLabel(token.type)));
    let valueLabel = this.formatStrong(this.quoteValue(this.getTokenDisplayLabel(token)));
    return `${typeLabel} ${valueLabel}`;
  }

  private formatStrong(value: string): string {
    return `<strong>${value}</strong>`;
  }

  private escapeHtml(value: string): string {
    return (value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private joinWithConjunction(items: string[], conjunction: 'and' | 'or'): string {
    if (items.length === 0) {
      return '';
    }
    if (items.length === 1) {
      return items[0];
    }
    if (items.length === 2) {
      return `${items[0]} ${conjunction} ${items[1]}`;
    }
    return `${items.slice(0, items.length - 1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
  }

  private combineClauses(left: any, right: any, operator: string): any {
    if (operator === 'OR') {
      return { bool: { should: [left, right], minimum_should_match: 1 } };
    }
    return { bool: { must: [left, right] } };
  }

  private buildRpnTokens(): any[] {
    let tokens: any[] = [];
    let groupStartIndex: {[index: number]: boolean} = {};
    let groupEndIndex: {[index: number]: boolean} = {};
    for (let i = 0; i < this.filterTokens.length; i++) {
      if (this.groupStartIds[this.filterTokens[i].id]) {
        groupStartIndex[i] = true;
      }
      if (this.groupEndIds[this.filterTokens[i].id]) {
        groupEndIndex[i] = true;
      }
    }
    for (let i = 0; i < this.filterTokens.length; i++) {
      if (groupStartIndex[i]) {
        tokens.push({type: 'lparen'});
      }
      tokens.push({type: 'term', token: this.filterTokens[i]});
      if (groupEndIndex[i]) {
        tokens.push({type: 'rparen'});
      }
      if (i < this.filterOperators.length) {
        tokens.push({type: 'op', op: this.filterOperators[i] || 'AND'});
      }
    }
    return this.toRpn(tokens);
  }

  private toRpn(tokens: any[]): any[] {
    let output: any[] = [];
    let ops: any[] = [];
    let precedence: {[op: string]: number} = { 'AND': 1, 'OR': 1 };
    for (let tok of tokens) {
      if (tok.type === 'term') {
        output.push(tok);
        continue;
      }
      if (tok.type === 'op') {
        while (ops.length > 0) {
          let top = ops[ops.length - 1];
          if (top.type !== 'op') {
            break;
          }
          if (precedence[top.op] >= precedence[tok.op]) {
            output.push(ops.pop());
            continue;
          }
          break;
        }
        ops.push(tok);
        continue;
      }
      if (tok.type === 'lparen') {
        ops.push(tok);
        continue;
      }
      if (tok.type === 'rparen') {
        while (ops.length > 0 && ops[ops.length - 1].type !== 'lparen') {
          output.push(ops.pop());
        }
        if (ops.length > 0 && ops[ops.length - 1].type === 'lparen') {
          ops.pop();
        }
        continue;
      }
    }
    while (ops.length > 0) {
      output.push(ops.pop());
    }
    return output;
  }

  private evalRpn(tokens: any[]): any {
    let stack: any[] = [];
    for (let tok of tokens) {
      if (tok.type === 'term') {
        stack.push(this.buildTokenClause(tok.token));
        continue;
      }
      if (tok.type === 'op') {
        if (stack.length < 2) {
          return null;
        }
        let right = stack.pop();
        let left = stack.pop();
        stack.push(this.combineClauses(left, right, tok.op));
      }
    }
    return stack.length === 1 ? stack[0] : null;
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

  private extractSelectedKeys(filters: {[code: string]: boolean}): string[] {
    let keys: string[] = [];
    for (let key in filters) {
      if (filters[key]) {
        keys.push(key);
      }
    }
    return keys;
  }

  private updateTokenOrder(type: 'pop' | 'dc' | 'ag', prevKeys: string[], nextKeys: string[]) {
    let removed = prevKeys.filter((key: string) => nextKeys.indexOf(key) === -1);
    let added = nextKeys.filter((key: string) => prevKeys.indexOf(key) === -1);
    for (let key of removed) {
      this.removeToken(type, key);
    }
    for (let key of added) {
      this.addToken(type, key);
    }
    this.rebuildGroupMarkers();
  }

  private addToken(type: 'pop' | 'dc' | 'ag', key: string) {
    let id = this.makeTokenId(type, key);
    for (let token of this.filterTokens) {
      if (token.id === id) {
        return;
      }
    }
    if (this.filterTokens.length > 0) {
      this.filterOperators.push('AND');
    }
    this.filterTokens.push({id, type, key, negated: false});
    this.selectedTokenIds[id] = false;
  }

  private removeToken(type: 'pop' | 'dc' | 'ag', key: string) {
    let id = this.makeTokenId(type, key);
    let index = -1;
    for (let i = 0; i < this.filterTokens.length; i++) {
      let token = this.filterTokens[i];
      if (token.id === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      return;
    }
    this.filterTokens.splice(index, 1);
    delete this.selectedTokenIds[id];
    this.removeGroupsContainingTokenIds([id]);
    if (this.filterOperators.length === 0) {
      return;
    }
    if (index === 0) {
      this.filterOperators.splice(0, 1);
      return;
    }
    this.filterOperators.splice(index - 1, 1);
    if (this.filterOperators.length > this.filterTokens.length - 1) {
      this.filterOperators = this.filterOperators.slice(0, this.filterTokens.length - 1);
    }
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

  toggleTokenSelected(token: FilterToken) {
    this.selectedTokenIds[token.id] = !this.selectedTokenIds[token.id];
  }

  isTokenSelected(token: FilterToken): boolean {
    return !!this.selectedTokenIds[token.id];
  }

  canGroupSelection(): boolean {
    let selected = this.getSelectedTokensInOrder();
    if (selected.length < 2) {
      return false;
    }
    if (selected.length === this.filterTokens.length) {
      return false;
    }
    for (let token of selected) {
      if (this.groupedTokenIds[token.id]) {
        return false;
      }
    }
    return this.isSelectionContiguous(selected);
  }

  canUngroupSelection(): boolean {
    let selected = this.getSelectedTokensInOrder();
    if (selected.length === 0) {
      return false;
    }
    if (selected.length === this.filterTokens.length) {
      return false;
    }
    if (!this.isSelectionContiguous(selected)) {
      return false;
    }
    for (let token of selected) {
      if (this.groupedTokenIds[token.id]) {
        return true;
      }
    }
    return false;
  }

  canNegateSelection(): boolean {
    let selected = this.getSelectedTokensInOrder();
    return selected.length > 0;
  }

  groupSelection() {
    if (!this.canGroupSelection()) {
      return;
    }
    let selected = this.getSelectedTokensInOrder();
    if (selected.length === this.filterTokens.length) {
      this.groups = [];
      this.clearSelection();
      this.rebuildGroupMarkers();
      this.search();
      return;
    }
    this.groups.push({id: ++this.groupIdCounter, tokenIds: selected.map((token: FilterToken) => token.id)});
    this.clearSelection();
    this.rebuildGroupMarkers();
    this.search();
  }

  ungroupSelection() {
    if (!this.canUngroupSelection()) {
      return;
    }
    let selectedIds = this.getSelectedTokensInOrder().map((token: FilterToken) => token.id);
    this.groups = this.groups.filter((group) => !group.tokenIds.some((id: string) => selectedIds.indexOf(id) !== -1));
    this.clearSelection();
    this.rebuildGroupMarkers();
    this.search();
  }

  toggleNegationForSelection() {
    let selected = this.getSelectedTokensInOrder();
    if (selected.length === 0) {
      return;
    }
    for (let token of selected) {
      token.negated = !token.negated;
    }
    this.search();
  }

  isGroupStart(token: FilterToken): boolean {
    return !!this.groupStartIds[token.id];
  }

  isGroupEnd(token: FilterToken): boolean {
    return !!this.groupEndIds[token.id];
  }

  groupStartCount(token: FilterToken): number {
    if (this.groups.length > 0) {
      return this.groupStartIds[token.id] ? 1 : 0;
    }
    return this.autoGroupStartCount[token.id] || 0;
  }

  groupEndCount(token: FilterToken): number {
    if (this.groups.length > 0) {
      return this.groupEndIds[token.id] ? 1 : 0;
    }
    return this.autoGroupEndCount[token.id] || 0;
  }

  parenRange(count: number): number[] {
    if (!count || count <= 0) {
      return [];
    }
    return Array.apply(null, Array(count)).map(() => 0);
  }

  private makeTokenId(type: 'pop' | 'dc' | 'ag', key: string): string {
    return `${type}:${key}`;
  }

  private clearSelection() {
    for (let key in this.selectedTokenIds) {
      this.selectedTokenIds[key] = false;
    }
  }

  private getSelectedTokensInOrder(): FilterToken[] {
    return this.filterTokens.filter((token: FilterToken) => this.selectedTokenIds[token.id]);
  }

  private isSelectionContiguous(selected: FilterToken[]): boolean {
    if (selected.length === 0) {
      return false;
    }
    let indices = selected.map((token: FilterToken) => this.tokenIndex(token.id)).sort((a, b) => a - b);
    return indices[indices.length - 1] - indices[0] + 1 === selected.length;
  }

  private tokenIndex(id: string): number {
    for (let i = 0; i < this.filterTokens.length; i++) {
      if (this.filterTokens[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  private removeGroupsContainingTokenIds(tokenIds: string[]) {
    if (tokenIds.length === 0) {
      return;
    }
    this.groups = this.groups.filter((group) => !group.tokenIds.some((id: string) => tokenIds.indexOf(id) !== -1));
  }

  private rebuildGroupMarkers() {
    this.groupStartIds = {};
    this.groupEndIds = {};
    this.groupedTokenIds = {};
    let indexMap: {[id: string]: number} = {};
    for (let i = 0; i < this.filterTokens.length; i++) {
      indexMap[this.filterTokens[i].id] = i;
    }
    let nextGroups: {id: number, tokenIds: string[]}[] = [];
    for (let group of this.groups) {
      let indices: number[] = [];
      let valid = true;
      for (let id of group.tokenIds) {
        if (!indexMap.hasOwnProperty(id)) {
          valid = false;
          break;
        }
        indices.push(indexMap[id]);
      }
      if (!valid) {
        continue;
      }
      indices.sort((a, b) => a - b);
      if (indices[indices.length - 1] - indices[0] + 1 !== indices.length) {
        continue;
      }
      let startIndex = indices[0];
      let endIndex = indices[indices.length - 1];
      let startId = this.filterTokens[startIndex].id;
      let endId = this.filterTokens[endIndex].id;
      let overlap = false;
      for (let id of group.tokenIds) {
        if (this.groupedTokenIds[id]) {
          overlap = true;
          break;
        }
      }
      if (overlap) {
        continue;
      }
      this.groupStartIds[startId] = true;
      this.groupEndIds[endId] = true;
      for (let id of group.tokenIds) {
        this.groupedTokenIds[id] = true;
      }
      nextGroups.push(group);
    }
    this.groups = nextGroups;
    this.rebuildAutoGroupMarkers();
  }

  private rebuildAutoGroupMarkers() {
    this.autoGroupStartCount = {};
    this.autoGroupEndCount = {};
    if (this.groups.length > 0) {
      return;
    }
    if (this.allOperatorsSame()) {
      return;
    }
    if (this.filterTokens.length <= 2) {
      return;
    }
    let startId = this.filterTokens[0].id;
    this.autoGroupStartCount[startId] = this.filterTokens.length - 2;
    for (let i = 1; i < this.filterTokens.length - 1; i++) {
      let endId = this.filterTokens[i].id;
      this.autoGroupEndCount[endId] = (this.autoGroupEndCount[endId] || 0) + 1;
    }
  }

  private allOperatorsSame(): boolean {
    if (this.filterOperators.length === 0) {
      return true;
    }
    let first = this.filterOperators[0] || 'AND';
    for (let op of this.filterOperators) {
      if ((op || 'AND') !== first) {
        return false;
      }
    }
    return true;
  }
};

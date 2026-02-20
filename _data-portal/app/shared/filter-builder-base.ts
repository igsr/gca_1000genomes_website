export type FilterOperator = 'AND' | 'OR';

interface FilterGroup {
  id: number;
  tokenIds: string[];
}

interface ExpressionToken<TToken> {
  type: 'term' | 'op' | 'lparen' | 'rparen';
  token?: TToken;
  op?: FilterOperator;
}

export interface FilterTokenBase<TTokenType extends string> {
  id: string;
  type: TTokenType;
  key: string;
  negated: boolean;
}

export abstract class FilterBuilderBase<TTokenType extends string, TToken extends FilterTokenBase<TTokenType>> {
  public filterTokens: TToken[] = [];
  public filterOperators: FilterOperator[] = [];
  public selectedTokenIds: {[id: string]: boolean} = {};
  public groups: FilterGroup[] = [];
  public groupStartIds: {[id: string]: boolean} = {};
  public groupEndIds: {[id: string]: boolean} = {};
  public groupedTokenIds: {[id: string]: boolean} = {};
  public autoGroupStartCount: {[id: string]: number} = {};
  public autoGroupEndCount: {[id: string]: number} = {};

  private groupIdCounter: number = 0;

  protected abstract createToken(type: TTokenType, key: string, id: string): TToken;

  public extractSelectedKeys(filters: {[code: string]: boolean}): string[] {
    let keys: string[] = [];
    for (let key in filters) {
      if (filters[key]) {
        keys.push(key);
      }
    }
    return keys;
  }

  public updateTokenOrder(type: TTokenType, prevKeys: string[], nextKeys: string[]) {
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

  public toggleChainOperator(index: number) {
    if (index < 0 || index >= this.filterOperators.length) {
      return;
    }
    this.filterOperators[index] = this.filterOperators[index] === 'AND' ? 'OR' : 'AND';
    if (this.allOperatorsSame()) {
      this.groups = [];
    }
    this.rebuildGroupMarkers();
  }

  public buildQuery(buildTokenClause: (token: TToken) => any): any {
    if (this.filterTokens.length === 0) {
      return null;
    }
    let rpn = this.buildRpnTokens();
    let combined = this.evalRpn(rpn, buildTokenClause);
    return combined ? { constant_score: { filter: combined } } : null;
  }

  public buildRpnTokens(): any[] {
    let tokens: ExpressionToken<TToken>[] = [];
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

  public toggleTokenSelected(token: TToken) {
    this.selectedTokenIds[token.id] = !this.selectedTokenIds[token.id];
  }

  public isTokenSelected(token: TToken): boolean {
    return !!this.selectedTokenIds[token.id];
  }

  public canGroupSelection(): boolean {
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

  public canUngroupSelection(): boolean {
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

  public canNegateSelection(): boolean {
    return this.getSelectedTokensInOrder().length > 0;
  }

  public groupSelection() {
    if (!this.canGroupSelection()) {
      return;
    }
    let selected = this.getSelectedTokensInOrder();
    this.groups.push({id: ++this.groupIdCounter, tokenIds: selected.map((token: TToken) => token.id)});
    this.clearSelection();
    this.rebuildGroupMarkers();
  }

  public ungroupSelection() {
    if (!this.canUngroupSelection()) {
      return;
    }
    let selectedIds = this.getSelectedTokensInOrder().map((token: TToken) => token.id);
    this.groups = this.groups.filter((group: FilterGroup) => !group.tokenIds.some((id: string) => selectedIds.indexOf(id) !== -1));
    this.clearSelection();
    this.rebuildGroupMarkers();
  }

  public toggleNegationForSelection() {
    let selected = this.getSelectedTokensInOrder();
    if (selected.length === 0) {
      return;
    }
    for (let token of selected) {
      token.negated = !token.negated;
    }
  }

  public groupStartCount(token: TToken): number {
    if (this.groups.length > 0) {
      return this.groupStartIds[token.id] ? 1 : 0;
    }
    return this.autoGroupStartCount[token.id] || 0;
  }

  public groupEndCount(token: TToken): number {
    if (this.groups.length > 0) {
      return this.groupEndIds[token.id] ? 1 : 0;
    }
    return this.autoGroupEndCount[token.id] || 0;
  }

  public parenRange(count: number): number[] {
    if (!count || count <= 0) {
      return [];
    }
    return Array.apply(null, Array(count)).map(() => 0);
  }

  protected makeTokenId(type: TTokenType, key: string): string {
    return `${type}:${key}`;
  }

  protected addToken(type: TTokenType, key: string) {
    let id = this.makeTokenId(type, key);
    for (let token of this.filterTokens) {
      if (token.id === id) {
        return;
      }
    }
    if (this.filterTokens.length > 0) {
      this.filterOperators.push('AND');
    }
    this.filterTokens.push(this.createToken(type, key, id));
    this.selectedTokenIds[id] = false;
  }

  protected removeToken(type: TTokenType, key: string) {
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

  protected rebuildGroupMarkers() {
    this.groupStartIds = {};
    this.groupEndIds = {};
    this.groupedTokenIds = {};
    let indexMap: {[id: string]: number} = {};
    for (let i = 0; i < this.filterTokens.length; i++) {
      indexMap[this.filterTokens[i].id] = i;
    }
    let nextGroups: FilterGroup[] = [];
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
      indices.sort((a: number, b: number) => a - b);
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

  protected allOperatorsSame(): boolean {
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

  private combineClauses(left: any, right: any, operator: FilterOperator): any {
    if (operator === 'OR') {
      return { bool: { should: [left, right], minimum_should_match: 1 } };
    }
    return { bool: { must: [left, right] } };
  }

  private toRpn(tokens: ExpressionToken<TToken>[]): any[] {
    let output: any[] = [];
    let ops: ExpressionToken<TToken>[] = [];
    let precedence: {[op: string]: number} = { 'AND': 2, 'OR': 1 };
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
      }
    }
    while (ops.length > 0) {
      output.push(ops.pop());
    }
    return output;
  }

  private evalRpn(tokens: any[], buildTokenClause: (token: TToken) => any): any {
    let stack: any[] = [];
    for (let tok of tokens) {
      if (tok.type === 'term') {
        stack.push(buildTokenClause(tok.token));
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

  private clearSelection() {
    for (let key in this.selectedTokenIds) {
      this.selectedTokenIds[key] = false;
    }
  }

  private getSelectedTokensInOrder(): TToken[] {
    return this.filterTokens.filter((token: TToken) => this.selectedTokenIds[token.id]);
  }

  private isSelectionContiguous(selected: TToken[]): boolean {
    if (selected.length === 0) {
      return false;
    }
    let indices = selected.map((token: TToken) => this.tokenIndex(token.id)).sort((a: number, b: number) => a - b);
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
    this.groups = this.groups.filter((group: FilterGroup) => !group.tokenIds.some((id: string) => tokenIds.indexOf(id) !== -1));
  }

  private rebuildAutoGroupMarkers() {
    this.autoGroupStartCount = {};
    this.autoGroupEndCount = {};
    if (this.groups.length > 0) {
      return;
    }
    if (this.filterTokens.length <= 2) {
      return;
    }
    let hasOr = this.filterOperators.some((op: FilterOperator) => op === 'OR');
    let hasAnd = this.filterOperators.some((op: FilterOperator) => op === 'AND');
    if (!hasOr || !hasAnd) {
      return;
    }
    let runStart = 0;
    while (runStart < this.filterTokens.length) {
      let runEnd = runStart;
      while (runEnd < this.filterOperators.length && this.filterOperators[runEnd] === 'AND') {
        runEnd += 1;
      }
      if (runEnd > runStart) {
        let startId = this.filterTokens[runStart].id;
        let endId = this.filterTokens[runEnd].id;
        this.autoGroupStartCount[startId] = (this.autoGroupStartCount[startId] || 0) + 1;
        this.autoGroupEndCount[endId] = (this.autoGroupEndCount[endId] || 0) + 1;
      }
      runStart = runEnd + 1;
    }
  }
}

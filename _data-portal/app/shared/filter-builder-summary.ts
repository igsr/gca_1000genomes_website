export type FilterOperator = 'AND' | 'OR';

export interface FilterSummaryOptions<TToken> {
  entityLabel: string;
  getFilterTypeLabel: (type: string) => string;
  getFilterTypePluralLabel: (type: string) => string;
  getTokenDisplayLabel: (token: TToken) => string;
}

interface FilterExpressionNode<TToken> {
  type: 'term' | 'op';
  token?: TToken;
  op?: FilterOperator;
  left?: FilterExpressionNode<TToken>;
  right?: FilterExpressionNode<TToken>;
}

interface RpnToken<TToken> {
  type: 'term' | 'op';
  token?: TToken;
  op?: FilterOperator;
}

const MAX_PLAIN_ENGLISH_FILTERS: number = 4;
const MAX_INLINE_SUMMARY_LENGTH: number = 320;

export function buildReadableFilterSummary<TToken extends {type: string; key: string; negated: boolean}>(
  rpnTokens: Array<RpnToken<TToken>>,
  options: FilterSummaryOptions<TToken>
): string {
  if (!rpnTokens || rpnTokens.length === 0) {
    return '';
  }

  let expression = buildExpressionTree(rpnTokens);
  if (!expression) {
    return '';
  }

  let filterCount = countTerms(expression);
  if (filterCount <= MAX_PLAIN_ENGLISH_FILTERS) {
    let plainEnglish = buildPlainEnglishSummary(expression, options);
    if (plainEnglish && plainEnglish.length <= MAX_INLINE_SUMMARY_LENGTH) {
      return plainEnglish;
    }
  }

  return buildFallbackSummary(expression, filterCount, options);
}

function buildExpressionTree<TToken>(tokens: Array<RpnToken<TToken>>): FilterExpressionNode<TToken> | null {
  let stack: FilterExpressionNode<TToken>[] = [];
  for (let tok of tokens) {
    if (!tok) {
      continue;
    }
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

function buildPlainEnglishSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let withExclusionsSummary = tryBuildWithExclusionsSummary(expression, options);
  if (withExclusionsSummary) {
    return `Showing ${options.entityLabel} ${withExclusionsSummary}.`;
  }

  let alternativesSummary = tryBuildAlternativesSummary(expression, options);
  if (alternativesSummary) {
    return `Showing ${options.entityLabel} ${alternativesSummary}.`;
  }

  let queryText = describeQueryExpression(expression, true, undefined, options);
  if (!queryText) {
    return '';
  }
  return `Showing ${options.entityLabel} matching this query: ${queryText}.`;
}

function tryBuildWithExclusionsSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  if (expression && expression.type === 'op' && expression.op === 'OR' && !containsNegation(expression)) {
    return '';
  }

  let parts = flattenByOperator(expression, 'AND');
  if (parts.length === 0) {
    return '';
  }

  let included: FilterExpressionNode<TToken>[] = [];
  let excluded: TToken[] = [];
  for (let part of parts) {
    if (isSimpleNegatedTerm(part)) {
      excluded.push(part.token);
      continue;
    }
    if (containsNegation(part)) {
      return '';
    }
    included.push(part);
  }

  let clauses: string[] = [];
  if (included.length > 0) {
    clauses.push(`with ${joinReadablePhrases(included.map((part: FilterExpressionNode<TToken>) => describePositivePhrase(part, undefined, options)), 'and')}`);
  }
  if (excluded.length > 0) {
    clauses.push(`excluding ${joinReadablePhrases(excluded.map((token: TToken) => describePositiveToken(token, options)), 'and')}`);
  }

  if (clauses.length === 0) {
    return '';
  }
  return clauses.join(', ');
}

function tryBuildAlternativesSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  if (containsNegation(expression)) {
    return '';
  }
  let parts = flattenByOperator(expression, 'OR');
  if (parts.length < 2) {
    return '';
  }

  let phrases = parts.map((part: FilterExpressionNode<TToken>) => describePositivePhrase(part, 'OR', options));
  if (parts.length === 2) {
    return `matching either ${phrases[0]} or ${phrases[1]}`;
  }
  return `matching any of the following: ${joinReadablePhrases(phrases, 'or')}`;
}

function describePositivePhrase<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>,
  parentOperator: FilterOperator | undefined,
  options: FilterSummaryOptions<TToken>
): string {
  if (!node) {
    return '';
  }
  if (node.type === 'term') {
    return describePositiveToken(node.token, options);
  }

  let operator = node.op || 'AND';
  let parts = flattenByOperator(node, operator).map((part: FilterExpressionNode<TToken>) => describePositivePhrase(part, operator, options));
  let text = joinReadablePhrases(parts, operator === 'OR' ? 'or' : 'and');

  if (operator === 'OR') {
    return `either ${text}`;
  }
  if (parentOperator === 'OR') {
    return `both ${text}`;
  }
  return text;
}

function describeQueryExpression<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>,
  isTopLevel: boolean,
  parentOperator: FilterOperator | undefined,
  options: FilterSummaryOptions<TToken>
): string {
  if (!node) {
    return '';
  }
  if (node.type === 'term') {
    return describeQueryTerm(node.token, options);
  }

  let operator = node.op || 'AND';
  let parts = flattenByOperator(node, operator).map((part: FilterExpressionNode<TToken>) =>
    describeQueryExpression(part, false, operator, options)
  );
  let text = joinReadablePhrases(parts, operator === 'OR' ? 'or' : 'and');

  if (operator === 'OR') {
    return `either ${text}`;
  }
  if (!isTopLevel && parentOperator === 'OR') {
    return `both ${text}`;
  }
  return text;
}

function describePositiveToken<TToken extends {type: string; key: string; negated: boolean}>(
  token: TToken,
  options: FilterSummaryOptions<TToken>
): string {
  let typeLabel = formatStrong(escapeHtml(options.getFilterTypeLabel(token.type)));
  let valueLabel = formatStrong(quoteValue(options.getTokenDisplayLabel(token)));
  return `${typeLabel} ${valueLabel}`;
}

function describeQueryTerm<TToken extends {type: string; key: string; negated: boolean}>(
  token: TToken,
  options: FilterSummaryOptions<TToken>
): string {
  let typeLabel = formatStrong(escapeHtml(options.getFilterTypeLabel(token.type)));
  let valueLabel = formatStrong(quoteValue(options.getTokenDisplayLabel(token)));
  if (token.negated) {
    return `${typeLabel} is not ${valueLabel}`;
  }
  return `${typeLabel} is ${valueLabel}`;
}

function buildFallbackSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  filterCount: number,
  options: FilterSummaryOptions<TToken>
): string {
  let typeSummary = buildTypeSummary(expression, options);
  if (typeSummary) {
    return `Showing ${options.entityLabel} matching a custom query across ${formatStrong(String(filterCount))} filters (${typeSummary}).`;
  }
  return `Showing ${options.entityLabel} matching a custom query across ${formatStrong(String(filterCount))} filters.`;
}

function buildTypeSummary<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let tokens = collectTokens(node);
  if (tokens.length === 0) {
    return '';
  }

  let counts: {[type: string]: number} = {};
  let order: string[] = [];
  for (let token of tokens) {
    if (!counts[token.type]) {
      counts[token.type] = 0;
      order.push(token.type);
    }
    counts[token.type] += 1;
  }

  let parts = order.map((type: string) => describeTypeCount(type, counts[type], options));
  return joinReadablePhrases(parts, 'and');
}

function collectTokens<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>
): TToken[] {
  if (!node) {
    return [];
  }
  if (node.type === 'term') {
    return node.token ? [node.token] : [];
  }
  return collectTokens(node.left).concat(collectTokens(node.right));
}

function countTerms<TToken>(node: FilterExpressionNode<TToken>): number {
  if (!node) {
    return 0;
  }
  if (node.type === 'term') {
    return 1;
  }
  return countTerms(node.left) + countTerms(node.right);
}

function flattenByOperator<TToken>(
  node: FilterExpressionNode<TToken>,
  operator: FilterOperator
): FilterExpressionNode<TToken>[] {
  if (!node || node.type !== 'op' || node.op !== operator) {
    return [node];
  }
  return flattenByOperator(node.left, operator).concat(flattenByOperator(node.right, operator));
}

function isSimpleNegatedTerm<TToken extends {negated: boolean}>(node: FilterExpressionNode<TToken>): boolean {
  return !!(node && node.type === 'term' && node.token && node.token.negated);
}

function containsNegation<TToken extends {negated: boolean}>(node: FilterExpressionNode<TToken>): boolean {
  if (!node) {
    return false;
  }
  if (node.type === 'term') {
    return !!(node.token && node.token.negated);
  }
  return containsNegation(node.left) || containsNegation(node.right);
}

function describeTypeCount<TToken>(
  type: string,
  count: number,
  options: FilterSummaryOptions<TToken>
): string {
  let label = count === 1
    ? options.getFilterTypeLabel(type)
    : options.getFilterTypePluralLabel(type);
  return `${formatStrong(String(count))} ${formatStrong(escapeHtml(label))}`;
}

function quoteValue(value: string): string {
  let safe = escapeHtml((value || '').replace(/"/g, '\''));
  return `"${safe}"`;
}

function formatStrong(value: string): string {
  return `<strong>${value}</strong>`;
}

function escapeHtml(value: string): string {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function joinReadablePhrases(items: string[], conjunction: 'and' | 'or'): string {
  let filtered = items.filter((item: string) => !!item);
  if (filtered.length === 0) {
    return '';
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  if (filtered.length === 2) {
    let grouped = filtered.some((item: string) => item.indexOf('either ') === 0 || item.indexOf('both ') === 0);
    return grouped
      ? `${filtered[0]}, ${conjunction} ${filtered[1]}`
      : `${filtered[0]} ${conjunction} ${filtered[1]}`;
  }
  return `${filtered.slice(0, filtered.length - 1).join(', ')}, ${conjunction} ${filtered[filtered.length - 1]}`;
}

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
  let includeExcludeSummary = tryBuildIncludeExcludeSummary(expression, options);
  if (includeExcludeSummary) {
    return `Showing ${options.entityLabel} ${includeExcludeSummary}.`;
  }
  let positiveAndSummary = tryBuildPositiveAndSummary(expression, options);
  if (positiveAndSummary) {
    return `Showing ${options.entityLabel} ${positiveAndSummary}.`;
  }
  let positiveOrSummary = tryBuildPositiveOrSummary(expression, options);
  if (positiveOrSummary) {
    return `Showing ${options.entityLabel} ${positiveOrSummary}.`;
  }
  let exclusionOnlySummary = tryBuildExclusionOnlySummary(expression, options);
  if (exclusionOnlySummary) {
    return `Showing ${options.entityLabel} ${exclusionOnlySummary}.`;
  }
  let oneOfEachSummary = tryBuildOneOfEachSummary(expression, options);
  if (oneOfEachSummary) {
    return `Showing ${options.entityLabel} ${oneOfEachSummary}.`;
  }
  let eitherOrBothSummary = tryBuildEitherOrBothSummary(expression, options);
  if (eitherOrBothSummary) {
    return `Showing ${options.entityLabel} ${eitherOrBothSummary}.`;
  }
  let withWhereSummary = tryBuildWithWhereSummary(expression, options);
  if (withWhereSummary) {
    return `Showing ${options.entityLabel} ${withWhereSummary}.`;
  }
  return `Showing ${options.entityLabel} where ${describeExpression(expression, true, options)}.`;
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

function tryBuildPositiveAndSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let terms = getPositiveTermsForOperatorExpression(expression, 'AND');
  if (!terms) {
    return '';
  }
  return `from ${describeTypedValues(terms, 'and', options)}`;
}

function tryBuildPositiveOrSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let terms = getPositiveTermsForOperatorExpression(expression, 'OR');
  if (!terms) {
    return '';
  }
  return `matching any of ${describeTypedValues(terms, 'or', options)}`;
}

function tryBuildExclusionOnlySummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let negatedTerms = getNegativeTermsForAndExpression(expression);
  if (!negatedTerms) {
    return '';
  }
  return `excluding ${describeTypedValues(negatedTerms, 'and', options)}`;
}

function tryBuildOneOfEachSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  if (!expression || expression.type !== 'op' || expression.op !== 'AND') {
    return '';
  }
  let leftTerms = getPositiveTermsForOperatorExpression(expression.left, 'OR');
  let rightTerms = getPositiveTermsForOperatorExpression(expression.right, 'OR');
  if (!leftTerms || !rightTerms) {
    return '';
  }
  return `matching ${describeOneOfChoices(leftTerms, options)} and ${describeOneOfChoices(rightTerms, options)}`;
}

function tryBuildIncludeExcludeSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let conjuncts = flattenByOperator(expression, 'AND');
  if (conjuncts.length < 2) {
    return '';
  }
  let positiveConjuncts: FilterExpressionNode<TToken>[] = [];
  let negativeTerms: TToken[] = [];
  for (let conjunct of conjuncts) {
    if (isSimpleNegatedTerm(conjunct)) {
      negativeTerms.push(conjunct.token);
      continue;
    }
    if (containsNegation(conjunct)) {
      return '';
    }
    positiveConjuncts.push(conjunct);
  }
  if (positiveConjuncts.length === 0 || negativeTerms.length === 0) {
    return '';
  }
  let includeTree = combineNodesWithAnd(positiveConjuncts);
  if (!includeTree) {
    return '';
  }
  let includeText = buildIncludeSummaryText(includeTree, options);
  let excludeText = describeTypedValues(negativeTerms, 'and', options);
  return `${includeText}, then excluding ${excludeText}`;
}

function buildIncludeSummaryText<TToken extends {type: string; key: string; negated: boolean}>(
  includeTree: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let pureOrTerms = getPositiveTermsForOperatorExpression(includeTree, 'OR');
  if (pureOrTerms) {
    return `matching any of ${describeTypedValues(pureOrTerms, 'or', options)}`;
  }
  return `from ${describeFromExpression(includeTree, true, options)}`;
}

function tryBuildWithWhereSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  if (!expression || expression.type !== 'op' || expression.op !== 'AND') {
    return '';
  }
  let leftHasOr = containsOperator(expression.left, 'OR');
  let rightHasOr = containsOperator(expression.right, 'OR');
  if (leftHasOr === rightHasOr) {
    return '';
  }
  let groupedSide = leftHasOr ? expression.left : expression.right;
  let baseSide = leftHasOr ? expression.right : expression.left;
  if (containsNegation(baseSide)) {
    return '';
  }
  return `with ${describeFromExpression(baseSide, true, options)}, where ${describeExpression(groupedSide, true, options)}`;
}

function tryBuildEitherOrBothSummary<TToken extends {type: string; key: string; negated: boolean}>(
  expression: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
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
  let singleText = containsNegation(singleSide)
    ? describeExpression(singleSide, true, options)
    : describeFromExpression(singleSide, true, options);
  return `matching either ${singleText} or ${describeBothExpression(andGroup, options)}`;
}

function combineNodesWithAnd<TToken>(nodes: FilterExpressionNode<TToken>[]): FilterExpressionNode<TToken> | null {
  if (nodes.length === 0) {
    return null;
  }
  let combined = nodes[0];
  for (let i = 1; i < nodes.length; i++) {
    combined = {type: 'op', op: 'AND', left: combined, right: nodes[i]};
  }
  return combined;
}

function flattenByOperator<TToken>(node: FilterExpressionNode<TToken>, operator: FilterOperator): FilterExpressionNode<TToken>[] {
  if (!node || node.type !== 'op' || node.op !== operator) {
    return [node];
  }
  return flattenByOperator(node.left, operator).concat(flattenByOperator(node.right, operator));
}

function getPositiveTermsForOperatorExpression<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>,
  operator: FilterOperator
): TToken[] | null {
  if (!node) {
    return null;
  }
  let parts = flattenByOperator(node, operator);
  if (parts.length < 2) {
    return null;
  }
  let tokens: TToken[] = [];
  for (let part of parts) {
    if (!part || part.type !== 'term' || !part.token || part.token.negated) {
      return null;
    }
    tokens.push(part.token);
  }
  return tokens;
}

function getNegativeTermsForAndExpression<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>
): TToken[] | null {
  if (!node) {
    return null;
  }
  let parts = flattenByOperator(node, 'AND');
  if (parts.length === 0) {
    return null;
  }
  let tokens: TToken[] = [];
  for (let part of parts) {
    if (!isSimpleNegatedTerm(part)) {
      return null;
    }
    tokens.push(part.token);
  }
  return tokens;
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

function containsOperator<TToken>(node: FilterExpressionNode<TToken>, operator: FilterOperator): boolean {
  if (!node || node.type !== 'op') {
    return false;
  }
  if (node.op === operator) {
    return true;
  }
  return containsOperator(node.left, operator) || containsOperator(node.right, operator);
}

function describeBothExpression<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>,
  options: FilterSummaryOptions<TToken>
): string {
  let parts = flattenByOperator(node, 'AND');
  if (parts.length >= 2 && parts.every((part: FilterExpressionNode<TToken>) => part && part.type === 'term' && part.token && !part.token.negated)) {
    return `both ${describeTypedValues(parts.map((part: FilterExpressionNode<TToken>) => part.token), 'and', options)}`;
  }
  return `both ${describeExpression(node, true, options)}`;
}

function describeExpression<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>,
  isTopLevel: boolean,
  options: FilterSummaryOptions<TToken>
): string {
  if (!node) {
    return '';
  }
  if (node.type === 'term') {
    let token = node.token;
    return describeTokenComparison(token, options);
  }
  let leftText = describeExpression(node.left, false, options);
  let rightText = describeExpression(node.right, false, options);
  let text: string;
  if (node.op === 'OR') {
    text = isTopLevel ? `${leftText} or ${rightText}` : `either ${leftText} or ${rightText}`;
  } else {
    text = `${leftText} and ${rightText}`;
  }
  return isTopLevel ? text : `(${text})`;
}

function describeFromExpression<TToken extends {type: string; key: string; negated: boolean}>(
  node: FilterExpressionNode<TToken>,
  isTopLevel: boolean,
  options: FilterSummaryOptions<TToken>
): string {
  if (!node) {
    return '';
  }
  if (node.type === 'term') {
    let token = node.token;
    let typeLabel = formatStrong(escapeHtml(options.getFilterTypeLabel(token.type)));
    let valueLabel = formatStrong(quoteValue(options.getTokenDisplayLabel(token)));
    if (token.negated) {
      return `${typeLabel} not ${valueLabel}`;
    }
    return `${typeLabel} ${valueLabel}`;
  }
  let operatorText = node.op === 'OR' ? ' or ' : ' and ';
  let text = `${describeFromExpression(node.left, false, options)}${operatorText}${describeFromExpression(node.right, false, options)}`;
  return isTopLevel ? text : `(${text})`;
}

function describeTypedValues<TToken extends {type: string; key: string; negated: boolean}>(
  tokens: TToken[],
  conjunction: 'and' | 'or',
  options: FilterSummaryOptions<TToken>
): string {
  if (!tokens || tokens.length === 0) {
    return '';
  }
  if (tokens.length === 1) {
    return describeTokenTypeAndValue(tokens[0], options);
  }
  let firstType = tokens[0].type;
  let sameType = tokens.every((token: TToken) => token.type === firstType);
  if (sameType) {
    let values = tokens.map((token: TToken) => formatStrong(quoteValue(options.getTokenDisplayLabel(token))));
    return `${formatStrong(escapeHtml(options.getFilterTypePluralLabel(firstType)))} ${joinWithConjunction(values, conjunction)}`;
  }
  let typedValues = tokens.map((token: TToken) => describeTokenTypeAndValue(token, options));
  return joinWithConjunction(typedValues, conjunction);
}

function describeOneOfChoices<TToken extends {type: string; key: string; negated: boolean}>(
  tokens: TToken[],
  options: FilterSummaryOptions<TToken>
): string {
  if (!tokens || tokens.length === 0) {
    return '';
  }
  let firstType = tokens[0].type;
  let sameType = tokens.every((token: TToken) => token.type === firstType);
  if (sameType) {
    let values = tokens.map((token: TToken) => formatStrong(quoteValue(options.getTokenDisplayLabel(token))));
    return `one of these ${formatStrong(escapeHtml(options.getFilterTypePluralLabel(firstType)))}: ${joinWithConjunction(values, 'or')}`;
  }
  let typedValues = tokens.map((token: TToken) => describeTokenTypeAndValue(token, options));
  return `one of: ${joinWithConjunction(typedValues, 'or')}`;
}

function describeTokenComparison<TToken extends {type: string; key: string; negated: boolean}>(
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

function describeTokenTypeAndValue<TToken extends {type: string; key: string; negated: boolean}>(
  token: TToken,
  options: FilterSummaryOptions<TToken>
): string {
  let typeLabel = formatStrong(escapeHtml(options.getFilterTypeLabel(token.type)));
  let valueLabel = formatStrong(quoteValue(options.getTokenDisplayLabel(token)));
  return `${typeLabel} ${valueLabel}`;
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

function joinWithConjunction(items: string[], conjunction: 'and' | 'or'): string {
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

import { AnalysisGroup } from './analysis-group';

export class AnalysisGroupList {
  constructor(
    readonly hits: {
      _source: AnalysisGroup,
    }[]
  ) { }
}

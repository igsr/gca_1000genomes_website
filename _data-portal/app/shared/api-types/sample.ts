import { DataCollection } from './data-collection';

export class Sample {
  constructor(
    readonly name: string,
    readonly sex: string,
    readonly biosampleId: string,
    readonly populations: {
      name: string,
      description: string,
      code: string,
			elasticId: string,
    }[],
    readonly superpopulation: {
      name: string,
      code: string,
    },
    readonly relatedSample: {
      relationship: string,
      relatedSampleName: string,
    }[],
    readonly dataCollections: DataCollection[],
  ){};
}

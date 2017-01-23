export class Sample {
  constructor(
    readonly name: string,
    readonly sex: string,
    readonly biosampleId: string,
    readonly population: {
      name: string,
      description: string,
      code: string,
    },
    readonly superpopulation: {
      name: string,
      code: string,
    },
    readonly relatedSample: {
      relationship: string,
      relatedSampleName: string,
    }[],
    readonly dataCollections: Object[],
  ){};
}

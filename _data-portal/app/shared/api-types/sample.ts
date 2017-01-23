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
  ){};
}

import { DataCollection } from './data-collection';

export class Population {
  constructor(
    readonly name: string,
    readonly code: string,
    readonly description: string,
    readonly superpopulation: {
      name: string,
      code: string,
    },
    readonly dataCollections: DataCollection[],
  ){};
}

import { DataCollection } from './data-collection';

export class Population {
  constructor(
    readonly name: string,
    readonly code: string,
    readonly description: string,
    readonly latitude: string,
    readonly longitude: string,
    readonly superpopulation: {
      name: string,
      code: string,
      display_colour: string,
			display_order: number,
    },
    readonly dataCollections: DataCollection[],
  ){};
}

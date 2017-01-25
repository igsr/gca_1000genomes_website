import { DataCollection } from './data-collection';

export class DataCollectionList {
  constructor(
    readonly hits: {
      _source: DataCollection,
      _id: string,
    }[]
  ) { }
}

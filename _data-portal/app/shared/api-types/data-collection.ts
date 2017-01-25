export class DataCollection {
  constructor(
    readonly title: string,
    readonly shortTitle: string,
    readonly publication: string,
    readonly website: string,
    readonly displayOrder: number,
    readonly samples: {count: number},
    readonly populations: {count: number},
    readonly dataTypes: string[],
  ) { }
}

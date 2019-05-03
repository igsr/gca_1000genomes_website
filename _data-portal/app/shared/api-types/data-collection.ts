export class DataCollection {
  constructor(
    readonly title: string,
    readonly shortTitle: string,
    readonly publications: {
			name: string,
			url: string,
			displayOrder: number
		}[],
    readonly website: string,
    readonly dataReusePolicy: string,
    readonly displayOrder: number,
    readonly samples: {count: number},
    readonly populations: {count: number},
    readonly dataTypes: string[],
  ) { }
}

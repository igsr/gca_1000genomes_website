export class SearchHit<T> {
  constructor(
    readonly _source: T,
    readonly _id: string,
    readonly fields: {[key:string]: string[]},
    readonly highlight: {content: string[]},
  ){}
}

export class SearchHits<T> {
  constructor(
    readonly hits: SearchHit<T>[],
    readonly total: number,
  ) { }
}

export class ApiHits {
  constructor(
    readonly hits: {
      fields: {[key:string]: string[]}
    }[],
    readonly total: number,
  ) { }
}

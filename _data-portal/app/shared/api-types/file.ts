export class File {
  constructor(
    readonly url: string,
    readonly analysisGroup: string,
    readonly samples: string[],
  ) {};
}

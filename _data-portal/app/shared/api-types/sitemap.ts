export class SitemapList {
  constructor(
    readonly hits: {
      _source: {title: string, url: string},
      highlight: {content: string[]},
    }[]
  ) { }
}

import { File } from './file';

export class FileList {
  constructor(
    readonly hits: {
      _source: File,
    }[],
    readonly total: number,
  ) { }
}

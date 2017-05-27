import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { DataCollection } from '../shared/api-types/data-collection';
import { SearchHits } from '../shared/api-types/search-hits';

let dataCollectionHomeStyles: string = `
.table td {
  vertical-align: middle;
}
.table td a {
  display: block;
  height: 100%;
  padding: 18px 0;
  vertical-align: middle;
}
`;

@Component({
    templateUrl: './data-collection-home.component.html',
    styles: [ dataCollectionHomeStyles ],
})
export class DataCollectionHomeComponent implements OnInit {
  public constructor(
    private titleService: Title,
    private apiDataCollectionService: ApiDataCollectionService,
  ) { }

  public dcHits: SearchHits<DataCollection>;

  ngOnInit() {
    this.titleService.setTitle('IGSR | data collections');
    this.apiDataCollectionService.getAll()
      .subscribe((l: SearchHits<DataCollection>) => this.dcHits = l);
  }
};

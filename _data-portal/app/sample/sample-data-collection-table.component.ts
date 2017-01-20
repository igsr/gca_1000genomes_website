import { Component, OnInit, Input } from '@angular/core';

import { ApiDataCollectionService} from '../core/services/api-data-collection.service';
import { DataCollectionList } from '../shared/api-types/data-collection-list';
import { DataCollection } from '../shared/api-types/data-collection';
import { ApiHits } from '../shared/api-types/api-hits';

let sampleTableStyles: string = `

table {
  margin-top: 70px;
}

td.matrix-dot {
  color: #DAA406;
  text-align: center;
  font-size: 20px;
  cursor: default;
}

th.matrix-dot {
  width: 70px;
  white-space: nowrap;
  padding: 0;
}
th.matrix-dot > div {
  -ms-transform: translate(100%, 0) rotate(315deg);
  -moz-transform: translate(100%, 0) rotate(315deg);
  -webkit-transform: translate(100%, 0) rotate(315deg);
  -o-transform: translate(100%, 0) rotate(315deg);
  transform: translate(100%, 0) rotate(315deg);

  -ms-transform-origin: left bottom;
  -moz-transform-origin: left bottom;
  -webkit-transform-origin: left bottom;
  -o-transform-origin: left bottom;
  transform-origin: left bottom;

  width: inherit;
}

th.matrix-dot > div >div {
  border-bottom: 1px solid #ccc;
  width: 130px;
  height: 49px;
  line-height: 49px;
}

@media (max-width: 1199px) {
  th.matrix-dot {
    width: 60px;
  }
  th.matrix-dot > div >div {
    height: 42px;
    line-height: 42px;
  }
}

@media (max-width: 991px) {
  table {
    margin-top: 80px;
  }
  th.matrix-dot > div {
    -ms-transform: translate(100%, 0) rotate(270deg);
    -moz-transform: translate(100%, 0) rotate(270deg);
    -webkit-transform: translate(100%, 0) rotate(270deg);
    -o-transform: translate(100%, 0) rotate(270deg);
    transform: translate(100%, 0) rotate(270deg);
  }
  th.matrix-dot {
    width: 55px;
  }
  th.matrix-dot > div >div {
    height: 55px;
    line-height: 55px;
    text-indent: 5px;
  }
}


`;

@Component({
    selector: 'sample-data-collection-table',
    templateUrl: './sample-data-collection-table.component.html',
    styles: [ sampleTableStyles ],
})
export class SampleDataCollectionTableComponent implements OnInit {
  @Input() apiHits: ApiHits;

  constructor(
    private apiDataCollectionService: ApiDataCollectionService,
  ){};
  
  // public properties:
  public dataCollectionList: DataCollectionList;

  ngOnInit() {
    this.apiDataCollectionService.getAll()
      .subscribe((l: DataCollectionList) => this.dataCollectionList = l);
  }

  public hasDataCollection(fields: {[key: string]: string[]}, dc: DataCollection): boolean {
    if (fields['dataCollections.title']) {
      for (let dcTitle of fields['dataCollections.title']) {
        if (dcTitle === dc.title) {
          return true;
        }
      }
    }
    return false;
  }

}

import { Component, OnInit, Input } from '@angular/core';

import { ApiDataCollectionService} from '../core/services/api-data-collection.service';
import { DataCollectionList } from '../shared/api-types/data-collection-list';
import { DataCollection } from '../shared/api-types/data-collection';
import { ApiHits } from '../shared/api-types/api-hits';

let sampleTableStyles: string = `

div.table-container {
  padding-right: 90px;
  padding-top: 70px;
}

td.matrix-dot {
  color: #DAA406;
  text-align: center;
  font-size: 20px;
  cursor: default;
}

th.matrix-dot {
  width: 60px;
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
  height: 42px;
  line-height: 42px;
}

@media (max-width: 991px) {
  div.table-container {
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    position: relative;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    -webkit-overflow-scrolling: touch;
    padding-right: 0px;
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
    selector: 'sample-table',
    templateUrl: './sample-table.component.html',
    styles: [ sampleTableStyles ],
})
export class SampleTableComponent implements OnInit {
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
    for (let dcTitle of fields['dataCollections.title']) {
      if (dcTitle === dc.title) {
        return true;
      }
    }
    return false;
  }

}

import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { ApiDataCollectionService} from '../core/services/api-data-collection.service';
import { DataCollection } from '../shared/api-types/data-collection';
import { SearchHits } from '../shared/api-types/search-hits';
import { Sample } from '../shared/api-types/sample';

let sampleTableStyles: string = `

.capitalize {
  text-transform: capitalize;
}

table {
  margin-top: 70px;
}

div.matrix-dot {
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
  width: 125px;
  height: 49px;
  line-height: 49px;
  cursor: pointer;
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
  @Input() sampleHits: SearchHits<Sample>;
  @Input() filters: {[code: string]: boolean};
  @Output() filtersChange = new EventEmitter<{[code: string]: boolean}>();

  constructor(
    private apiDataCollectionService: ApiDataCollectionService,
  ){};
  
  // public properties:
  public dataCollectionList: SearchHits<DataCollection>;

  ngOnInit() {
    this.apiDataCollectionService.getAll()
      .subscribe((l: SearchHits<DataCollection>) => this.dataCollectionList = l);
  }

  public hasDataCollection(sample: Sample, dc: DataCollection): boolean {
    if (! sample.dataCollections) {
      return false;
    }
    for (let sampleDc of sample.dataCollections) {
      if (sampleDc.title === dc.title) {
        return true;
      }
    }
    return false;
  }

  changeFilter(code: string) {
    this.filters[code] = !this.filters[code];
    this.filtersChange.emit(this.filters);
  }

}

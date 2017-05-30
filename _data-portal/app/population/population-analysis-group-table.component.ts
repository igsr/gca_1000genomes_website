import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { ApiAnalysisGroupService} from '../core/services/api-analysis-group.service';
import { AnalysisGroup } from '../shared/api-types/analysis-group';
import { SearchHit,SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';

let populationTableStyles: string = `

table {
  margin-top: 80px;
}

div.matrix-dot {
  color: #79C7E7;
  text-align: center;
  font-size: 20px;
  cursor: default;
}

th.matrix-dot {
  width: 50px;
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
  height: 35px;
  line-height: 35px;
  cursor: pointer;
}

@media (max-width: 1199px) {
  th.matrix-dot {
    width: 40px;
  }
  th.matrix-dot > div >div {
    height: 28px;
    line-height: 28px;
  }
}

@media (max-width: 991px) {
  table {
    margin-top: 120px;
  }
  th.matrix-dot > div {
    -ms-transform: translate(100%, 0) rotate(270deg);
    -moz-transform: translate(100%, 0) rotate(270deg);
    -webkit-transform: translate(100%, 0) rotate(270deg);
    -o-transform: translate(100%, 0) rotate(270deg);
    transform: translate(100%, 0) rotate(270deg);
  }
  th.matrix-dot {
    width: 30px;
  }
  th.matrix-dot > div >div {
    height: 30px;
    line-height: 30px;
    text-indent: 5px;
  }
}


`;

@Component({
    selector: 'population-analysis-group-table',
    templateUrl: './population-analysis-group-table.component.html',
    styles: [ populationTableStyles ],
})
export class PopulationAnalysisGroupTableComponent implements OnInit {
  @Input() populationHits: SearchHits<Population>;
  @Input() filters: {[code: string]: boolean};
  @Output() filtersChange = new EventEmitter<{[code: string]: boolean}>();

  constructor(
    private apiAnalysisGroupService: ApiAnalysisGroupService,
  ){};
  
  // public properties:
  public analysisGroupList: SearchHits<AnalysisGroup>;

  ngOnInit() {
    this.apiAnalysisGroupService.getAll()
      .subscribe((l: SearchHits<AnalysisGroup>) => this.analysisGroupList = l);
  }

  public hasAnalysisGroup(populationHit: SearchHit<Population>, ag: AnalysisGroup): boolean {
    if (populationHit.fields && populationHit.fields.hasOwnProperty('dataCollections._analysisGroups')) {
      for (let agTitle of populationHit.fields['dataCollections._analysisGroups']) {
        if (agTitle === ag.title) {
          return true;
        }
      }
    }
    return false;
  }

  changeFilter(code: string) {
    this.filters[code] = !this.filters[code];
    this.filtersChange.emit(this.filters);
  }

}

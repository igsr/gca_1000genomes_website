import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { ApiAnalysisGroupService} from '../core/services/api-analysis-group.service';
import { AnalysisGroup } from '../shared/api-types/analysis-group';
import { SearchHit,SearchHits } from '../shared/api-types/search-hits';
import { Sample } from '../shared/api-types/sample';

let sampleTableStyles: string = `

.capitalize {
  text-transform: capitalize;
}

table {
  margin-top: 160px;
}

div.matrix-dot {
  color: #79C7E7;
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

th.matrix-dot > div > div {
  border-bottom: 1px solid #ccc;
  width: 200px;      /* allow longer text */
  height: 48px;
  line-height: 48px;
  cursor: pointer;
  overflow: visible; /* don't clip long labels */
}

@media (max-width: 1199px) {
  th.matrix-dot {
    width: 55px;
  }
  th.matrix-dot > div > div {
    width: 160px;
    height: 40px;
    line-height: 40px;
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
  th.matrix-dot > div > div {
    width: 140px;
    height: 34px;
    line-height: 34px;
    text-indent: 5px;
  }
}

`;

@Component({
    selector: 'sample-analysis-group-table',
    templateUrl: './sample-analysis-group-table.component.html',
    styles: [ sampleTableStyles ],
})
export class SampleAnalysisGroupTableComponent implements OnInit {
  @Input() sampleHits: SearchHits<Sample>;
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

  public hasAnalysisGroup(sampleHit: SearchHit<Sample>, ag: AnalysisGroup): boolean {
    if (sampleHit.fields && sampleHit.fields.hasOwnProperty('dataCollections._analysisGroups')) {
      for (let agTitle of sampleHit.fields['dataCollections._analysisGroups']) {
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
import { Component, OnInit, Input } from '@angular/core';

import { ApiAnalysisGroupService} from '../core/services/api-analysis-group.service';
import { AnalysisGroupList } from '../shared/api-types/analysis-group-list';
import { AnalysisGroup } from '../shared/api-types/analysis-group';
import { ApiHits } from '../shared/api-types/api-hits';

let sampleTableStyles: string = `

table {
  margin-top: 80px;
}

td.matrix-dot {
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
  width: 150px;
  height: 35px;
  line-height: 35px;
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
    selector: 'sample-analysis-group-table',
    templateUrl: './sample-analysis-group-table.component.html',
    styles: [ sampleTableStyles ],
})
export class SampleAnalysisGroupTableComponent implements OnInit {
  @Input() apiHits: ApiHits;

  constructor(
    private apiAnalysisGroupService: ApiAnalysisGroupService,
  ){};
  
  // public properties:
  public analysisGroupList: AnalysisGroupList;

  ngOnInit() {
    this.apiAnalysisGroupService.getAll()
      .subscribe((l: AnalysisGroupList) => this.analysisGroupList = l);
  }

  public hasAnalysisGroup(fields: {[key: string]: string[]}, ag: AnalysisGroup): boolean {
    if (fields['dataCollections._analysisGroups']) {
      for (let agTitle of fields['dataCollections._analysisGroups']) {
        if (agTitle === ag.title) {
          return true;
        }
      }
    }
    return false;
  }

}

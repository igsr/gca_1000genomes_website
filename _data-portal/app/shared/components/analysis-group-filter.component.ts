import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiAnalysisGroupService} from '../../core/services/api-analysis-group.service';
import { SearchHits } from  '../api-types/search-hits';
import { AnalysisGroup } from  '../api-types/analysis-group';
import { FilterSelectionChange } from '../filter-builder-base';

let agFilterStyles: string = `
  div.panel {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  div.checkbox {
    width: 50%;
    display: inline-block;
    margin: 2px 0;
  }
`;

@Component({
    selector: 'analysis-group-filter',
    templateUrl: './analysis-group-filter.component.html',
    styles: [ agFilterStyles ],
})
export class AnalysisGroupFilterComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() filters: {[code: string]: boolean};
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filtersChange = new EventEmitter<FilterSelectionChange>();


  constructor(
    private apiAnalysisGroupService: ApiAnalysisGroupService,
  ){};
  
  // public properties:
  public agList: SearchHits<AnalysisGroup>;

  // private properties:
  private agListSubscription: Subscription = null;

  ngOnInit() {
    this.agListSubscription = this.apiAnalysisGroupService.getAll()
      .subscribe((h: SearchHits<AnalysisGroup>) => this.agList = h);
  }

  ngOnDestroy() {
    if (this.agListSubscription) {
      this.agListSubscription.unsubscribe();
    }
  }

  changeFilter(code: string, isFiltered: boolean) {
    this.filters[code] = isFiltered;
    this.filtersChange.emit({ filters: this.filters, code, isFiltered });
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

import { Component, EventEmitter, OnChanges, Input, Output, SimpleChange } from '@angular/core';
import { DataCollection } from '../api-types/data-collection';

let selectDcTabsStyles: string = `

@media (min-width: 600px) {
  .flex-nav {
    display: table;
    width: 100%;
  }
  .flex-nav ul.nav::before, .flex-nav ul.nav::after {
    display: none;
  }
  .flex-nav ul.nav {
    display: table-row;
  }
  .flex-nav ul.nav > li {
    height: 100%;
    display: table-cell;
    width: 1px;
    vertical-align: middle;
    text-align: center;
  }
}

li > a {
  border: 1px solid transparent;
}

li.active > a {
  color: #555;
  cursor: default;
  border-color: #ddd;
}
li.active > a:hover {
  background-color: transparent;
}

`;

@Component({
    selector: 'select-dc-tabs',
    templateUrl: './select-dc-tabs.component.html',
    styles: [ selectDcTabsStyles ],
})
export class SelectDcTabsComponent implements OnChanges {
  @Input() dataCollections: DataCollection[];
  @Output() selection = new EventEmitter<DataCollection>();

  public selected: DataCollection;
  

  ngOnChanges(changes: {dataCollections?: SimpleChange}) {
    if (changes.dataCollections) {
      if (!this.dataCollections || this.dataCollections.length == 0) {
        return this.setSelected(null);
      }
      return this.setSelected(this.dataCollections[0]);
    }
  }

  setSelected(dc: DataCollection) {
    this.selected = dc;
    this.selection.emit(dc);
  }

}

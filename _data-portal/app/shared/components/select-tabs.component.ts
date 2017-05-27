import { Component, EventEmitter, OnChanges, Input, Output, SimpleChange } from '@angular/core';

let selectTabsStyles: string = `

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
    selector: 'select-tabs',
    templateUrl: './select-tabs.component.html',
    styles: [ selectTabsStyles ],
})
export class SelectTabsComponent implements OnChanges {
  @Input() opts: string[];
  @Output() selection = new EventEmitter<number>();

  public selected: number;
  

  ngOnChanges(changes: {opts?: SimpleChange}) {
    if (changes.opts) {
      this.setSelected(0);
    }
  }

  setSelected(i: number) {
    this.selected = i;
    this.selection.emit(this.selected);
  }

}

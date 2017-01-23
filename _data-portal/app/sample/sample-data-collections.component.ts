import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

import { Sample } from '../shared/api-types/sample';

let sampleDataCollectionStyles: string = `

ul.nav.nav-tabs.nav-justified > li > a {
  height: 60px;
}

a[role="button"] {
  cursor: pointer;
}

`;

@Component({
    templateUrl: './sample-data-collections.component.html',
    selector: 'sample-data-collections',
    styles: [ sampleDataCollectionStyles ],
})
export class SampleDataCollectionsComponent implements OnChanges {
  @Input() sample: Sample;

  currentDC: Object = null;

  ngOnChanges(changes: SimpleChanges) {
    this.currentDC = this.sample.dataCollections && this.sample.dataCollections.length > 0
              ? this.sample.dataCollections[0] : null;
  }

};

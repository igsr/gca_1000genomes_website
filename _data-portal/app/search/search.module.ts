import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SearchResultsComponent }  from './search-results.component';
import { SearchSamplesComponent }  from './search-samples.component';
import { SearchPopulationsComponent }  from './search-populations.component';
import { SearchDataCollectionsComponent }  from './search-data-collections.component';
import { SearchFilesComponent }  from './search-files.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    SearchResultsComponent,
    SearchSamplesComponent,
    SearchFilesComponent,
    SearchPopulationsComponent,
    SearchDataCollectionsComponent,
  ],
})
export class SearchModule { };

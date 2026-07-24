import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule }  from './core/core.module';
import { SharedModule }  from './shared/shared.module';
import { SampleHomeComponent } from './sample/sample-home.component';
import { SampleDetailComponent } from './sample/sample-detail.component';
import { SampleDataCollectionTableComponent } from './sample/sample-data-collection-table.component';
import { SampleAnalysisGroupTableComponent } from './sample/sample-analysis-group-table.component';
import { PopulationHomeComponent } from './population/population-home.component';
import { PopulationDetailComponent } from './population/population-detail.component';
import { PopulationSamplesComponent } from './population/population-samples.component';
import { PopulationDataCollectionTableComponent } from './population/population-data-collection-table.component';
import { PopulationAnalysisGroupTableComponent } from './population/population-analysis-group-table.component';
import { DataCollectionHomeComponent } from './data-collection/data-collection-home.component';
import { DataCollectionDetailComponent } from './data-collection/data-collection-detail.component';
import { DcSamplesComponent } from './data-collection/dc-samples.component';
import { DcPopulationsComponent } from './data-collection/dc-populations.component';
import { SearchResultsComponent } from './search/search-results.component';
import { SearchSamplesComponent } from './search/search-samples.component';
import { SearchPopulationsComponent } from './search/search-populations.component';
import { SearchDataCollectionsComponent } from './search/search-data-collections.component';
import { SearchFilesComponent } from './search/search-files.component';
import { SearchSitemapComponent } from './search/search-sitemap.component';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    SampleHomeComponent,
    SampleDetailComponent,
    SampleDataCollectionTableComponent,
    SampleAnalysisGroupTableComponent,
    PopulationHomeComponent,
    PopulationDetailComponent,
    PopulationSamplesComponent,
    PopulationDataCollectionTableComponent,
    PopulationAnalysisGroupTableComponent,
    DataCollectionHomeComponent,
    DataCollectionDetailComponent,
    DcSamplesComponent,
    DcPopulationsComponent,
    SearchResultsComponent,
    SearchSamplesComponent,
    SearchFilesComponent,
    SearchSitemapComponent,
    SearchPopulationsComponent,
    SearchDataCollectionsComponent,
  ],
  providers: [ Title ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

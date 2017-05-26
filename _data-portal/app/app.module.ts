import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';

import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule }  from './core/core.module';
import { SharedModule }  from './shared/shared.module';
import { SampleModule } from './sample/sample.module';
import { PopulationModule } from './population/population.module';
import { DataCollectionModule } from './data-collection/data-collection.module';
import { SearchModule } from './search/search.module';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    AppRoutingModule,
    SharedModule,
    SampleModule,
    PopulationModule,
    DataCollectionModule,
    SearchModule
  ],
  declarations: [ AppComponent ],
  providers: [ Title ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

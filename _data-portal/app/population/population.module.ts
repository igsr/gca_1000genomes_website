import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PopulationDetailComponent }  from './population-detail.component';
import { PopulationSamplesComponent }  from './population-samples.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    PopulationDetailComponent,
    PopulationSamplesComponent,
  ],
})
export class PopulationModule { };

import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PopulationDetailComponent }  from './population-detail.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    PopulationDetailComponent,
  ],
})
export class PopulationModule { };

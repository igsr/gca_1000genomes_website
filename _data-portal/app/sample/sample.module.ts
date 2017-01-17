import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SampleHomeComponent }  from './sample-home.component';
import { SampleTableComponent }  from './sample-table.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    SampleHomeComponent,
    SampleTableComponent,
  ],
})
export class SampleModule { };

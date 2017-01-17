import { NgModule, ModuleWithProviders, Optional, SkipSelf }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './components/home.component';
import { NavComponent } from './components/nav.component';

@NgModule({
  imports: [ SharedModule, CommonModule, HttpModule ],
  declarations: [ HomeComponent, NavComponent ],
  exports: [ NavComponent ],
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only')
    }
  }
}

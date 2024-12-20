import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureSnakeMasterComponent } from './feature-snake-master/feature-snake-master.component';


@NgModule({
  declarations: [FeatureSnakeMasterComponent],
  exports: [FeatureSnakeMasterComponent],
  imports: [
    CommonModule
  ],
  providers: [],
  bootstrap: [],
})
export class FeatureSnakeMasterModule { }

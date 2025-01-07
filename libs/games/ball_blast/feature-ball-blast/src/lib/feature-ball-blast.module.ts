import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureBallBlastComponent } from './feature-ball-blast/feature-ball-blast.component';


@NgModule({
  declarations: [FeatureBallBlastComponent],
  exports: [FeatureBallBlastComponent],
  imports: [
    CommonModule
  ],
  providers: [],
  bootstrap: [],
})
export class FeatureBallBlastModule { }

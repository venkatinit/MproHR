import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';  
import { NumberDirective } from './numbers-only.directive';
import { SaveButtonComponent } from './save-button/save-button.component';



@NgModule({
  declarations: [SaveButtonComponent,NumberDirective],
  imports: [CommonModule],
  exports: [SaveButtonComponent,NumberDirective]
})
export class SharedModule { }

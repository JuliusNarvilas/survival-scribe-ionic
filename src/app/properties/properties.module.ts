import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyEnumDisplayComponent } from './property.enum.display';
import { PropertyEnumEditComponent } from './property.enum.edit';
import { PropertyStringDisplayComponent } from './property.string.display';
import { PropertyStringEditComponent } from './property.string.edit';
import { PropertyDynamicComponent } from './property.dynamic';
import { DigitOnlyDirective } from './shared/digit.directive';
import { PropertyFloatDisplayComponent } from './numberComponents/property.float.display';
import { PropertyFloatEditComponent } from './numberComponents/property.float.edit';
import { PropertyIntDisplayComponent } from './numberComponents/property.int.display';
import { PropertyIntEditComponent } from './numberComponents/property.int.edit';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
    // RouterModule.forChild([{ path: '', component: Tab3Page }])
  ],
  declarations: [
    PropertyEnumDisplayComponent, PropertyEnumEditComponent, PropertyFloatDisplayComponent, PropertyFloatEditComponent,
    PropertyIntDisplayComponent, PropertyIntEditComponent, PropertyStringDisplayComponent, PropertyStringEditComponent,
    PropertyDynamicComponent, DigitOnlyDirective
  ],
  exports: [ PropertyIntEditComponent, PropertyDynamicComponent, DigitOnlyDirective ]
})

export class PropertiesModule {}

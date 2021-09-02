import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { PropertyDynamicComponent } from 'src/app/properties/property.dynamic';
import { PropertiesModule } from 'src/app/properties/properties.module';
import { PropertyIntEditComponent } from 'src/app/properties/numberComponents/property.int.edit';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    PropertiesModule,
  ],
  declarations: [Tab1Page],
  entryComponents: [
    PropertyDynamicComponent,
    PropertyIntEditComponent
  ]
})
export class Tab1PageModule {}

import { Component } from '@angular/core';
import { FloatProperty, PropertyComponent } from '../properties.app';

@Component({
  selector: 'app-tab3',
  templateUrl: 'property.float.edit.html',
  styleUrls: ['../properties.shared.scss']
})
export class PropertyFloatEditComponent extends PropertyComponent {
  val: number;
  numProperty: FloatProperty;

  constructor() {
    super();

    this.val = 0;
    this.numProperty = undefined;
  }

  setData(data: any) {
    if (data instanceof FloatProperty)
    {
      this.numProperty = (data as FloatProperty);
      this.val = this.numProperty.getValue();
    }
  }

}

import { Component } from '@angular/core';
import { IntProperty, PropertyComponent } from '../properties.app';

@Component({
  selector: 'app-property-int-display',
  templateUrl: 'property.int.display.html',
  styleUrls: ['../properties.shared.scss']
})
export class PropertyIntDisplayComponent  extends PropertyComponent {
  val: number;
  numProperty: IntProperty;

  constructor() {
    super();

    this.val = 0;
    this.numProperty = undefined;
  }

  setData(data: any) {
    if (data instanceof IntProperty)
    {
      this.numProperty = (data as IntProperty);
      this.val = this.numProperty.getValue();
    } else {
      let dataClassName = '[unknown]';
      if (data.constructor)
      {
        dataClassName = data.constructor.name;
      }
      console.log('PropertyIntEditComponent::SetValue was given incompatible data ' + dataClassName);
    }
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'property.enum.edit.html',
  styleUrls: ['properties.shared.scss']
})
export class PropertyEnumEditComponent {
  val: string;
  typeName: string;
  typeValues: string[];
  // aditional information
  description: string;
  sets: string[];

  constructor() {
    this.typeValues = [];
  }

}

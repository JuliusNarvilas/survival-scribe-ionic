import { Component, Injectable, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'property.enum.display.html',
  styleUrls: ['properties.shared.scss']
})

export class PropertyEnumDisplayComponent implements AfterContentInit {
  val: string;
  typeName: string;
  description: string;
  sets: string[];


  constructor() {
  }

  ngAfterContentInit(): void {
  }
}

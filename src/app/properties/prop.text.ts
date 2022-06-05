import { AnyProperty } from 'src/app/properties/shared/prop.shared';

export class TextContainerProperty extends AnyProperty {
  public data: string[] = [];

  getValueAsString(): string {
    let result = this.info.label + ' : [';
    let loopCounter = 0;
    for (const entityData of this.data) {
      if (++loopCounter < this.data.length) {
        result += entityData + ', ';
      } else {
        result += entityData;
      }
    }
    result += ']';
    return result;
  }
}


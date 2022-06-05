import { AnyProperty } from 'src/app/properties/shared/prop.shared';

export abstract class EnumValue {
  key = '';
  label = '';
  description = '';
  tags: string[] = [];
}


export class EnumType {
  key = '';
  label = '';
  description = '';
  values: EnumValue[] = [];
  valueSources: { name: string; source: string }[] = [];
}


export class EnumRef {
  type: EnumType;
  value: EnumValue;
}

export class EnumRefData {
  typeKey = '';
  valueKey = '';
}


/**
 * Representation of an enum type that can create data driven enum values.
 */
class EnumTypeManager {
  private static readonly allFactories: Map<string, EnumType> = new Map();

  public static getType(enumTypeName: string): EnumType {
    if (enumTypeName) {
      return EnumTypeManager.allFactories.get(enumTypeName);
    }
    return undefined;
  }

  public static addType(value: EnumType) {
    if (value && value.key) {
      EnumTypeManager.allFactories.set(value.key, value);
    }
  }
}


export class EnumContainerProperty extends AnyProperty {
  data: EnumRef[];

  constructor(data: EnumRef[] = []) {
    super();
    this.data = data;
  }

  getValueAsString(): string {
    let result = this.info.label + ' : [';
    let loopCounter = 0;
    for (const enumData of this.data) {
      if (++loopCounter < this.data.length) {
        result += enumData.value.label + ', ';
      } else {
        result += enumData.value.label;
      }
    }
    result += ']';
    return result;
  }
}

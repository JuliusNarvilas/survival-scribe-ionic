import { EnumValueDefinition } from 'src/app/models/models.enum.definition';
import { AnyProperty } from './properties.shared';

/**
 * Class for representing an enum value that can be data driven.
 */
class EnumData {
  readonly value: EnumValueDefinition;
  readonly enumType: EnumType;

  constructor(enumType: EnumType, valueData: EnumValueDefinition) {
    this.value = valueData;
    this.enumType = enumType;
  }
}

/**
 * Representation of an enum type that can create data driven enum values.
 */
class EnumType {
  private static readonly allFactories: Map<string, EnumType> = new Map();

  key: string;
  label: string;
  description: string;
  values: EnumData[] = [];

  constructor(enumTypeKey: string) {
    this.key = enumTypeKey;
  }

  public static getFactory(enumTypeName: string): EnumType {
    if (enumTypeName) {
      return EnumType.allFactories.get(enumTypeName);
    }
    return undefined;
  }

  public static addFactory(value: EnumType) {
    if (value && value.key) {
      EnumType.allFactories.set(value.key, value);
    }
  }
}


export class EnumContainerProperty extends AnyProperty {
  data: EnumData[];

  constructor(data: EnumData[] = []) {
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

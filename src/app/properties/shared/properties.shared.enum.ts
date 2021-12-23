import { AnyProperty } from './properties.shared';
import { EnumValueDefinition } from 'src/app/models/models.definitions';

/**
 * Class for representing an enum value that can be data driven.
 */
class EnumPropertyData {
  readonly value: EnumValueDefinition;
  readonly enumType: EnumPropertyDataType;

  constructor(enumType: EnumPropertyDataType, valueData: EnumValueDefinition) {
    this.value = valueData;
    this.enumType = enumType;
  }
}

/**
 * Representation of an enum type that can create data driven enum values.
 */
class EnumPropertyDataType {
  private static readonly allFactories: Map<string, EnumPropertyDataType> = new Map();

  key: string;
  label: string;
  description: string;
  values: EnumPropertyData[] = [];

  constructor(enumTypeKey: string) {
    this.key = enumTypeKey;
  }

  public static getFactory(enumTypeName: string): EnumPropertyDataType {
    if (enumTypeName) {
      return EnumPropertyDataType.allFactories.get(enumTypeName);
    }
    return undefined;
  }

  public static addFactory(value: EnumPropertyDataType) {
    if (value && value.key) {
      EnumPropertyDataType.allFactories.set(value.key, value);
    }
  }
}


export class EnumProperty extends AnyProperty {
  data: EnumPropertyData;

  constructor(data: EnumPropertyData) {
    super();
    this.data = data;
  }

  getValueAsString(): string {
    if (this.data) {
      return this.data.value.label;
    }
    return '?';
  }
}

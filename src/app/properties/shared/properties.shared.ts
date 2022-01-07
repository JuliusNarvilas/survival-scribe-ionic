import { Entity } from "src/app/entity/entity.shared";
import { PropertyDefinition } from "src/app/models/models.property.definition";

export enum EPropertyCompType {
    unknown,
    bool,
    int,
    intRanged,
    intReserve,
    float,
    floatRanged,
    floatReserve,
    enum,
    text,
    entity
}

/*
export class EPropertyCompTypeString {
    private static readonly enumMapping = {
        int: EPropertyCompType.int,
        intReserve: EPropertyCompType.intReserve,
        intRanged: EPropertyCompType.intRanged,
        float: EPropertyCompType.float,
        floatRanged: EPropertyCompType.floatRanged,
        floatReserve: EPropertyCompType.floatReserve,
        enum: EPropertyCompType.enum,
        enumCollection: EPropertyCompType.EnumCollection,
        String: EPropertyCompType.String,
        StringCollection: EPropertyCompType.StringCollection,
        Bool: EPropertyCompType.Bool,
        BoolCollection: EPropertyCompType.BoolCollection
    };
    public static getEnum(enumString: string): EPropertyCompType {
        const result = EPropertyCompTypeString.enumMapping[enumString];
        if (result === undefined) {
            return EPropertyCompType.unknown;
        }
        return result;
    }

    public static getStr(val: EPropertyCompType): string {
        for (const mappingFieldName in EPropertyCompTypeString.enumMapping) {
            if (EPropertyCompTypeString.enumMapping[mappingFieldName] === val) {
                return mappingFieldName;
            }
        }

        return undefined;
    }
}
*/


export abstract class AnyProperty {
  info: PropertyDefinition;
  typeMetadata: number = EPropertyCompType.unknown;

  abstract getValueAsString(): string;
}

export class EntityContainerProperty extends AnyProperty {
  public data: Entity[] = [];

  getValueAsString(): string {
    let result = this.info.label + ' : [';
    let loopCounter = 0;
    for (const entityData of this.data) {
      if (++loopCounter < this.data.length) {
        result += entityData.name + ', ';
      } else {
        result += entityData.name;
      }
    }
    result += ']';
    return result;
  }
}


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


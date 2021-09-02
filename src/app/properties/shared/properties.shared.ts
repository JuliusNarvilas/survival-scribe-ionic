
export enum EPropertyCompType {
    Unknown,
    Int,
    IntCollection,
    IntExhaustible,
    IntExhaustibleCollection,
    Float,
    FloatCollection,
    FloatExhaustible,
    FloatExhaustibleCollection,
    Enum,
    EnumCollection,
    String,
    StringCollection,
    Bool,
    BoolCollection,
    AnyCollection,
}

export class EPropertyCompTypeString {
    private static readonly enumMapping = {
        Int: EPropertyCompType.Int,
        IntExhaustible: EPropertyCompType.IntExhaustible,
        IntCollection: EPropertyCompType.IntCollection,
        IntExhaustibleCollection: EPropertyCompType.FloatExhaustibleCollection,
        Float: EPropertyCompType.Float,
        FloatCollection: EPropertyCompType.FloatCollection,
        FloatExhaustible: EPropertyCompType.FloatExhaustible,
        FloatExhaustibleCollection: EPropertyCompType.FloatExhaustibleCollection,
        Enum: EPropertyCompType.Enum,
        EnumCollection: EPropertyCompType.EnumCollection,
        String: EPropertyCompType.String,
        StringCollection: EPropertyCompType.StringCollection,
        Bool: EPropertyCompType.Bool,
        BoolCollection: EPropertyCompType.BoolCollection
    };
    public static getEnum(enumString: string): EPropertyCompType {
        const result = EPropertyCompTypeString.enumMapping[enumString];
        if (result === undefined) {
            return EPropertyCompType.Unknown;
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


export abstract class AnyProperty {
    typeMetadata: number = EPropertyCompType.Unknown;

    abstract getValueAsString(): string;
}

export class CollectionProperty extends AnyProperty{
    private items: AnyProperty[] = [];


    constructor() {
        super();
        this.typeMetadata = EPropertyCompType.AnyCollection;
    }

    getValueAsString(): string {
        return JSON.stringify(this.items);
    }
}

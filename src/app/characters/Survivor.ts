
import { v4 as uuidv4 } from 'uuid';


class LoosePropertyInfo {
    public readonly name: string;
    public readonly defaultValue: any;

    constructor(name: string, defaultVal: any) {
        this.name = name;
        this.defaultValue = defaultVal;
    }
}

class LoosePropertyData {
    public name: string;
    public value: any;

    constructor(name: string, val: any) {
        this.name = name;
        this.value = val;
    }
}

class EnumPropertyData {
    public name: string;
    public sets: string[];
}

class EnumValData {
    val: string;
    typeName: string;
    description: string;
    sets: string[];
}

class EnumTypeData {
    name: string;
    values: EnumValData[];
}


export class SurvivorGender {
    public static readonly Unknown  = 'Unknows';
    public static readonly Male     = 'Male';
    public static readonly Female   = 'Female';
}

export class SurvivorLifeState {
    public static readonly Unknown  = 'Unknows';
    public static readonly Active   = 'Active';
    public static readonly Retired  = 'Retired';
    public static readonly Dead     = 'Dead';
}

export class SurvivorProperties {
    private static survivorPropertyInfoDB: Map<string, LoosePropertyInfo> = new Map();
    private static survivorPropertyArray: LoosePropertyInfo[] = [];

    // stats
    public static readonly Survival = new LoosePropertyInfo('Survival', 0);
    public static readonly Movement = new LoosePropertyInfo('Movement', 5);
    public static readonly Accuracy = new LoosePropertyInfo('Accuracy', 0);
    public static readonly Strength = new LoosePropertyInfo('Strength', 0);
    public static readonly Evasion  = new LoosePropertyInfo('Evasion', 0);
    public static readonly Luck     = new LoosePropertyInfo('Luck', 0);
    public static readonly Speed    = new LoosePropertyInfo('Speed', 0);
    public static readonly Insanity = new LoosePropertyInfo('Insanity', 0);
    // armor
    public static readonly ArmorHead = new LoosePropertyInfo('ArmorHead', 0);
    public static readonly ArmorArms = new LoosePropertyInfo('ArmorArms', 0);
    public static readonly ArmorBody = new LoosePropertyInfo('ArmorBody', 0);
    public static readonly ArmorWaist = new LoosePropertyInfo('ArmorWaist', 0);
    public static readonly ArmorLegs = new LoosePropertyInfo('ArmorLegs', 0);
    // other
    public static readonly HuntXp               = new LoosePropertyInfo('HuntXp', 0);
    public static readonly WeaponXp             = new LoosePropertyInfo('WeaponXp', 0);
    public static readonly SkipNextHunt         = new LoosePropertyInfo('SkipNextHunt', 0);
    public static readonly LifeState            = new LoosePropertyInfo('LifeState', SurvivorLifeState.Unknown);
    public static readonly WeaponProficiency    = new LoosePropertyInfo('WeaponProficiency', '');
    public static readonly WeaponType           = new LoosePropertyInfo('WeaponType', '');
    public static readonly CanSpendSurvival     = new LoosePropertyInfo('CanSpendSurvival', true);
    public static readonly Courage              = new LoosePropertyInfo('Courage', 0);
    public static readonly Understanding        = new LoosePropertyInfo('Understanding', 0);
    public static readonly AbilitiesAndImpairments = new LoosePropertyInfo('AbilitiesAndImpairments', []);

    public static readonly BuiltInProperties = [
        SurvivorProperties.Survival, SurvivorProperties.Movement, SurvivorProperties.Accuracy,
        SurvivorProperties.Strength, SurvivorProperties.Evasion, SurvivorProperties.Luck, SurvivorProperties.Speed,
        SurvivorProperties.Insanity, SurvivorProperties.ArmorHead, SurvivorProperties.ArmorArms,
        SurvivorProperties.ArmorBody, SurvivorProperties.ArmorWaist, SurvivorProperties.ArmorLegs,
        SurvivorProperties.HuntXp, SurvivorProperties.WeaponXp, SurvivorProperties.SkipNextHunt,
        SurvivorProperties.LifeState, SurvivorProperties.WeaponProficiency, SurvivorProperties.WeaponType,
        SurvivorProperties.CanSpendSurvival, SurvivorProperties.Courage, SurvivorProperties.Understanding,
        SurvivorProperties.AbilitiesAndImpairments
    ];

    public static addData(data: LoosePropertyInfo[] ): void {
        for (const info of data) {
            SurvivorProperties.survivorPropertyInfoDB.set(info.name, new LoosePropertyInfo(info.name, info.defaultValue));
        }
    }

    public static initialise(): void {
        for (const info of SurvivorProperties.BuiltInProperties) {
            const existingRecord = SurvivorProperties.survivorPropertyInfoDB.get(info.name);
            if (typeof existingRecord === 'undefined') {
                SurvivorProperties.survivorPropertyInfoDB.set(info.name, new LoosePropertyInfo(info.name, info.defaultValue));
            }
        }

        SurvivorProperties.survivorPropertyArray = Array.from(SurvivorProperties.survivorPropertyInfoDB.values());
    }

    public static getAllInfo(): LoosePropertyInfo[] {
        return SurvivorProperties.survivorPropertyArray;
    }
    public static getInfoDefaultValue(key: string): any {
        return SurvivorProperties.survivorPropertyInfoDB.get(key);
    }
}

export class Survivor {
    Id: string;
    Name: string;
    Gender: string;
    Age: number;

    Parents: string[];

    constructor() {
        this.Id = uuidv4();
        this.Name = '';
        this.Gender = SurvivorGender.Unknown;
        this.Parents = [];
    }
}


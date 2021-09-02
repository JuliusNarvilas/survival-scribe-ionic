import { v4 as uuidv4 } from 'uuid';
import { CharacterDefinition } from '../characters/characters.shared';
import { Papa } from '../libs/papaparse/papaparse';
import { EPropertyCompType, EPropertyCompTypeString } from '../properties/shared/properties.shared';
import { AppIOService } from '../shared/AppIOService';
import { EnumTypeDefinition, PropertyGroupsDefinition } from './models.definitions';

export class DefaultDefinitions {
    public static readonly genderDefinitionPath = 'definitions/en/enum/gender.json';
    public static readonly genderDefinition: EnumTypeDefinition = {
        key: 'Gender',
        label: 'Gender',
        description: 'Gender',
        values: [
            { key: 'Unknown', label: 'Unknown', description: 'Unknown gender', tags: [] },
            { key: 'Male', label: 'Male', description: 'Male gender', tags: [] },
            { key: 'Female', label: 'Female', description: 'Female gender', tags: [] }
        ],
        valueSources: [ { name: 'values', source: 'genderValues.csv' } ]
    };

    public static readonly lifeStateDefinitionPath = 'definitions/en/enum/lifeState.json';
    public static readonly lifeStateDefinition: EnumTypeDefinition = {
        key: 'LifeState',
        label: 'Life State',
        description: 'Life state',
        values: [
            { key: 'Unknown', label: 'Unknown', description: 'Unknown life state', tags: [] },
            { key: 'Active', label: 'Active', description: 'Character is active', tags: [] },
            { key: 'Retired', label: 'Retired', description: 'Character is etired', tags: [] },
            { key: 'Dead', label: 'Dead', description: 'Character is dead', tags: [] }
        ],
        valueSources: [ { name: 'values', source: 'lifeStateValues.csv' } ]
    };

    public static readonly courageAbilityDefinitionPath = 'definitions/en/enum/courageAbility.json';
    public static readonly courageAbilityDefinition: EnumTypeDefinition = {
        key: 'CourageAbility',
        label: 'Courage Ability',
        description: 'Courage ability',
        values: [
            { key: 'Unknown', label: 'Unknown', tags: [], description: 'Unknown life state'},
            { key: 'Stalwart', label: 'Stalwart', tags: ['ability'], description:
`Stalwart ability:
Ignore being knocked down by brain trauma and intimidate actions.` },
            { key: 'Prepared', label: 'Prepared', tags: ['ability'], description:
`Prepared ability:
When rolling to determine a straggler, add your hunt experience to your roll result.` },
            { key: 'Matchmaker', label: 'Matchmaker', tags: ['ability'], description:
`Matchmaker ability:
When you are a returning survivor, once per lantern year, you may spend <img name="endeavor"/> to <img name="book"/> Intimacy.` }
        ],
        valueSources: [ { name: 'values', source: 'courageAbilityValues.csv' } ]
    };

    public static readonly understandingAbilityDefinitionPath = 'definitions/en/enum/understandingAbility.json';
    public static readonly understandingAbilityDefinition: EnumTypeDefinition = {
        key: 'UnderstandingAbility',
        label: 'Understanding Ability',
        description: 'Understanding ability',
        values: [
            { key: 'Unknown', label: 'Unknown', tags: [], description: 'Unknown life state'},
            { key: 'Analyze', label: 'Analyze', tags: ['ability'], description:
`Analyze ability:
At the start of the survivors' turn, if you are adjacent to the monster, reveal the top AI card, then place it back on top of the deck.` },
            { key: 'Explore', label: 'Explore', tags: ['ability'], description:
`Explore ability:
When you roll on an investigate table, add +2 to your roll result.` },
            { key: 'Tinker', label: 'Tinker', tags: ['ability'], description:
`Tinker ability:
When you are a returning survivor, gain +1 <img name="endeavor"/> to use this settlement phase.` }
        ],
        valueSources: [ { name: 'values', source: 'understandingAbilityValues.csv' } ]
    };

    public static readonly weaponProficiencyDefinitionPath = 'definitions/en/enum/weaponProficiency.json';
    public static readonly weaponProficiencyDefinition: EnumTypeDefinition = {
        key: 'WeaponProficiencyType',
        label: 'Weapon Proficiency Type',
        description: 'Weapon proficiency type',
        values: [
            { key: 'Unknown', label: 'Unknown', tags: [], description: 'No weapon proficiency selected' },
            { key: 'Axe', label: 'Axe', tags: [], description:
`Axe weapon proficiency.
Specialization:
When attacking with an axe, if your wound attempt fails, you may ignore it and attempt to wound the selected hit location again.
Limit, once per attack.
Mastery:
When an Axe Master wounds a monster with an axe at a location with a persistent injury, that wound becomes a critical wound.
All survivors gain Axe Specialization in addition to their other weapon proficiencies.`
            },
            { key: 'Bow', label: 'Bow', tags: [], description:
`Bow weapon proficiency.
Specialization:
When attacking with a bow, you may reroll any misses once.
Limit, once per attack.
Mastery:
If you are a Bow Master, all bows in your gear grid gain Deadly 2. In addition, ignore cumbersome on all bows.
All survivors gain Bow Specialization in addition to their other weapon proficiencies.` },
            { key: 'Club', label: 'Club', tags: [], description:
`Club weapon proficiency.
Specialization:
When attacking with a club, on a Perfect hit, double your wound attempt total on the first selected hit location.
Limit, once per attack.
Mastery:
When a Club Master attacks with a club, if a successful wound attempt total is greater than or equal to twice the monster's toughness, inflict an additional wound.
All survivors gain Club Specialization in addition to their other weapon proficiencies.` }
        ],
        valueSources: [ { name: 'values', source: 'weaponProficiencyValues.csv' } ]
    };

    public static readonly groupsDefinitionPath = 'definitions/en/groups.json';
    public static readonly groupsDefinition: PropertyGroupsDefinition = {
        groups: [
            { key: 'CharStats', label: 'Stats', description: 'Character statistics',  order: 100 },
            { key: 'CharArmor', label: 'Armor', description: 'Character armor',  order: 100 },
            { key: 'CharWeapon', label: 'Weapon Proficiency', description: 'Character weapon proficiency data',  order: 100 },
            { key: 'CharMentalStats', label: 'Mental Stats', description: 'Character mental statistics',  order: 100 },
        ],
        valueSources: [ { name: 'groupds', source: 'groupsValues.csv' } ]
    };

    public static readonly characterDefinitionPath = 'definitions/en/character.json';
    public static readonly characterDefinition: CharacterDefinition = {
        properties: [
            // Stats
            {
                key: 'CannotSpendGainSurvival', label: 'Cannot Spend or Gain Survival', description: 'Cannot spend or gain survival',
                order: 100, viewImportance: 10, componentType: 'Bool',
                defaultVal: 'false', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'Survival', label: 'Survival', description: 'Survival',
                order: 100, viewImportance: 10, componentType: 'IntExhaustible',
                defaultVal: '0/1', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'SurvivalAbilities', label: 'Survival Abilities', description: 'Survival abilities',
                order: 100, viewImportance: 10, componentType: 'EnumCollection',
                defaultVal: '', metadata: '{ enumTypes: \'SurvivalAbility\' allowDuplicates: \'false\' }', groupKey: 'CharStats'
            },
            {
                key: 'Movement', label: 'Movement', description: 'Movement',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '5', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'Accuracy', label: 'Accuracy', description: 'Accuracy',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'Strength', label: 'Strength', description: 'Strength',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'Evasion', label: 'Evasion', description: 'Evasion',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'Luck', label: 'Luck', description: 'Luck',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'Speed', label: 'Speed', description: 'Speed',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharStats'
            },

            // Armor
            {
                key: 'Insanity', label: 'Insanity', description: 'Insanity',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharStats'
            },
            {
                key: 'ArmorHead', label: 'Head', description: 'Head armor',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharArmor'
            },
            {
                key: 'ArmorArms', label: 'Arms', description: 'Arms armor',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharArmor'
            },
            {
                key: 'ArmorBody', label: 'Body', description: 'Body armor',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharArmor'
            },
            {
                key: 'ArmorWaist', label: 'Waist', description: 'Waist armor',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharArmor'
            },
            {
                key: 'ArmorLegs', label: 'Legs', description: 'Legs armor',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: 'CharArmor'
            },

            // Mental Stats
            {
                key: 'Courage', label: 'Courage', description: 'Courage',
                order: 100, viewImportance: 10, componentType: 'IntExhaustible',
                defaultVal: '0/9', metadata: '', groupKey: 'CharMentalStats'
            },
            {
                key: 'CourageAbility', label: 'Courage Ability', description: 'Courage ability',
                order: 100, viewImportance: 10, componentType: 'Enum',
                defaultVal: 'CourageAbility/Unknown', metadata: '', groupKey: 'CharMentalStats'
            },
            {
                key: 'Understanding', label: 'Understanding Ability', description: 'Understanding ability',
                order: 100, viewImportance: 10, componentType: 'Enum',
                defaultVal: '0/9', metadata: '', groupKey: 'CharMentalStats'
            },
            {
                key: 'UnderstandingAbility', label: 'Understanding Ability', description: 'Understanding ability',
                order: 100, viewImportance: 10, componentType: 'Enum',
                defaultVal: 'UnderstandingAbility/Unknown', metadata: '', groupKey: 'CharMentalStats'
            },

            // Weapon proficiency
            {
                key: 'WeaponXp', label: 'WeaponXp', description: 'Weapon experience',
                order: 100, viewImportance: 10, componentType: 'IntExhaustible',
                defaultVal: '0/8', metadata: '', groupKey: 'CharWeapon'
            },
            {
                key: 'WeaponType', label: 'Weapon Type', description: 'Weapon type',
                order: 100, viewImportance: 10, componentType: 'Enum',
                defaultVal: 'WeaponProficiencyType/Unknown', metadata: '', groupKey: 'CharWeapon'
            },

            // Other properties
            {
                key: 'HuntXp', label: 'HuntXp', description: 'Hunt experience',
                order: 100, viewImportance: 10, componentType: 'Int',
                defaultVal: '0', metadata: '', groupKey: ''
            },
            {
                key: 'SkipNextHunt', label: 'Skip Next Hunt', description: 'Skip next hunt',
                order: 100, viewImportance: 10, componentType: 'Bool',
                defaultVal: 'false', metadata: '', groupKey: ''
            },
            {
                key: 'LifeState', label: 'Life State', description: 'Life state',
                order: 100, viewImportance: 10, componentType: 'Enum',
                defaultVal: 'LifeState/Active', metadata: '', groupKey: ''
            },
            {
                key: 'FightingArts', label: 'Fighting Arts', description: 'Character\'s fighting arts or secret fighting arts',
                order: 100, viewImportance: 10, componentType: 'EnumCollection',
                defaultVal: '', metadata: '{ enumTypes: \'FightingArt,SecretFightingArt\' maxCount: \'3\' }', groupKey: ''
            },
            {
                key: 'Disorders', label: 'Disorders', description: 'Disorders',
                order: 100, viewImportance: 10, componentType: 'EnumCollection',
                defaultVal: '', metadata: '{ enumTypes: \'Disorder\', maxCount: \'3\' }', groupKey: ''
            },
            {
                key: 'AbilitiesAndImpairments', label: 'Abilities and Impairments', description: 'Abilities and impairments',
                order: 100, viewImportance: 10, componentType: EPropertyCompTypeString.getStr(EPropertyCompType.StringCollection),
                defaultVal: '', metadata: '{ enumTypes: \'\', tagFilter: \'ability,impairment\' }', groupKey: ''
            },
            {
                key: 'CharNotes', label: 'Notes', description: 'Character notes',
                order: 100, viewImportance: 10, componentType: 'StringCollection',
                defaultVal: '', metadata: '', groupKey: ''
            },
        ]
        // , valueSources: [ { name: 'properties', source: 'characterProperties.csv' } ]
    };

    private static serialiseDefault(path: string, definitionItem: any) {
        let folderPath: string;
        let cahedOffRemovedValues: {name: string, value: any}[];
        const valueSources = definitionItem.valueSources as [ { name: string, source: string } ];
        if (valueSources !== undefined) {
            cahedOffRemovedValues = [];
            const lastSeparatorIndex = path.lastIndexOf('/') + 1;
            folderPath = lastSeparatorIndex > 0 ? path.substring(0, lastSeparatorIndex) : '' ;

            for (const fieldMapping of valueSources) {
                const currentexternalValue = {name: fieldMapping.name, value: definitionItem[fieldMapping.name]};
                if (currentexternalValue.value !== undefined) {
                    cahedOffRemovedValues.push(currentexternalValue);
                    // clear value for serialising the definition later without this data
                    if (Array.isArray(currentexternalValue.value)) {
                        definitionItem[fieldMapping.name] = [];
                    } else {
                        definitionItem[fieldMapping.name] = {};
                    }

                    const csvContent = Papa.instance.unparse(currentexternalValue.value);
                    const otherFilePath = folderPath + fieldMapping.source;
                    AppIOService.instance.WriteText(otherFilePath, csvContent);
                }
            }
        }

        const itemText = JSON.stringify(definitionItem);
        AppIOService.instance.WriteText(path, itemText);

        // adding the items back
        if (valueSources !== undefined) {
            for (const removedItem of cahedOffRemovedValues) {
                definitionItem[removedItem.name] = removedItem.value;
            }
        }
    }

    public static serialiseDefaults() {
        DefaultDefinitions.serialiseDefault(DefaultDefinitions.genderDefinitionPath, DefaultDefinitions.genderDefinition);
        DefaultDefinitions.serialiseDefault(DefaultDefinitions.lifeStateDefinitionPath, DefaultDefinitions.lifeStateDefinition);
        DefaultDefinitions.serialiseDefault(DefaultDefinitions.courageAbilityDefinitionPath, DefaultDefinitions.courageAbilityDefinition);
        DefaultDefinitions.serialiseDefault(
            DefaultDefinitions.understandingAbilityDefinitionPath,
            DefaultDefinitions.understandingAbilityDefinition);
        DefaultDefinitions.serialiseDefault(
            DefaultDefinitions.weaponProficiencyDefinitionPath,
            DefaultDefinitions.weaponProficiencyDefinition);
        DefaultDefinitions.serialiseDefault(DefaultDefinitions.groupsDefinitionPath, DefaultDefinitions.groupsDefinition);
        DefaultDefinitions.serialiseDefault(DefaultDefinitions.characterDefinitionPath, DefaultDefinitions.characterDefinition);
    }
}




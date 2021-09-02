import { PropertGroup } from './properties.common';


export abstract class AnyValueDefinition {
    key = '';
    label = '';
    description = '';
}

export class EnumValueDefinition extends AnyValueDefinition{
    tags: string[] = [];
}

export class EnumTypeDefinition extends AnyValueDefinition {
    values: EnumValueDefinition[] = [];
    valueSources: { name: string, source: string }[] = [];
}

export class PropertyDefinition extends AnyValueDefinition {
    order = 100;
    // a vague concept of describing how relevant this data is
    // for views that should be brief summories. Importance levels are:
    // 1 - mostly the name for maybe printing out logs
    // 5 - important stats for spreadsheet displays
    // 10 - complete list of data
    viewImportance = 10;

    componentType = '';

    defaultVal = '';

    // things like allowed number value range
    metadata = '';

    groupKey = '';
}


export class EntityDefinition
{
    key = '';
    label = '';
    description = '';
    properties: PropertyDefinition[] = [];
    entities: { key: string, quantity: string, defaultSource: string }[] = [];
    valueSources: { name: string, source: string }[] = [];
}

export class PropertyGroupsDefinition {
    groups: PropertGroup[] = [];
    valueSources: { name: string, source: string }[] = [];
}


export class PropertyModifierDefinition {
    key = '';
    label = '';
    description = '';
    tags: string[] = [];

    updateCode = '';
    listenerCode = '';
    listenerFilters: string[] = [];

    // data that will initialise
    labelDynamicPoints: { begin: number; length: number }[] = [];
    descriptionDynamicPoints: { begin: number; length: number }[] = [];
}





export class EntityDefinition
{
    key = '';
    label = '';
    description = '';

    properties: PropertyDefinition[] = [];
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



export class PropertyGroup {
  private static readonly allGroups: Map<string, PropertyGroup> = new Map();

  // not localisable unique referential name. Used as an id.
  key = '';
  // translaatable group text to display
  label = '';
  description = '';
  // number for sortung groups and showing them in particular order
  order = 100;


  public static getGroup(name: string): PropertyGroup {
      if (name) {
          return PropertyGroup.allGroups.get(name);
      }
      return undefined;
  }

  public static registerGroup(name: string, value: PropertyGroup) {
      if (name && value) {
          PropertyGroup.allGroups.set(name, value);
      }
  }
}

export class PropertyGroupsDefinition {
    groups: PropertyGroup[] = [];
    valueSources: { name: string; source: string }[] = [];
}


export abstract class PropertyDefinition {
    key = '';
    label = '';
    description = '';
    order = 100;
    // a vague concept of describing how relevant this data is
    // for views that should be brief summories. Importance levels are:
    // 1 - mostly the name for maybe printing out logs
    // 5 - important stats for spreadsheet displays
    // 10 - complete list of data
    viewImportance = 10;

    componentType = 0;

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


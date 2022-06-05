
export class PropertyGroup {
  // not localisable unique referential name. Used as an id.
  key = '';
  // translaatable group text to display
  label = '';
  description = '';
  // number for sortung groups and showing them in particular order
  order = 100;
}

export class PropertyGroupConfig {
  groups: PropertyGroup[] = [];
  valueSources: { name: string; source: string }[] = [];
}


export class PropertyGroupManager {
  private static readonly allGroups: Map<string, PropertyGroup> = new Map();

  public static getGroup(name: string): PropertyGroup {
    if (name) {
        return PropertyGroupManager.allGroups.get(name);
    }
    return undefined;
  }

  public static registerGroup(name: string, value: PropertyGroup) {
      if (name && value) {
        PropertyGroupManager.allGroups.set(name, value);
      }
  }

}

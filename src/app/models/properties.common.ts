import { Input } from '@angular/core';


export class PropertGroup {
    private static readonly allGroups: Map<string, PropertGroup> = new Map();

    // not localisable unique referential name. Used as an id.
    key = '';
    // translaatable group text to display
    label = '';
    description = '';
    // number for sortung groups and showing them in particular order
    order = 100;


    public static GetGroup(name: string): PropertGroup {
        if (name) {
            return PropertGroup.allGroups.get(name);
        }
        return undefined;
    }

    public static AddGroup(name: string, value: PropertGroup) {
        if (name && value) {
            PropertGroup.allGroups.set(name, value);
        }
    }
}

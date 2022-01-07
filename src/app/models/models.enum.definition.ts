

export abstract class EnumValueDefinition {
  key = '';
  label = '';
  description = '';
  tags: string[] = [];
}


export class EnumTypeDefinition {
  key = '';
  label = '';
  description = '';
  values: EnumValueDefinition[] = [];
  valueSources: { name: string; source: string }[] = [];
}



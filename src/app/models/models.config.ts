

export class AppConfigJSON {
    version: number;
    useLocalisation: string;
}

export class DataConfigSource {
    version: number;
    localisation: string;
    includes: string[];
}

export class DataConfigJSON {
    sources: DataConfigSource[];
}


export class SimpleDataItem {
    name: string;
    description: string;
    tags: string[];
}

export class AttributeData extends SimpleDataItem {
    allowedCount: number;
    onGain: string;
    onLoss: string;
}


export class AttributeConfigItemJSON {
    version: number;
    localisation: string;
    includes: string[];
    attributes: AttributeData[];
}

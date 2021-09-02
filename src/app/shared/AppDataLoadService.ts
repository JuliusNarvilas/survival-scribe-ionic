import { Injectable, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'src/app/libs/papaparse/papaparse';
import {
    Plugins,
    FilesystemDirectory,
    FilesystemEncoding,
    FileReadResult,
    ReaddirResult, FileWriteResult, GetUriResult, Capacitor} from '@capacitor/core';
// import 'rxjs/add/operator/toPromise';
import { Observable, Subject } from 'rxjs';

import {
    DataConfigJSON,
    AttributeConfigItemJSON,
    SimpleDataItem,
    DataConfigSource} from '../models/models.config';
import { NumericalModifierHelper } from '../properties/properties.modifiers.app';
import { Platform } from '@ionic/angular';
import { FloatProperty } from '../properties/properties.app';
const { Filesystem } = Plugins;


class ConfigDataPaths {
    public static readonly Modifiers =             './KDMHelper/configs/modifiers.json';
    public static readonly SurvivorProperties =    './KDMHelper/configs/survivorProperties.json';
    public static readonly Gear =                 './KDMHelper/configs/gear.json';
    public static readonly Definitions =           './KDMHelper/configs/definitions.json';

    public static readonly All = [
        ConfigDataPaths.Modifiers, ConfigDataPaths.SurvivorProperties,
        ConfigDataPaths.Gear, ConfigDataPaths.Definitions
    ];
}

enum EPromisedWorkState {
    Setup,
    Loading,
    Processing,
    Completed,
    Error
}

class PromisedWorkDataItem<PromiseResultT> {
    handle: Promise<PromiseResultT>;
    state: EPromisedWorkState;
    description: string;
}
class PromisedWorkData<PromiseResultT> {
    workCompletedCount: number;
    work: PromisedWorkDataItem<PromiseResultT>[];

    constructor() {
        this.workCompletedCount = 0;
        this.work = [];
    }
}


class AppDataProcessCallbacks {
    processIncludes: (includes: string[]) => void;
    processConfig: (content: string) => void;
    processData: (content: string, path: string) => void;
}

export abstract class AppIOChannel {

    abstract getStoragePath(): string;
    abstract getInitStageCount(): number;
    abstract init(readyCallback?: (() => void)): void;

    abstract readFrom(
        filePath: string,
        base64: boolean,
        successCallback: ((content: string) => void),
        errorCallback?: ((reson: any) => void)
        ): void;

    abstract writeTo(
        filePath: string,
        base64: boolean,
        text: string,
        successCallback?: (() => void),
        errorCallback?: ((reson: any) => void)
        ): void;
}


class AppIOConfiguration {
    static readonly AppName = 'KDMHelper';

    ioChannels: AppIOChannel[] = [];
}

class AppOutChannelCapacitorPC extends AppIOChannel {
    private storageRootPath: string;

    getStoragePath(): string {
        return this.storageRootPath;
    }

    getInitStageCount(): number {
        return 1;
    }

    init(readyCallback?: (() => void)): void {
        const uriPromise = Filesystem.getUri({ directory: FilesystemDirectory.Documents , path: '' })
            .then((result: GetUriResult) => { this.storageRootPath = result.uri + AppIOConfiguration.AppName; });
        if (readyCallback) {
            uriPromise.then(readyCallback);
        }
    }

    readFrom(
        filePath: string,
        base64: boolean,
        successCallback: ((content: string) => void),
        errorCallback?: ((reson: any) => void)
    ): void {
        if (successCallback) {
            const promise = Filesystem.readFile({
                path: AppIOConfiguration.AppName + '/' + filePath,
                directory: FilesystemDirectory.Documents,
                encoding: base64 ? undefined : FilesystemEncoding.UTF8,
            });
            promise.then((result: FileReadResult) => { successCallback(result.data); }, errorCallback);
        }
    }

    writeTo(
        filePath: string,
        base64: boolean,
        text: string,
        successCallback?: (() => void),
        errorCallback?: ((reson: any) => void)
    ): void {
        const promise = Filesystem.writeFile({
            path: AppIOConfiguration.AppName + '/' + filePath,
            data: text,
            directory: FilesystemDirectory.Documents,
            encoding: base64 ? undefined : FilesystemEncoding.UTF8,
            recursive: true
        });
        if (successCallback || errorCallback) {
            promise.then((value: FileWriteResult) => { if (successCallback) { successCallback(); } }, errorCallback);
        }
    }
}

class AppOutChannelCapacitorMobile extends AppIOChannel {

    private storageRootPath: string;

    getStoragePath(): string {
        return this.storageRootPath;
    }

    getInitStageCount(): number {
        return 1;
    }

    init(readyCallback?: (() => void)) {
        const uriPromise = Filesystem.getUri({ directory: FilesystemDirectory.Data , path: '' })
            .then((result: GetUriResult) => { this.storageRootPath = result.uri; });
        if (readyCallback) {
            uriPromise.then(readyCallback);
        }
    }

    readFrom(
        filePath: string,
        base64: boolean,
        successCallback: ((content: string) => void),
        errorCallback?: ((reson: any) => void)
        ): void {
            if (successCallback) {
                const promise = Filesystem.readFile({
                    path: filePath,
                    directory: FilesystemDirectory.Data,
                    encoding: base64 ? undefined : FilesystemEncoding.UTF8,
                });
                promise.then((result: FileReadResult) => { successCallback(result.data); }, errorCallback);
            }
        }

    writeTo(
        filePath: string,
        base64: boolean,
        text: string,
        successCallback?: (() => void),
        errorCallback?: ((reson: any) => void)
        ): void {
            const promise = Filesystem.writeFile({
                path: filePath,
                data: text,
                directory: FilesystemDirectory.Data,
                encoding: base64 ? undefined : FilesystemEncoding.UTF8,
                recursive: true
            });
            if (successCallback || errorCallback) {
                promise.then((value: FileWriteResult) => { if (successCallback) { successCallback(); } }, errorCallback);
            }
        }
}


@Injectable()
export class AppDataLoadService {

  constructor(private httpClient: HttpClient, private csvParser: Papa) { }

  private static config: AppIOConfiguration;
  private static readyStage = 0;
  private static readyStageCount = 1;
  private static readyStageText = '';
  private static readyCallbacks: ((currentStage: number, stageCount: number) => void)[] = [];

  static isReady(): boolean {
    return AppDataLoadService.readyStageCount === AppDataLoadService.readyStage;
  }

  static getIOChannels() {
      return AppDataLoadService.config ? AppDataLoadService.config.ioChannels : undefined;
  }

  static addReadyCallback(callback: ((currentStage: number, stageCount: number) => void)) {
    if (AppDataLoadService.isReady()) {
        callback(AppDataLoadService.readyStage, AppDataLoadService.readyStageCount);
    } else {
        AppDataLoadService.readyCallbacks.push(callback);
    }
  }

  static initilise(plt: Platform) {
    if (AppDataLoadService.config === undefined) {
        AppDataLoadService.config = new AppIOConfiguration();

        const completionCallback = () => {
            AppDataLoadService.readyStage++;
            for (const callback of AppDataLoadService.readyCallbacks) {
                callback(AppDataLoadService.readyStage, AppDataLoadService.readyStageCount);
            }
        };

        let localStorageChannel: AppIOChannel;
        if (plt.is('mobile')) {
            localStorageChannel = new AppOutChannelCapacitorMobile();
        } else if (plt.is('electron')) {
            localStorageChannel = new AppOutChannelCapacitorPC();
        }
        AppDataLoadService.config.ioChannels.push(localStorageChannel);
        AppDataLoadService.readyStage = 0;
        AppDataLoadService.readyStageCount = localStorageChannel.getInitStageCount();
        localStorageChannel.init(completionCallback);
        if (AppDataLoadService.readyStageCount === 0) {
            for (const callback of AppDataLoadService.readyCallbacks) {
                callback(AppDataLoadService.readyStage, AppDataLoadService.readyStageCount);
            }
        }
    }
  }

  static ReadText(filePath: string, successCallback: ((content: string) => void), errorCallback?: ((reson: any) => void)) {
    AppDataLoadService.config.ioChannels[0].readFrom(filePath, false, successCallback, errorCallback);
  }

  static WriteText(filePath: string, text: string, successCallback?: (() => void), errorCallback?: ((reson: any) => void)) {
    const ioChannels = AppDataLoadService.config.ioChannels;
    ioChannels[0].writeTo(filePath, false, text, successCallback, errorCallback);

    for (let i = 1; i < ioChannels.length; i++) {
        ioChannels[i].writeTo(filePath, false, text);
    }
  }


  initializeAppData(): Promise<any> {
    const visitedPaths = new Set<string>();
    const loadingWork = new PromisedWorkData<void>();
    for (const rootAssetPath of ConfigDataPaths.All) {
        visitedPaths.add(rootAssetPath);
    }

    const localisationInUse = 'en';

    const newTestPromise = Filesystem.readdir({
        path: '.',
        directory: FilesystemDirectory.Documents,
    }).then((result: ReaddirResult) => {
        console.log(result.files);
    });


    const newTestPromise2 = Filesystem.readdir({
        path: './KDMHelper/configs/',
        directory: FilesystemDirectory.Documents,
    }).then((result: ReaddirResult) => {
        console.log(result.files);
    });

    const newTestPromise3 = Filesystem.readFile({
        path: './KDMHelper/configs/gear.json',
        directory: FilesystemDirectory.Documents
    }).then((result: FileReadResult) => {
        console.log(result.data);
    },
    (reason: any) => {
        console.log(reason);
    });

    const loadFile = (filePath: string, onfulfilled: ((value: string) => void)) => {
        console.log('Loading file ' + filePath);

        const newWorkItem = new PromisedWorkDataItem<void>();
        newWorkItem.description = filePath;
        newWorkItem.state = EPromisedWorkState.Loading;
        loadingWork.work.push(newWorkItem);

        const newPromise = Filesystem.readFile({
            path: filePath,
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8
        });

        newWorkItem.handle = newPromise.then((fr: FileReadResult) => {
            console.log('Load response 1 for ' + filePath);

            if (typeof fr !== 'undefined' && typeof fr.data === 'string') {
                newWorkItem.state = EPromisedWorkState.Processing;
                onfulfilled(fr.data);
                newWorkItem.state = EPromisedWorkState.Completed;
            } else {
                console.log('Failed to get a valid file read for ' + filePath);
                newWorkItem.state = EPromisedWorkState.Error;
            }
            loadingWork.workCompletedCount++;

        }, (reason: any) => {
            console.log('Load response 2 for ' + filePath);

            console.log(reason);
            newWorkItem.state = EPromisedWorkState.Error;
            loadingWork.workCompletedCount++;
        });

        newPromise.catch((reason: any) => {
            console.log('Catch callback for ' + filePath);
            console.log(reason);
        });

        newPromise.finally(() => {
            console.log('Finally callback for ' + filePath);
        });
    };

    const setupProcessCallbacks = (callbacksStruck: AppDataProcessCallbacks) => {
        callbacksStruck.processConfig = (configItemPath: string) => {
            if (!configItemPath.endsWith('.json')) {
                console.log('Incorrect config file ' + configItemPath);
                return;
            }

            loadFile(configItemPath, (configContent: string) => {
                console.log('Parsing config JSON ' + configItemPath);
                let matchedConfig: DataConfigSource = null;
                const data = JSON.parse(configContent) as DataConfigJSON;
                for (const configSourceItem of data.sources) {
                    if (configSourceItem.localisation === localisationInUse) {
                        if (configSourceItem.version > 0) {
                            if (matchedConfig === null) {
                                matchedConfig = configSourceItem;
                            } else if (matchedConfig.version < configSourceItem.version) {
                                matchedConfig = configSourceItem;
                            }
                        }
                    }
                }
                if (matchedConfig !== null) {
                    callbacksStruck.processIncludes(matchedConfig.includes);
                }
            });
        };

        callbacksStruck.processIncludes = (includes: string[]) => {
            const newIncludePaths: string[] = [];

            for (const includeItem of includes) {
                if (!visitedPaths.has(includeItem)) {
                    visitedPaths.add(includeItem);
                    newIncludePaths.push(includeItem);
                }
            }
            for (const newIncludeItemPath of newIncludePaths) {

                loadFile(newIncludeItemPath, (includeContent: string) => {
                    callbacksStruck.processData(includeContent, newIncludeItemPath);
                });
            }
        };
    };

    ////////////////////////////////////////////////////////////////////////
    // Modifiers
    {
        const modifierCallbacks = new AppDataProcessCallbacks();
        setupProcessCallbacks(modifierCallbacks);
        modifierCallbacks.processData = (value: string) => {
            // process data;
            console.log('Parsing modifier CSV');
            const csvData = this.csvParser.parse(value, {
                header: true,
                dynamicTyping: true
            }).data as any;
            for (const modifierData of csvData) {
                console.log('Adding modifier ' + modifierData.name);
                NumericalModifierHelper.addDefinition(modifierData);
            }
        };

        modifierCallbacks.processConfig(ConfigDataPaths.Modifiers);
    }
    ////////////////////////////////////////////////////////////////////////
    // Survivor Properties
    {
        const survivorsCallbacks = new AppDataProcessCallbacks();
        setupProcessCallbacks(survivorsCallbacks);
        survivorsCallbacks.processData = (value: string) => {
            // process data;
            console.log('Parsing survivor CSV');
            const csvData = this.csvParser.parse(value, {
                header: true,
                dynamicTyping: true
            }).data as any;
            for (const modifierData of csvData) {
                // ...
            }
        };

        survivorsCallbacks.processConfig(ConfigDataPaths.SurvivorProperties);
    }
    ////////////////////////////////////////////////////////////////////////
    // Gear Definitions
    {
        const gearCallbacks = new AppDataProcessCallbacks();
        setupProcessCallbacks(gearCallbacks);
        gearCallbacks.processData = (value: string) => {
            // process data;
            console.log('Parsing gear CSV');
            const csvData = this.csvParser.parse(value, {
                header: true,
                dynamicTyping: true
            }).data as any;
            for (const modifierData of csvData) {
                //
            }
        };

        gearCallbacks.processConfig(ConfigDataPaths.Gear);
    }
    ////////////////////////////////////////////////////////////////////////
    // Other Definitions (Disorders, Fighting Arts, Abilities, ...)
    {
        const definitionsCallbacks = new AppDataProcessCallbacks();
        setupProcessCallbacks(definitionsCallbacks);
        definitionsCallbacks.processData = (value: string) => {
            // process data;
            console.log('Parsing definitions CSV');
            const csvData = this.csvParser.parse(value, {
                header: true,
                dynamicTyping: true
            }).data as any;
            for (const modifierData of csvData) {
                // ...
            }
        };

        definitionsCallbacks.processConfig(ConfigDataPaths.Definitions);
    }

    return new Promise((resolve, reject) => {
        const pollingFunc = () => {
            if (loadingWork.workCompletedCount >= loadingWork.work.length) {
                resolve();
            } else {
                setTimeout(pollingFunc, 30);
            }
        };
        pollingFunc();
    });
  }



  getSettingsExample(): Promise<any> {

    const promise = this.httpClient.get('http://private-1ad25-initializeng.apiary-mock.com/settings')
      .toPromise()
      .then(settings => {
        console.log(`Settings from API: `, settings);

        // APP_SETTINGS.connectionString = settings[0].value;
        // APP_SETTINGS.defaultImageUrl = settings[1].value;

        return settings;
      });

    return promise;
  }
}

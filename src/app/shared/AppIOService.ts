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


export abstract class AppIOChannel {

    abstract getTitle(): string;
    abstract getDescription(): string;
    abstract isReady(): boolean;
    abstract getInitFraction(): number;
    abstract getInitText(): string;
    abstract init(progressCallback?: ((progressFraction: number, description: string) => void)): void;

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
    readyChannels = 0;
}

class AppIOChannelCapacitorPC extends AppIOChannel {
    private static sSetupStartText = 'Requesting path for app data folder';
    private static sSetupEndText = 'Capacitor IO channel ready for use';
    private ready = false;
    private storageRootPath: string;
    private initFraction = 0;
    private initText: string;

    getTitle(): string {
        return 'Capacitor IO Channel';
    }
    getDescription(): string {
        let text = 'Input/Output filesystem channel for Capacitor framework.';
        if (this.storageRootPath) {
            text += ' App data location setup to ' + this.storageRootPath;
        }
        return text;
    }
    isReady(): boolean {
        return this.ready;
    }
    getInitFraction(): number {
        return this.initFraction;
    }
    getInitText(): string {
        return this.initText;
    }

    init(readyCallback?: ((progressFraction: number, description: string) => void)): void {
        this.initFraction = 0.1;
        this.initText = AppIOChannelCapacitorPC.sSetupStartText;
        const uriPromise = Filesystem.getUri({ directory: FilesystemDirectory.Documents , path: '' })
            .then((result: GetUriResult) => {
                this.storageRootPath = result.uri + AppIOConfiguration.AppName;
                this.initFraction = 1.0;
                this.initText = AppIOChannelCapacitorPC.sSetupEndText;
                this.ready = true;
            });
        if (readyCallback) {
            readyCallback(0.1, AppIOChannelCapacitorPC.sSetupStartText);
            uriPromise.then(() => {
                readyCallback(1.0,  AppIOChannelCapacitorPC.sSetupEndText);
            });
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
    private static sSetupStartText = 'Requesting path for app data folder';
    private static sSetupEndText = 'Capacitor IO channel ready for use';
    private ready = false;
    private storageRootPath: string;
    private initFraction = 0;
    private initText: string;


    getTitle(): string {
        return 'Capacitor IO Channel';
    }
    getDescription(): string {
        let text = 'Input/Output filesystem channel for Capacitor framework.';
        if (this.storageRootPath) {
            text += ' App data location setup to ' + this.storageRootPath;
        }
        return text;
    }
    isReady(): boolean {
        return this.ready;
    }
    getInitFraction(): number {
        return this.initFraction;
    }
    getInitText(): string {
        return this.initText;
    }

    init(readyCallback?: ((progressFraction: number, description: string) => void)) {
        this.initFraction = 0.1;
        this.initText = AppOutChannelCapacitorMobile.sSetupStartText;
        const uriPromise = Filesystem.getUri({ directory: FilesystemDirectory.Data , path: '' })
            .then((result: GetUriResult) => {
                this.storageRootPath = result.uri;
                this.initFraction = 1.0;
                this.initText = AppOutChannelCapacitorMobile.sSetupEndText;
                this.ready = true;
            });
        if (readyCallback) {
            readyCallback(0.1, AppOutChannelCapacitorMobile.sSetupStartText);
            uriPromise.then(() => {
                readyCallback(1.0,  AppOutChannelCapacitorMobile.sSetupEndText);
            });
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
export class AppIOService {

  constructor(private httpClient: HttpClient, private csvParser: Papa) { }

  private static config: AppIOConfiguration;
  public static instance: AppIOService;

  isReady(): boolean {
    return AppIOService.config.ioChannels.length <= AppIOService.config.readyChannels;
  }

  getIOChannels(): AppIOChannel[] {
      return AppIOService.config ? AppIOService.config.ioChannels : undefined;
  }

  initilise(plt: Platform, finishCall?: () => void) {
    if (AppIOService.config === undefined) {
        AppIOService.config = new AppIOConfiguration();
        AppIOService.instance = this;

        let localStorageChannel: AppIOChannel;
        if (plt.is('mobile')) {
            localStorageChannel = new AppOutChannelCapacitorMobile();
        } else if (plt.is('electron')) {
            localStorageChannel = new AppIOChannelCapacitorPC();
        }
        AppIOService.config.ioChannels.push(localStorageChannel);
        localStorageChannel.init((progress, text) => {
            if (progress === 1.0 && AppIOService.config.ioChannels.includes(localStorageChannel)) {
                AppIOService.config.readyChannels++;
                if (finishCall) {
                    finishCall();
                }
            }
        });
    }
  }

  ReadText(filePath: string, successCallback: ((content: string) => void), errorCallback?: ((reson: any) => void)) {
    AppIOService.config.ioChannels[0].readFrom(filePath, false, successCallback, errorCallback);
  }

  WriteText(filePath: string, text: string, successCallback?: (() => void), errorCallback?: ((reson: any) => void)) {
    const ioChannels = AppIOService.config.ioChannels;
    ioChannels[0].writeTo(filePath, false, text, successCallback, errorCallback);

    for (let i = 1; i < ioChannels.length; i++) {
        ioChannels[i].writeTo(filePath, false, text);
    }
  }


}

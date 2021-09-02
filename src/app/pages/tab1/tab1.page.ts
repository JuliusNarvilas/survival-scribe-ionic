import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { log } from 'util';
import { ScriptExec } from 'src/app/libs/scriptExec/scriptExec';
import { from } from 'rxjs';
import { PropertyDynamicComponent } from 'src/app/properties/property.dynamic';
import { PropertiesModule } from 'src/app/properties/properties.module';
import { PropertyIntEditComponent } from 'src/app/properties/numberComponents/property.int.edit';
import { DefaultDefinitions } from 'src/app/models/models.definitions.defaults';
import { AppIOService } from 'src/app/shared/AppIOService';
const { Filesystem } = Plugins;


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  directories = [];
  folder = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private plt: Platform,
    private resolver: ComponentFactoryResolver,
    private ioService: AppIOService
  ) { }

  ngOnInit() {
    this.folder = this.route.snapshot.paramMap.get('folder') || '';
    this.readdir();

    console.log('Started test');
    console.log('folder: ' + this.folder);
    console.log('directories: ' + this.directories);
    this.loadDocuments();
  }

  loadDocuments() {
    this.plt.ready().then(() => {

      const componentFactory = this.resolver.resolveComponentFactory(PropertyIntEditComponent);

      console.log('mobile = ' + this.plt.is('mobile'));
      console.log('mobileweb = ' + this.plt.is('mobileweb'));
      console.log('capacitor = ' + this.plt.is('capacitor'));
      console.log('electron = ' + this.plt.is('electron'));
      console.log('pwa = ' + this.plt.is('pwa'));
      console.log('desktop = ' + this.plt.is('desktop'));
      console.log('hybrid = ' + this.plt.is('hybrid'));
      console.log('android = ' + this.plt.is('android'));
      console.log('platforms = ' + JSON.stringify(this.plt.platforms));

      this.ioService.initilise(this.plt, () => {
        console.log('rootPath: ' + AppIOService.instance.getIOChannels()[0].getDescription());
      });

      console.log('Ready');


      //DefaultDefinitions.serialiseDefaults();

      // ScriptExec.Run('console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")', );

      this.readdir();

      // log("INIT this.file.dataDirectory: " + this.file.dataDirectory);
      // log("INIT this.file.documentsDirectory: " + this.file.documentsDirectory);

      // this.file.listDir(this.file.dataDirectory, this.folder).then(res => {
      //  this.directories = res;
      // });

      this.fileWrite().then(
      () => {
        this.fileRead();
      }
    );
    });
  }

  async fileWrite() {
    try {
      await Filesystem.mkdir({
        directory: FilesystemDirectory.Documents,
        path : 'secrets'
      });
      const result = await Filesystem.writeFile({
        path: 'secrets/text.txt',
        data: 'This is a test',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      console.log('Wrote file', result);
    } catch (e) {
      console.error('Unable to write file', e);
    }
  }

  async fileRead() {
    console.log('start fileRead');

    const contents = await Filesystem.readFile({
      path: 'secrets/text.txt',
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8
    });

    console.log('end fileRead');
    console.log('file content: ' + contents.data);

    console.log(contents);
  }

  async fileAppend() {
    await Filesystem.appendFile({
      path: 'secrets/text.txt',
      data: 'MORE TESTS',
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8
    });
  }

  async fileDelete() {
    await Filesystem.deleteFile({
      path: 'secrets/text.txt',
      directory: FilesystemDirectory.Documents
    });
  }

  async mkdir() {
    try {
      const ret = await Filesystem.mkdir({
        path: 'secrets',
        directory: FilesystemDirectory.Documents,
        recursive: false // like mkdir -p
      });
    } catch (e) {
      console.error('Unable to make directory', e);
    }
  }

  async rmdir() {
    try {
      const ret = await Filesystem.rmdir({
        path: 'secrets',
        directory: FilesystemDirectory.Documents,
        recursive: false,
      });
    } catch (e) {
      console.error('Unable to remove directory', e);
    }
  }

  async readdir() {
    try {
      const ret = await Filesystem.readdir({
        path: '.',
        directory: FilesystemDirectory.Documents
      });

      this.directories = ret.files;

    } catch (e) {
      console.error('Unable to read dir', e);
    }
  }

  async stat() {
    try {
      const ret = await Filesystem.stat({
        path: 'secrets/text.txt',
        directory: FilesystemDirectory.Documents
      });
    } catch (e) {
      console.error('Unable to stat file', e);
    }
  }

  async readFilePath() {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    try {
      const data = await Filesystem.readFile({
        path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
      });
    } catch (e) {
      console.error('Unable to read file path', e);
    }
  }

  async rename() {
    try {
      // This example moves the file within the same 'directory'
      const ret = await Filesystem.rename({
        from: 'text.txt',
        to: 'text2.txt',
        directory: FilesystemDirectory.Documents
      });
    } catch (e) {
      console.error('Unable to rename file', e);
    }
  }

  async copy() {
    try {
      // This example copies a file within the documents directory
      const ret = await Filesystem.copy({
        from: 'text.txt',
        to: 'text2.txt',
        directory: FilesystemDirectory.Documents
      });
    } catch (e) {
      console.error('Unable to copy file', e);
    }
  }

}

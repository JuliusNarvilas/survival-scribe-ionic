# survival-scribe
 Survival style boardgame helper app

https://capacitor.ionicframework.com/docs/basics/workflow/


//When you are ready to run your app natively on a device or in a simulator, build and copy your built web assets
ionic build && npx cap copy

//launching windows:
//npx cap open electron
npx cap open @capacitor-community/electron

/////////////////////////////////////////////////////////////
Project setup

//Software versions used
   Ionic CLI                     : 6.11.0
   Ionic Framework               : @ionic/angular 5.3.1
   @angular-devkit/build-angular : 0.901.12
   @angular-devkit/schematics    : 9.1.12
   @angular/cli                  : 9.1.12
   @ionic/angular-toolkit        : 2.3.0

   Capacitor CLI   : 2.4.0
   @capacitor/core : 2.4.0

   cordova-res : not installed
   native-run  : 0.3.0

   NodeJS : v12.13.1
   npm    : 6.13.7
   OS     : Windows 10

//updating ionic
npm uninstall -g ionic
npm install -g @ionic/cli

//setup steps used
ionic start [survival-scribe] [blank/tabs] --type=angular --capacitor
cd ./[survival-scribe]
//npm install @ionic-native/file
//npm install @ionic-native/file-opener
//npm install ngx-electron electron
//npm install electron-packager --save-dev
npm i @capacitor-community/electron
npm install papaparse
//npm install safe-eval
////safe eval dependency
//npm install vm
//npm install vm2
npm install js-interpreter
npm install crypto-js //(https://github.com/brix/crypto-js)

//correct base href in src/index.html to <base href="./" />
// Needed to run once before adding Capacitor platforms
ionic build

npm install @capacitor/android
npx cap add android

//npx cap add electron
npx cap add @capacitor-community/electron
//npx cap open electron
npx cap open @capacitor-community/electron

/////////////////////////////////////////////////////////////
Updating (maybe)

npm update -g @ionic/cli

////////////////////////////////////////////////////////////
reinstalling modules and their dependencies

rm -rf node_modules
npm install




modules:
*app
    app services
        file service
        bloetooth service
        server service
    displays
        campaign timeline
        settlement view
        survivor view
        storage list
        

*data displays
    *property displays
    *table displays



!!!!!!!!!!!!!!! WIP !!!!!!!!!!!!!!!
Add idea of a "group" value for properties
{
    name - static name refered by code
    label - translatable label
    order - order by witch to appear in views
    viewLevel - show starting particular view level:
        * 1 (just the name for printing out logs)
        * 5 (include stats for displaying in spreadsheets)
        * 10 (complete list of data)

        brad
}


File System Hierarchy:
* SurvivalScribe
    -settings
        -selected language
        -app version?
        -highleight untrnaslated text for debugging
        -colour theme file
    *themes
    *App settings file
            -app version during last modification
            -language
            -theme

    *module (KingdomDeathMonster)
        -game settings file
            -app version during last modification
            -data-tag-filter (filtering expansion content)
            -custom data

        -new game save file
        -game save file
            -name
            -date
            -module version
            -app version

        -game setup
            -paths to game mode configs
            -version number for setup
            -language database path
        -game mode / campaign config
            -version number
            -entity definition sources
        -game mode config localisation
        *game mode / config folder
            * entity definitions json and csv (for survivors)
            * property group definitions csv

        *common data definitions
            *language
            (each json file)
        *campaigns




data driven structures:
+properties
    *string
    *enum
    *collection
      (for disorders in KDM)
    *entities
      (having survivors in settlement as a property of entities)
    *numerical
    !!!!-int
        -int-ranged
    !!!!-int-reserve
        -float
        -float-ranged
        **modifiers
          ...
        **settings
            -dynamic-min
            -dynamic-max
        
        **instance display customisations
            -hide-min
            -hide-max
            -slider
            -editable
            *sizes
                -embeded (small) s
                -list entry (medium) m
                -in-depth (large) l

+entity
    *ID (GUID)
    *properties

+pages

    +views
        *list
        *table
*


+inputs
    *buttons
        -navigational links
        -scriptable macros
    *sliders
        -colour choice?
+display elements
    *text
    *icon



Propertty structure:

PropertyDefinition {
  id;
  label;
  group / set;
  viewLevel;
  prop type;
  defaultValue;
  settings;
}

PropertyInstance {
  definitionRef;
  
  ToString();
}


EntityDefinition {
  name; (Like Survivor)
  group / set;
  viewLevel;
  prop type;
  
  propertyIds[];

  settings;
}

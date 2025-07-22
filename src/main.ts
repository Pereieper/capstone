import { enableProdMode, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { provideIonicAngular } from '@ionic/angular/standalone'; 
import { Drivers } from '@ionic/storage';



let storageInstance: Storage;

// ✅ Create and initialize Storage manually
export function provideStorageFactory() {
  const storage = new Storage({
    name: '__mydb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]

  });
  return () => storage.create().then(created => {
    storageInstance = created;
  });
}

bootstrapApplication(AppComponent, {
  providers: [
        provideIonicAngular(), 

    importProvidersFrom(IonicModule.forRoot(), FormsModule),
    provideRouter(routes),

    {
      provide: APP_INITIALIZER,
      useFactory: provideStorageFactory,
      multi: true,
    },
    {
      provide: Storage,
      useFactory: () => storageInstance,
    },
  ],
});

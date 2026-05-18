import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { Home } from './app/pages/home/home';
import { provideHttpClient } from '@angular/common/http';


bootstrapApplication(Home, {
  providers: [
    provideHttpClient()
  ]
});


  
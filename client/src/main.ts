import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { Home } from './app/pages/home/home';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';

bootstrapApplication(Home, {
  providers: [provideHttpClient(withInterceptors([errorInterceptor]))],
});

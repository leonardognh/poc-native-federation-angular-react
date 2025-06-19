import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReactMfeWrapperComponent } from './react-wrapper/react-wrapper.component';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'angular',
    loadChildren: () =>
      loadRemoteModule('mfeAngular', './Component').then((m) => m.App),
  },
  {
    path: 'react',
    component: ReactMfeWrapperComponent,
    title: 'React MFE',
  },
  {
    path: 'react/**',
    component: ReactMfeWrapperComponent,
    title: 'React MFE',
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

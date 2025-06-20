import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Home2 } from './home2/home2';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'angular',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'home2',
    component: Home2,
  },
];

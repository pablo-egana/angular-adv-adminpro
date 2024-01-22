import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
// Components
import { PagesComponent } from './pages.component';
// Guards
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [authGuard],
    canLoad: [authGuard],
    loadChildren: () => import('./child-routes.module').then(module => module.ChildRoutesModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}

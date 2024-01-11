import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { GraphComponent } from './graph/graph.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
// Mantenimientos
import { UsersComponent } from './maintenance/users/users.component';

export const routes: Routes = [
  { 
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
      { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Ajustes de cuenta' } },
      { path: 'graph', component: GraphComponent, data: { title: 'Gráficas' } },
      { path: 'profile', component: ProfileComponent, data: { title: 'Perfil de usuario' } },
      { path: 'progress', component: ProgressComponent, data: { title: 'ProgressBar' }},
      { path: 'promises', component: PromisesComponent, data: { title: 'Promesas' } },
      { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs' } },
      // Mantenimientos
      { path: 'usuarios', component: UsersComponent, data: { title: 'Usuario de aplicación' } },
      //{ path: 'hospitales', component: , data: { title: '' } },
      //{ path: 'medicos', component: , data: { title: '' } }
    ]
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
  }
)
export class PagesRoutingModule {}

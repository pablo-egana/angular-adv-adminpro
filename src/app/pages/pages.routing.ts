import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
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
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';
import { DoctorComponent } from './maintenance/doctors/doctor.component';
import { SearchComponent } from './search/search.component';
// Guards
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  { 
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard' }},
      { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Ajustes de cuenta' }},
      { path: 'buscar/:termino', component: SearchComponent, data: { title: 'Búsquedas' }},
      { path: 'graph', component: GraphComponent, data: { title: 'Gráficas' }},
      { path: 'profile', component: ProfileComponent, data: { title: 'Perfil de usuario' }},
      { path: 'progress', component: ProgressComponent, data: { title: 'ProgressBar' }},
      { path: 'promises', component: PromisesComponent, data: { title: 'Promesas' }},
      { path: 'rxjs', component: RxjsComponent, data: { title: 'RXJS' }},
      // Mantenimientos
      { path: 'usuarios', component: UsersComponent, data: { title: 'Mantenimiendo de Usuarios' }},
      { path: 'hospitales', component: HospitalsComponent, data: { title: 'Mantenimiendo de Hospitales' }},
      { path: 'medicos', component: DoctorsComponent, data: { title: 'Mantenimiendo de Médicos' }},
      { path: 'medico/:id', component: DoctorComponent, data: { title: 'Mantenimiendo de Médicos' }},
      // Rutas de Admin
      { path: 'usuarios', canActivate: [adminGuard], component: UsersComponent, 
        data: { title: 'Mantenimiendo de Usuarios' }}
    ]
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
  }
)
export class PagesRoutingModule {}

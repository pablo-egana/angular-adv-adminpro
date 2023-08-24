import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { Routes } from '@angular/router';
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { GraphComponent } from "./graph/graph.component";

export const routes: Routes = [
  { 
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'graph', component: GraphComponent }
    ]
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
  }
)
export class PagesRoutingModule {}

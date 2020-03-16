import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { CatalogsPageComponent } from './components/catalogs-page/catalogs-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { PodsComponent } from './components/pods/pods.component';
import { ServicesComponent } from './components/services/services.component';
import { MemberPageComponent } from './components/member-page/member-page.component';

const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'catalogs', component: CatalogsPageComponent },
  { path: 'events', component: EventsPageComponent },
  {
    path: 'project/:id', component: ProjectPageComponent,
    children: [
      { path: '', redirectTo: 'pods', pathMatch: 'full' },
      { path: 'pods', component: PodsComponent, data: { 'breadcrumb': 'Pods' } },
      { path: 'services', component: ServicesComponent, data: { 'breadcrumb': 'Services' } },
      { path: 'members', component: MemberPageComponent, data: { 'breadcrumb': 'Members' } }
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

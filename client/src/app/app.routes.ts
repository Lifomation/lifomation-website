import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { HomeHeaderComponent } from './layout/home-header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocViewComponent } from './pages/doc-view/doc-view.component';
import { DocListComponent } from './components/doc-list/doc-list.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export const routes: Routes = [
  // Add your routes here
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'documents/:id',
    component: DocViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sidebar',
    component: SidebarComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importing the RouterModule and configuring it with the provided routes
  exports: [RouterModule], // Exporting the RouterModule to make it available for other modules to use
})
export class AppRoutingModule {} // Defining a module class named AppRoutingModule

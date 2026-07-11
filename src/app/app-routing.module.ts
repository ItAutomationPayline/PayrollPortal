import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { StatusDownloadsComponent } from './components/status-downloads/status-downloads.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { CycleManagementComponent } from './components/cycle-management/cycle-management.component';
import { authGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'file-upload', component: FileUploadComponent, canActivate: [authGuard] },
  { path: 'status', component: StatusDownloadsComponent, canActivate: [authGuard] },
  { path: 'cycles', component: CycleManagementComponent, canActivate: [authGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

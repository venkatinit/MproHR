import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';

const routes: Routes = [
  // { path: 'employee-attendance', component: EmployeeA },
  // { path: 'employee-dashboard', component: EmployeeDashboardComponent },
  { path: 'leave-request', component: LeaveRequestComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

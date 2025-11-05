import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
// import { LeaveRequestComponent } from './leave-request/leave-request.component';
// import { RaisePoshComponent } from './raise-posh/raise-posh.component';

const routes: Routes = [
  // { path: 'raise_a_posh_complaint', component: RaisePoshComponent },
  // // { path: 'employee-dashboard', component: EmployeeDashboardComponent },
  // { path: 'leave-request', component: LeaveRequestComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

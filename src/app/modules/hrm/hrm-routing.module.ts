import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './masters/add-employee/add-employee.component';
import { EmployeeListComponent } from './masters/employee-list/employee-list.component';
import { BackgroundVerificationComponent } from './masters/background-verification/background-verification.component';
import { OfferLetterComponent } from './Modifications/offer-letter/offer-letter.component';
// import { ExperienceComponent } from './Modifications/experience/experience.component';
import { ExperienceLetterComponent } from './Modifications/experience-letter/experience-letter.component';
import { HikeComponent } from './Modifications/hike/hike.component';
import { ServiceLetterComponent } from './Modifications/service-letter/service-letter.component';
import { CompanyConfigurationComponent } from './masters/company-configuration/company-configuration.component';
import { UpdateEmployeeComponent } from './masters/update-employee/update-employee.component';
import { PayslipComponent } from './Modifications/payslip/payslip.component';
import { ApplicantListComponent } from './career/applicant-list/applicant-list.component';
import { JobPostsComponent } from './career/job-posts/job-posts.component';
import { LeaveApprovalsComponent } from './leave-approvals/leave-approvals.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { PayrollAllowancesComponent } from './payroll-allowances/payroll-allowances.component';
import { PayrollDeductionsComponent } from './payroll-deductions/payroll-deductions.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { EmployeeDashboardComponent } from './masters/employee-dashboard/employee-dashboard.component';
import { SalaryComponentsComponent } from './salary-components/salary-components.component';
import { PayrollReimbursementComponent } from './payroll-reimbursement/payroll-reimbursement.component';
import { EsicComponent } from './esic/esic.component';
import { EpfoComponent } from './epfo/epfo.component';
import { ProfessionalTaxComponent } from './professional-tax/professional-tax.component';
import { LwfComponent } from './lwf/lwf.component';
import { StatutoryBonusComponent } from './statutory-bonus/statutory-bonus.component';
import { StatutoryComponentComponent } from './statutory-component/statutory-component.component';

const routes: Routes = [
  { path: 'add-employee', component: AddEmployeeComponent },
  {
    path: 'background-verification', component: BackgroundVerificationComponent, data: {
      title: 'background-verification'
    }
  },
  { path: 'offer-letter', component: OfferLetterComponent },
  { path: 'employee-list', component: EmployeeListComponent },
  { path: 'applicant-list', component: ApplicantListComponent },
  { path: 'experience-letter', component: ExperienceLetterComponent },
  { path: 'offer-letter', component: OfferLetterComponent },
  { path: 'hike', component: HikeComponent },
  { path: 'service-letter', component: ServiceLetterComponent },
  { path: 'company-configuration', component: CompanyConfigurationComponent },
  { path: 'update-employee', component: UpdateEmployeeComponent },
  { path: 'employee-payslip', component: PayslipComponent },
  { path: 'post-job', component: JobPostsComponent },
  { path: 'leave_approvals', component: LeaveApprovalsComponent },
  { path: 'leave_balance_list', component: LeaveBalanceComponent },
  { path: 'allowances', component: PayrollAllowancesComponent },
  { path: 'deductions', component: PayrollDeductionsComponent },
  { path: 'reimbersement', component: PayrollReimbursementComponent },
  { path: 'employee-attendance', component: AttendanceComponent },
  { path: 'hrm', component: HrDashboardComponent },
  { path: 'employee_dashboard/:id', component: EmployeeDashboardComponent },
  { path: 'salary_Components', component: SalaryComponentsComponent },
  { path: 'esic', component: EsicComponent },
  { path: 'epfo', component: EpfoComponent },
  { path: 'professional_tax', component: ProfessionalTaxComponent },
  { path: 'labour_welfare_fund', component: LwfComponent },
  { path: 'statutory_bonus', component: StatutoryBonusComponent },
  { path: 'statutory_components', component: StatutoryComponentComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmRoutingModule { }

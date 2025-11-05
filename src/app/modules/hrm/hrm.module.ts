import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HrmRoutingModule } from './hrm-routing.module';
import { SharedModule } from 'src/app/shared-module/shared-module.module';
import { EmployeeListComponent } from './masters/employee-list/employee-list.component';
import { AddEmployeeComponent } from './masters/add-employee/add-employee.component';
import { BackgroundVerificationComponent } from './masters/background-verification/background-verification.component';
import { OfferLetterComponent } from './Modifications/offer-letter/offer-letter.component';
import { HikeComponent } from './Modifications/hike/hike.component';
import { PayslipComponent } from './Modifications/payslip/payslip.component';
import { ServiceLetterComponent } from './Modifications/service-letter/service-letter.component';
import { FileUploadComponent } from './masters/file-upload/file-upload.component';
import { PayslipPopupComponent } from './masters/payslip-popup/payslip-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExperienceLetterComponent } from './Modifications/experience-letter/experience-letter.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CompanyConfigurationComponent } from './masters/company-configuration/company-configuration.component';
import { UpdateEmployeeComponent } from './masters/update-employee/update-employee.component';
import { ApplicantListComponent } from './career/applicant-list/applicant-list.component';
import { JobPostsComponent } from './career/job-posts/job-posts.component';
import { LeaveApprovalsComponent } from './leave-approvals/leave-approvals.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { PayrollAllowancesComponent } from './payroll-allowances/payroll-allowances.component';
import { PayrollDeductionsComponent } from './payroll-deductions/payroll-deductions.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { NgxEditorModule } from 'ngx-editor';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { EmployeeDashboardComponent } from './masters/employee-dashboard/employee-dashboard.component';
import { SalaryComponentsComponent } from './salary-components/salary-components.component';
import { PayrollReimbursementComponent } from './payroll-reimbursement/payroll-reimbursement.component';
import { EpfoComponent } from './epfo/epfo.component';
import { EsicComponent } from './esic/esic.component';
import { ProfessionalTaxComponent } from './professional-tax/professional-tax.component';
import { LwfComponent } from './lwf/lwf.component';
import { StatutoryBonusComponent } from './statutory-bonus/statutory-bonus.component';
import { StatutoryComponentComponent } from './statutory-component/statutory-component.component';
import { AdvanceSalaryComponent } from './advance-salary/advance-salary.component';
import { BulkAttendanceComponent } from './masters/bulk-attendance/bulk-attendance.component';
import { EmployeeWorkReportComponent } from './masters/employee-work-report/employee-work-report.component';
import { ToastrModule } from 'ngx-toastr';
import { RaisePoshComponent } from './masters/raise-posh/raise-posh.component';
import { LeaveRequestComponent } from './masters/leave-request/leave-request.component';
import { ShortlistedListComponent } from './career/shortlisted-list/shortlisted-list.component';
import { InterviewReportComponent } from './career/interview-report/interview-report.component';
import { AddAttendanceComponent } from './masters/add-attendance/add-attendance.component';
import { AdvancesalaryLoanComponent } from './masters/advancesalary-loan/advancesalary-loan.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    AddEmployeeComponent,
    BackgroundVerificationComponent,
    OfferLetterComponent,
    HikeComponent,
    PayslipComponent,
    ServiceLetterComponent,
    FileUploadComponent,
    PayslipPopupComponent,
    ExperienceLetterComponent,
    CompanyConfigurationComponent,
    UpdateEmployeeComponent,
    EmployeeDashboardComponent,
    ApplicantListComponent,
    JobPostsComponent,
    LeaveApprovalsComponent,
    LeaveBalanceComponent,
    PayrollAllowancesComponent,
    PayrollDeductionsComponent,
    AttendanceComponent,
    HrDashboardComponent,
    SalaryComponentsComponent,
    PayrollReimbursementComponent,
    EpfoComponent,
    EsicComponent,
    ProfessionalTaxComponent,
    LwfComponent,
    StatutoryBonusComponent,
    StatutoryComponentComponent,
    AdvanceSalaryComponent,
    BulkAttendanceComponent,
    EmployeeWorkReportComponent,
    RaisePoshComponent,
    LeaveRequestComponent,
    ShortlistedListComponent,
    InterviewReportComponent,
    AddAttendanceComponent,
    AdvancesalaryLoanComponent
  ],
  imports: [
    CommonModule,
    // MatCardModule,
    NgxEditorModule,
    HrmRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    DataTablesModule,
    BsDatepickerModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          // closeButton: true,
          progressBar: true
        }),
    // IMPORTANT: BaseChartDirective is standalone – import it here
    BaseChartDirective
  ],
  providers: [
    // Registers Chart.js defaults
    provideCharts(withDefaultRegisterables())
  ]
})
export class HrmModule { }


export class EmployeeModule { }

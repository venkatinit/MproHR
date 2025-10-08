import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './auth/register/register.component';
import { CustomerComponent } from './modules/Customers/customer/customer.component';
import { AddCustomerComponent } from './modules/Customers/add-customer/add-customer.component';
import { QuotationListComponent } from './modules/quotation/quotation-list/quotation-list.component';
import { AddQuotationComponent } from './modules/quotation/add-quotation/add-quotation.component';
import { InvoiceComponent } from './modules/invoice/invoice/invoice.component';
import { AddInvoiceComponent } from './modules/invoice/add-invoice/add-invoice.component';
import { CompanyListComponent } from './modules/Admin/company-list/company.list.component';
import { BankListComponent } from './modules/Banks/bank-list/bank-list.component';
import { ServiceListComponent } from './modules/services/service-list/service-list.component';
import { SubServiceListComponent } from './modules/Subservices/sub-service-list/sub-service-list.component';
import { StatesComponent } from './modules/states/states.component';
import { DistrictComponent } from './modules/district/district.component';
import { LeavetypesComponent } from './modules/leavetypes/leavetypes.component';
import { LeaveAllotmentComponent } from './modules/leave-allotment/leave-allotment.component';
import { CollectionsComponent } from './modules/collections/collections.component';
import { PriceComponent } from './modules/price/price.component';
import { ExpensesComponent } from './modules/expenses/expenses.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { CompanyLoginPageComponent } from './auth/company-login-page/company-login-page.component';
import { PlansComponent } from './modules/Admin/plans/plans.component';
import { UserPlanStatusComponent } from './modules/Admin/user-plan-status/user-plan-status.component';
import { BankBookComponent } from './modules/Banks/bank-book/bank-book.component';
import { CashBookComponent } from './modules/Banks/cash-book/cash-book.component';
import { AllTransactionsComponent } from './modules/Banks/all-transactions/all-transactions.component';
import { DepartmentComponent } from './modules/Organisation/department/department.component';
import { DesignationComponent } from './modules/Organisation/designation/designation.component';
import { OrgProfileComponent } from './modules/Organisation/org-profile/org-profile.component';
import { OrgStatusComponent } from './modules/Organisation/org-status/org-status.component';
import { WorkLocationComponent } from './modules/Organisation/work-location/work-location.component';
import { RolesComponent } from './modules/Organisation/roles/roles.component';
import { PayScheduleComponent } from './modules/Organisation/pay-schedule/pay-schedule.component';
import { WebPortalComponent } from './modules/Organisation/web-portal/web-portal.component';
import { EmpClaimRepComponent } from './modules/Organisation/emp-claim-rep/emp-claim-rep.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'member_login', component: CompanyLoginPageComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '', component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'hrm',
        loadChildren: () => import('./modules/hrm/hrm.module').then(m => m.HrmModule)
      },
      {
        path: 'employee',
        loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule)
      },
      { path: 'contact', component: ContactComponent },
      { path: 'settings', component: AboutCompanyComponent },
      { path: 'customers', component: CustomerComponent },
      { path: 'add_customers', component: AddCustomerComponent },
      { path: 'quotations', component: QuotationListComponent },
      { path: 'add_quatation', component: AddQuotationComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'add_invoice', component: AddInvoiceComponent },
      { path: 'company_list', component: CompanyListComponent },
      { path: 'bankList', component: BankListComponent },
      { path: 'bankBook', component: BankBookComponent },
      { path: 'cashBook', component: CashBookComponent },
      { path: 'all_Transactions', component: AllTransactionsComponent },
      { path: 'serviceList', component: ServiceListComponent },
      { path: 'subserviceList', component: SubServiceListComponent },
      { path: 'state', component: StatesComponent },
      { path: 'district', component: DistrictComponent },
      { path: 'type_of_leave', component: LeavetypesComponent },
      { path: 'leave_allotment', component: LeaveAllotmentComponent },
      { path: 'receipts', component: CollectionsComponent },
      { path: 'pricings', component: PriceComponent },
      { path: 'payments', component: ExpensesComponent },
      { path: 'users', component: ClientsComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'user_plan_status', component: UserPlanStatusComponent },
      { path: 'departments', component: DepartmentComponent },
      { path: 'designations', component: DesignationComponent },
      { path: 'org_profile', component: OrgProfileComponent },
      { path: 'org_status', component: OrgStatusComponent },
      { path: 'work_location', component: WorkLocationComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'paySchedule', component: PayScheduleComponent },
      { path: 'web_portals', component: WebPortalComponent },
      { path: 'Emp_claim_status', component: EmpClaimRepComponent },


    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
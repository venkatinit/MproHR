import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "../app/interceptors/auth-inteceptor";
import { LoaderInterceptor } from "./interceptors/loader-interceptor.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AuthGuard } from './gaurds/auth.guard';
import { AuthService } from './services/auth.service';
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared-module/shared-module.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from './api.client';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { ContactComponent } from './contact/contact.component';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { RegisterComponent } from './auth/register/register.component';
import { DataTablesModule } from 'angular-datatables';
import { CustomerComponent } from './modules/Customers/customer/customer.component';
import { AddCustomerComponent } from './modules/Customers/add-customer/add-customer.component';
import { QuotationListComponent } from './modules/quotation/quotation-list/quotation-list.component';
import { AddQuotationComponent } from './modules/quotation/add-quotation/add-quotation.component';
import { InvoiceComponent } from './modules/invoice/invoice/invoice.component';
import { AddInvoiceComponent } from './modules/invoice/add-invoice/add-invoice.component';
import { CompanyListComponent } from './modules/Admin/company-list/company.list.component';
import { LeaveRequestComponent } from './modules/employee/leave-request/leave-request.component';
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
import { OrgProfileComponent } from './modules/Organisation/org-profile/org-profile.component';
import { WorkLocationComponent } from './modules/Organisation/work-location/work-location.component';
import { DepartmentComponent } from './modules/Organisation/department/department.component';
import { DesignationComponent } from './modules/Organisation/designation/designation.component';
import { OrgStatusComponent } from './modules/Organisation/org-status/org-status.component';
import { RolesComponent } from './modules/Organisation/roles/roles.component';
import { PayScheduleComponent } from './modules/Organisation/pay-schedule/pay-schedule.component';
import { WebPortalComponent } from './modules/Organisation/web-portal/web-portal.component';
import { EmpClaimRepComponent } from './modules/Organisation/emp-claim-rep/emp-claim-rep.component';
import { OrgFolderComponent } from './modules/Organisation/org-folder/org-folder.component';
import { EmpFolderComponent } from './modules/Organisation/emp-folder/emp-folder.component';
import { CaListComponent } from './modules/Chartered Accountant/ca-list/ca-list.component';
import { CaOrgComponent } from './modules/Chartered Accountant/ca-org/ca-org.component';
import { CaCompanyEmployeeComponent } from './modules/Chartered Accountant/ca-company-employee/ca-company-employee.component';
import { CaTaskAssignComponent } from './modules/Chartered Accountant/ca-task-assign/ca-task-assign.component';
import { CaTicketsComponent } from './modules/Chartered Accountant/ca-tickets/ca-tickets.component';
import { OrgSubscriptionComponent } from './modules/Organisation/org-subscription/org-subscription.component';
import { OrgTaskAssignComponent } from './modules/Organisation/org-task-assign/org-task-assign.component';
import { OrgTicketsComponent } from './modules/Organisation/org-tickets/org-tickets.component';
import { CaDashboardComponent } from './modules/Chartered Accountant/ca-dashboard/ca-dashboard.component';
import { OrgDashboardComponent } from './modules/Organisation/org-dashboard/org-dashboard.component';
import { NgxEditorMenuComponent, NgxEditorModule } from "ngx-editor";
import { HolidayCalenderComponent } from './modules/Organisation/holiday-calender/holiday-calender.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const APP_CONTAINERS = [DefaultLayoutComponent];
@NgModule({
  declarations: [
    AppComponent, ...APP_CONTAINERS,
    DefaultLayoutComponent,
    LoginComponent,
    AboutCompanyComponent,
    ContactComponent,
    RegisterComponent,
    CustomerComponent,
    AddCustomerComponent,
    QuotationListComponent,
    AddQuotationComponent,
    InvoiceComponent,
    AddInvoiceComponent,
    CompanyListComponent,
    LeaveRequestComponent,
    BankListComponent,
    ServiceListComponent,
    SubServiceListComponent,
    StatesComponent,
    DistrictComponent,
    LeavetypesComponent,
    LeaveAllotmentComponent,
    CollectionsComponent,
    PriceComponent,
    ExpensesComponent,
    ClientsComponent,
    CompanyLoginPageComponent,
    PlansComponent,
    UserPlanStatusComponent,
    BankBookComponent,
    CashBookComponent,
    AllTransactionsComponent,
    OrgProfileComponent,
    WorkLocationComponent,
    DepartmentComponent,
    DesignationComponent,
    OrgStatusComponent,
    RolesComponent,
    PayScheduleComponent,
    WebPortalComponent,
    EmpClaimRepComponent,
    OrgFolderComponent,
    EmpFolderComponent,
    CaListComponent,
    CaOrgComponent,
    CaCompanyEmployeeComponent,
    CaTaskAssignComponent,
    CaTicketsComponent,
    OrgSubscriptionComponent,
    OrgTaskAssignComponent,
    OrgTicketsComponent,
    CaDashboardComponent,
    OrgDashboardComponent,
    HolidayCalenderComponent,
   
  ],
  imports: [
    CommonModule,
    NgxEditorModule,
    NgbModalModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgbModule,
    DataTablesModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      // closeButton: true,
      progressBar: true
    }),
    AppRoutingModule,
    NgxEditorMenuComponent
  ],
  providers: [
    AuthGuard,
    ApiService,
    AuthService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

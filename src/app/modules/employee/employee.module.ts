import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
// import { AttendanceComponent } from './attendance/attendance.component';
import { ToastrModule } from 'ngx-toastr';
// import { RaisePoshComponent } from './raise-posh/raise-posh.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgxEditorModule, NgxEditorMenuComponent } from 'ngx-editor';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared-module/shared-module.module';


@NgModule({
  declarations: [
    // AttendanceComponent,
    // RaisePoshComponent
  ],
  imports: [
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
    NgxEditorMenuComponent,
    EmployeeRoutingModule,
  ]
})
export class EmployeeModule { }

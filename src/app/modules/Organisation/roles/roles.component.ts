import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response';
import { ToastrService } from 'ngx-toastr';
// import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  roleList = [
    { "role": "Super Admin", "description": "No Restrictions to all modules " },
    { "role": "Admin", "description": "Available all modules except Super-Admin Fields" },
    { "role": "Manager", "description": "Available all modules related to the specific company" },
    { "role": "Reviewer", "description": "Same as Manager for reviewing" },
    { "role": "User", "description": "Allows only some modules to entry and maintain the Employer and Employee data" },
  ]
}

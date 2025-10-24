import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ca-dashboard',
  templateUrl: './ca-dashboard.component.html',
  styleUrls: ['./ca-dashboard.component.scss']
})
export class CaDashboardComponent implements OnInit, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  form: FormGroup;
  addTask: FormGroup;
  errors: any[];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private util: UtilsServiceService,
    private toast: ToastrService
  ) { }
  applicant_list = [
    { 'id': 1, 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'id': 2, 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'id': 3, 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'id': 4, 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'id': 5, 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' }
  ]
  task_list = [
    { 'taskName': 'Team Discussion' },
    { 'taskName': 'Team Discussion' },
    { 'taskName': 'Team Discussion' },
    { 'taskName': 'Team Discussion' },
    { 'taskName': 'Team Discussion' },
    { 'taskName': 'Team Discussion' },

  ]
  submitted: any;

  ngOnInit(): void {
    this.addTask = this.formBuilder.group({
      task: ['', Validators.required]
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      responsive: true,
      autoWidth: false,
      scrollX: false, // optional
      language: {
        emptyTable: 'No records found'
      }
    };
    this.dtTrigger.next(null);
  }
  Submit() {
    this.submitted = true;
    if (!this.addTask.valid) {
      return;
    }
    const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const url = "api/accounting/task";
    const body = {
      "id": 0,
      "task": companyId,
      "created_At": new Date(),
      "created_By": 0,
      "status": true,
    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addTask.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Customer added successfully', 'Success');
        window.location.reload();

      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.toast.error(this.errors[0], 'Customer Not added  successfully');

      }
    );
  }
  get f() {
    return this.addTask.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit(): void {
    Chart.register(...registerables); // ✅ Register chart components
    this.renderPieChart();
  }
  renderPieChart() {
    const ctx = document.getElementById('caPieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Registered', 'Active', 'Inactive', 'Hold'],
        datasets: [{
          data: [1244, 344, 500, 400],
          backgroundColor: ['#4e73df', '#1cc88a', '#e74a3b', '#ece423'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }
  handleLeaveAction(id: number) {
    Swal.fire({
      title: 'Choose an action',
      text: 'What would you like to do with this request?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Approve',
      denyButtonText: 'Reject',
      cancelButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // Approve
        const body = {
          id: id,
          status: 'Approved',
          role: 'Admin',
        };
        this.api.put(`leave/approve/${id}`, body).subscribe({
          next: (res: any) => {
            Swal.fire('Approved!', 'Request has been approved.', 'success');
            // this.PendingRequests();
          },
          error: (err: any) => {
            Swal.fire('Error!', 'Failed to approve the Request.', 'error');
            console.log(err);
          }
        });

      } else if (result.isDenied) {
        // Reject
        const body = {
          id: id,
          status: 'Rejected',
          role: 'Admin',
        };
        this.api.put(`Request/reject/${id}`, body).subscribe({
          next: (res: any) => {
            Swal.fire('Rejected!', 'Request has been rejected.', 'info');
            // this.PendingRequests();
          },
          error: (err: any) => {
            Swal.fire('Error!', 'Failed to reject the Request.', 'error');
            console.log(err);
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Delete
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete this Request record?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it',
          cancelButtonText: 'No, cancel',
        }).then((confirmDelete) => {
          if (confirmDelete.isConfirmed) {
            this.api.delete(`api/admin/Request/allotment/${id}`).subscribe({
              next: (res: any) => {
                Swal.fire('Deleted!', 'The Request has been deleted.', 'success');
                // this.PendingRequests();
              },
              error: (err: any) => {
                Swal.fire('Error!', 'Failed to delete the Request.', 'error');
                console.log(err);
              }
            });
          } else {
            Swal.fire('Cancelled', 'Request record is safe.', 'info');
          }
        });
      }
    });
  }
}
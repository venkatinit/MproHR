import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
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
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' }
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
        labels: ['Registered', 'Active', 'Inactive'],
        datasets: [{
          data: [1244, 744, 500],
          backgroundColor: ['#4e73df', '#1cc88a', '#e74a3b'],
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
}
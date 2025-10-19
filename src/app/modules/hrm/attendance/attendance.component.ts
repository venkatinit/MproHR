
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.client';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
declare var $: any;
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  employeeDetails: any;
  attendanceData: any[] = [];
  totalDays = 31;
  totalPresent = 0;
  totalAbsent = 0;
  totalLeave = 0;
  totalHoliday = 0;
  attendancePercent: string = '';
  employeeId: number;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private util: UtilsServiceService,) { }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployeeDetails();  
  }

  loadEmployeeDetails(): void {

    this.api.get(`${this.employeeId}`).subscribe(
      (res: any) => {
        if (res || res.data) {
          this.employeeDetails = res.data || res;
          this.employeeId = this.employeeDetails.id;
          this.generateAttendanceData();

        }
        // this.loading = false;
      },
      (error) => {
        console.error('Error fetching employee details', error);
        // this.loading = false;
      }
    );
  }

  generateAttendanceData() {
    // Dummy data for 31 days
    const statuses = ['P', 'A', 'L', 'H'];
    this.attendanceData = Array.from({ length: this.totalDays }, (_, i) => ({
      day: i + 1,
      date: `2025-10-${(i + 1).toString().padStart(2, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));

    this.totalPresent = this.attendanceData.filter(d => d.status === 'P').length;
    this.totalAbsent = this.attendanceData.filter(d => d.status === 'A').length;
    this.totalLeave = this.attendanceData.filter(d => d.status === 'L').length;
    this.totalHoliday = this.attendanceData.filter(d => d.status === 'H').length;

    this.attendancePercent = ((this.totalPresent / this.totalDays) * 100).toFixed(2);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'P': return 'present';
      case 'A': return 'absent';
      case 'L': return 'leave';
      case 'H': return 'holiday';
      default: return '';
    }
  }

}
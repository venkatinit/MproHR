import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
type Status = 'Present' | 'Absent' | 'Delayed' | 'Leave';
@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.scss']
})
export class HrDashboardComponent implements OnInit {
  // Calendar state
  attendanceChart!: Chart;

  viewDate: Date = new Date();
  filterType: 'daily' | 'monthly' | 'yearly' = 'daily';

  // Employee filter
  employees = [
    { id: 'emp1', name: 'Venkat' },
    { id: 'emp2', name: 'Siva' },
    { id: 'emp3', name: 'Anitha' }
  ];
  selectedEmployee = this.employees[0].id;
  private attendance: Record<string, Record<string, Status>> = {
    emp1: { },
    emp2: {},
    emp3: {}
  };

  stats = {
    totalEmployees: 5000,
    checkedIn: 4500,
    notCheckedIn: 500,
    onLeave: 456,
    weeklyOff: 145,
    holiday: 12,
    checkedOut: 250
  };
  attendanceData = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      present: [90, 85, 88, 92, 87, 80, 70],
      absent: [10, 15, 12, 8, 13, 20, 30]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      present: [88, 90, 92, 87, 85, 89, 10],
      absent: [12, 10, 8, 13, 15, 11, 20]
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024'],
      present: [89, 91, 90, 88],
      absent: [11, 9, 10, 12]
    }
  };
  loadAttendanceChart() {
    const selectedData = this.attendanceData[this.filterType];

    if (this.attendanceChart) {
      this.attendanceChart.destroy(); // Destroy old chart before creating a new one
    }

    this.attendanceChart = new Chart('attendanceChart', {
      type: 'bar',
      data: {
        labels: selectedData.labels,
        datasets: [
          {
            label: 'Present %',
            data: selectedData.present,
            backgroundColor: '#4da3ff'
          },
          {
            label: 'Absent %',
            data: selectedData.absent,
            backgroundColor: '#f44336'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }
  // Calendar events (built for the current month + employee)
  events: CalendarEvent[] = [];

  // Chart
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Monthly Attendance' }
    },
    scales: {
      x: { ticks: { autoSkip: false } }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Present', 'Absent', 'Delayed', 'Leave'],
    datasets: [
      {
        data: [0, 0, 0, 0]
      }
    ]
  };
  api: any;

  constructor(private formBuilder:FormBuilder) {
    // seed a little fake data for demo so you see colors immediately
    this.seedSample(this.selectedEmployee, this.viewDate);
    this.refreshForEmployeeAndMonth();
  }

  // Build month’s events + chart totals
  refreshForEmployeeAndMonth() {
    this.events = this.buildEventsForMonth(this.selectedEmployee, this.viewDate);
    const totals = this.countMonthlyTotals(this.selectedEmployee, this.viewDate);
    this.barChartData = {
      labels: ['Present', 'Absent', 'Delayed', 'Leave'],
      datasets: [{ data: [totals.Present, totals.Absent, totals.Delayed, totals.Leave] }]
    };
  }

  // Month navigation
  prevMonth() {
    this.viewDate = addDays(startOfMonth(this.viewDate), -1);
    this.viewDate = startOfMonth(this.viewDate);
    this.refreshForEmployeeAndMonth();
  }
  nextMonth() {
    this.viewDate = addDays(endOfMonth(this.viewDate), 1);
    this.viewDate = startOfMonth(this.viewDate);
    this.refreshForEmployeeAndMonth();
  }
  today() {
    this.viewDate = new Date();
    this.refreshForEmployeeAndMonth();
  }

  onEmployeeChange() {
    this.refreshForEmployeeAndMonth();
  }

  // Helpers
  private dateKey(d: Date) {
    return format(d, 'yyyy-MM-dd');
  }

  private colorFor(status: Status) {
    switch (status) {
      case 'Present': return { primary: '#28a745', secondary: '#DFF2E1' }; // green
      case 'Absent': return { primary: '#dc3545', secondary: '#F8D7DA' }; // red
      case 'Delayed': return { primary: '#fd7e14', secondary: '#FFE5D0' }; // orange
      case 'Leave': return { primary: '#0d6efd', secondary: '#CCE5FF' }; // blue
    }
  }

  private buildEventsForMonth(empId: string, month: Date): CalendarEvent[] {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    const records = this.attendance[empId] || {};
    return days
      .filter(day => !!records[this.dateKey(day)])
      .map(day => {
        const status = records[this.dateKey(day)];
        return {
          start: day,
          title: status,
          color: this.colorFor(status),
          allDay: true
        } as CalendarEvent;
      });
  }

  private countMonthlyTotals(empId: string, month: Date) {
    const tally: Record<Status, number> = {
      Present: 0,
      Absent: 0,
      Delayed: 0,
      Leave: 0
    };
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const records = this.attendance[empId] || {};

    eachDayOfInterval({ start, end }).forEach(day => {
      const s = records[this.dateKey(day)];
      if (s) tally[s]++;
    });

    return tally;
  }

  // Demo seed so you’ll see colors on load
  private seedSample(empId: string, month: Date) {
    const start = startOfMonth(month);
    const k1 = this.dateKey(start);
    const k2 = this.dateKey(addDays(start, 1));
    const k3 = this.dateKey(addDays(start, 2));
    const k4 = this.dateKey(addDays(start, 3));
    const k5 = this.dateKey(addDays(start, 4));

    this.attendance[empId] = {
      ...this.attendance[empId],
      [k1]: 'Present',
      [k2]: 'Absent',
      [k3]: 'Delayed',
      [k4]: 'Leave',
      [k5]: 'Present'
    };
  }


  changeFilter(type: 'daily' | 'monthly' | 'yearly') {
    this.filterType = type;
    this.loadAttendanceChart();
  }
  // payslip
  payslipForm:FormGroup;

ngOnInit(): void {
   this.payslipForm = this.formBuilder.group({
        employeeId: ['', Validators.required],
        ctc: ['', Validators.required],
        allowances: this.formBuilder.array([]),
        deductions: this.formBuilder.array([]),
        otherAllowance: [''],
        total_Allowances: [{ value: 0, disabled: true }],
        total_Deductions: [{ value: 0, disabled: true }],
        take_Home_Salary: [{ value: 0, disabled: true }]
      });
  this.loadAttendanceChart();
  new Chart('pieChart', {
    type: 'pie',
    data: {
      labels: ['Checked In', 'Not Checked In', 'On Leave', 'On Week off', 'Holiday', 'Checked Out'],
      datasets: [
        {
          data: [350, 50, 50, 20, 20, 10],
          // backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#333',       // Label color
            font: {
              size: 16,          // Label font size
              weight: 'bold'
            }
          },
          position: 'right'    // Legend position
        }
      }
    }
  });
}
}

// import { Component, OnInit } from '@angular/core';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);
// @Component({
//   selector: 'app-employee-dashboard',
//   templateUrl: './employee-dashboard.component.html',
//   styleUrls: ['./employee-dashboard.component.scss']
// })
// export class EmployeeDashboardComponent implements OnInit {
//   attendanceChart!: Chart;
//   filterType: 'daily' | 'monthly' | 'yearly' = 'daily';
//   constructor() {
//     Chart.register(...registerables);
//   }

//   ngOnInit() {
//     this.loadAttendanceChart();
//     new Chart('pieChart', {
//       type: 'pie',
//       data: {
//         labels: ['Checked In', 'Not Checked In', 'On Leave', 'On Week off', 'Holiday', 'Checked Out'],
//         datasets: [
//           {
//             data: [350, 50, 50, 20, 20, 10],
//             // backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             labels: {
//               color: '#333',       // Label color
//               font: {
//                 size: 16,          // Label font size
//                 weight: 'bold'
//               }
//             },
//             position: 'right'    // Legend position
//           }
//         }
//       }
//     });
//   }
//   attendanceData = {
//     daily: {
//       labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//       present: [90, 85, 88, 92, 87, 80, 70],
//       absent: [10, 15, 12, 8, 13, 20, 30]
//     },
//     monthly: {
//       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//       present: [88, 90, 92, 87, 85, 89,10],
//       absent: [12, 10, 8, 13, 15, 11,20]
//     },
//     yearly: {
//       labels: ['2021', '2022', '2023', '2024'],
//       present: [89, 91, 90, 88],
//       absent: [11, 9, 10, 12]
//     }
//   };
//   loadAttendanceChart() {
//     const selectedData = this.attendanceData[this.filterType];

//     if (this.attendanceChart) {
//       this.attendanceChart.destroy(); // Destroy old chart before creating a new one
//     }

//     this.attendanceChart = new Chart('attendanceChart', {
//       type: 'bar',
//       data: {
//         labels: selectedData.labels,
//         datasets: [
//           {
//             label: 'Present %',
//             data: selectedData.present,
//             backgroundColor: '#4da3ff'
//           },
//           {
//             label: 'Absent %',
//             data: selectedData.absent,
//             backgroundColor: '#f44336'
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true,
//             max: 100,
//             ticks: {
//               callback: function (value) {
//                 return value + '%';
//               }
//             }
//           }
//         }
//       }
//     });
//   }

//   changeFilter(type: 'daily' | 'monthly' | 'yearly') {
//     this.filterType = type;
//     this.loadAttendanceChart();
//   }

//   stats = {
//     totalEmployees: 5000,
//     checkedIn: 4500,
//     notCheckedIn: 500,
//     onLeave: 456,
//     weeklyOff: 145,
//     holiday: 12,
//     checkedOut: 250
//   };

 

//   // onTimeCheckInData = {
//   //   labels: ['5 Sep', '6 Sep', '7 Sep', '8 Sep', '9 Sep', '10 Sep', '11 Sep'],
//   //   datasets: [
//   //     {
//   //       label: 'Employees',
//   //       data: [5, 10, 12, -5, 0, 8, -2],
//   //       backgroundColor: '#4da3ff'
//   //     }
//   //   ]
//   // };

//   // overtimeData = {
//   //   labels: ['5 Sep', '6 Sep', '7 Sep', '8 Sep', '9 Sep', '10 Sep', '11 Sep'],
//   //   datasets: [
//   //     {
//   //       label: 'Hours',
//   //       data: [10, 15, 40, 5, 8, 3, 6],
//   //       backgroundColor: '#4da3ff'
//   //     }
//   //   ]
//   // };
// }

// import { Component, OnInit } from '@angular/core';
//   import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// interface Holiday {
//   dateISO: string; // YYYY-MM-DD local format
//   name: string;
//   note?: string;
// }
// @Component({
//   selector: 'app-holiday-calender',
//   templateUrl: './holiday-calender.component.html',
//   styleUrls: ['./holiday-calender.component.scss']
// })
// export class HolidayCalenderComponent implements OnInit {
//   year = new Date().getFullYear();
//   months: { name: string; monthIndex: number; weeks: Date[][] } [] = [];
//   weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   // holidays map keyed by ISO date
//   holidaysMap: { [iso: string]: Holiday } = { };

//   // form
//   holidayForm!: FormGroup;
//   editingDateISO: string | null = null; // currently editing date ISO string
//   localStorageKey = 'hr_holidays';

//   constructor(private fb: FormBuilder) { }

//   ngOnInit(): void {
//     this.loadHolidays();
//     this.generateCalendar(this.year);

//     this.holidayForm = this.fb.group({
//       dateISO: ['', Validators.required],
//       name: ['', Validators.required],
//       note: ['']
//     });
//   }

//   // generate months with weeks (each week is array of 7 Date objects or null placeholders)
//   generateCalendar(year: number) {
//     this.months = [];
//     for (let m = 0; m < 12; m++) {
//       const weeks: Date[][] = [];
//       const first = new Date(year, m, 1);
//       const last = new Date(year, m + 1, 0); // last day of month
//       let cur = new Date(first);
//       // move cur back to Sunday of first week
//       cur.setDate(cur.getDate() - cur.getDay());

//       while (cur <= last || cur.getDay() !== 0) {
//         const week: Date[] = [];
//         for (let d = 0; d < 7; d++) {
//           week.push(new Date(cur)); // push a copy
//           cur.setDate(cur.getDate() + 1);
//         }
//         weeks.push(week);
//       }

//       this.months.push({
//         name: first.toLocaleString(undefined, { month: 'long' }),
//         monthIndex: m,
//         weeks
//       });
//     }
//   }

//   // helpers
//   isSameDay(a: Date, bISO: string) {
//     const iso = this.toISODate(a);
//     return iso === bISO;
//   }

//   toISODate(d: Date) {
//     const y = d.getFullYear();
//     const mo = (d.getMonth() + 1).toString().padStart(2, '0');
//     const da = d.getDate().toString().padStart(2, '0');
//     return `${y}-${mo}-${da}`;
//   }

//   isWeekend(date: Date) {
//     const day = date.getDay();
//     return day === 0 || day === 6; // Sun or Sat
//   }

//   isCurrentMonth(date: Date, monthIndex: number) {
//     return date.getMonth() === monthIndex;
//   }

//   // holiday functions
//   addOrUpdateHoliday() {
//     if (this.holidayForm.invalid) return;
//     const { dateISO, name, note } = this.holidayForm.value;
//     this.holidaysMap[dateISO] = { dateISO, name, note };
//     this.saveHolidays();
//     this.closeForm();
//   }

//   editHolidayForDate(date: Date) {
//     const iso = this.toISODate(date);
//     this.editingDateISO = iso;
//     const exist = this.holidaysMap[iso];
//     this.holidayForm.reset();
//     this.holidayForm.patchValue({
//       dateISO: iso,
//       name: exist ? exist.name : '',
//       note: exist ? exist.note : ''
//     });
//     // scroll to form or focus - handled by template
//   }

//   removeHoliday(dateISO ?: string) {
//     const key = dateISO || this.editingDateISO;
//     if (!key) return;
//     delete this.holidaysMap[key];
//     this.saveHolidays();
//     this.closeForm();
//   }

//   closeForm() {
//     this.editingDateISO = null;
//     this.holidayForm.reset();
//   }

//   // persistence
//   saveHolidays() {
//     const arr = Object.values(this.holidaysMap);
//     localStorage.setItem(this.localStorageKey, JSON.stringify(arr));
//   }

//   loadHolidays() {
//     const raw = localStorage.getItem(this.localStorageKey);
//     if (!raw) {
//       // seed with a few sample holidays (optional)
//       const sample: Holiday[] = [
//         { dateISO: `${this.year}-01-26`, name: 'Republic Day' },
//         { dateISO: `${this.year}-08-15`, name: 'Independence Day' },
//         { dateISO: `${this.year}-10-02`, name: 'Gandhi Jayanti' }
//       ];
//       sample.forEach(s => (this.holidaysMap[s.dateISO] = s));
//       this.saveHolidays();
//       return;
//     }
//     try {
//       const parsed: Holiday[] = JSON.parse(raw);
//       this.holidaysMap = {};
//       parsed.forEach(h => (this.holidaysMap[h.dateISO] = h));
//     } catch {
//       this.holidaysMap = {};
//     }
//   }

//   // change year
//   changeYear(offset: number) {
//     this.year += offset;
//     this.generateCalendar(this.year);
//   }

//   // convenience: show holiday name
//   getHolidayName(iso: string) {
//     return this.holidaysMap[iso]?.name ?? null;
//   }
// }

 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

interface Holiday {
  dateISO: string; // YYYY-MM-DD format
  name: string;
  note?: string;
}

@Component({
  selector: 'app-holiday-calender',
  templateUrl: './holiday-calender.component.html',
  styleUrls: ['./holiday-calender.component.scss']
})
export class HolidayCalenderComponent implements OnInit {
  year = new Date().getFullYear();
  months: { name: string; monthIndex: number; weeks: Date[][] }[] = [];
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  holidaysMap: { [iso: string]: Holiday } = {};

  holidayForm!: FormGroup;
  editingDateISO: string | null = null;

  private apiUrl = 'https://your-backend.com/api/holidays'; // 👈 change this to your real API

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.generateCalendar(this.year);
    this.initForm();
    this.loadHolidaysFromApi();
  }

  initForm() {
    this.holidayForm = this.fb.group({
      dateISO: ['', Validators.required],
      name: ['', Validators.required],
      note: ['']
    });
  }

  /** Generate months with Monday as the first day of the week */
  generateCalendar(year: number) {
    this.months = [];
    for (let m = 0; m < 12; m++) {
      const weeks: Date[][] = [];
      const firstDay = new Date(year, m, 1);
      const lastDay = new Date(year, m + 1, 0);

      // Start week from Monday
      let start = new Date(firstDay);
      const dayOfWeek = (start.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      start.setDate(start.getDate() - dayOfWeek);

      while (start <= lastDay || (start.getMonth() === m && start.getDay() !== 1)) {
        const week: Date[] = [];
        for (let d = 0; d < 7; d++) {
          week.push(new Date(start));
          start.setDate(start.getDate() + 1);
        }
        weeks.push(week);
      }

      this.months.push({
        name: firstDay.toLocaleString(undefined, { month: 'long' }),
        monthIndex: m,
        weeks
      });
    }
  }

  toISODate(d: Date) {
    const y = d.getFullYear();
    const mo = (d.getMonth() + 1).toString().padStart(2, '0');
    const da = d.getDate().toString().padStart(2, '0');
    return `${y}-${mo}-${da}`;
  }

  isWeekend(date: Date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  isCurrentMonth(date: Date, monthIndex: number) {
    return date.getMonth() === monthIndex;
  }

  /** Form operations */
  editHolidayForDate(date: Date) {
    const iso = this.toISODate(date);
    this.editingDateISO = iso;
    const exist = this.holidaysMap[iso];
    this.holidayForm.patchValue({
      dateISO: iso,
      name: exist?.name || '',
      note: exist?.note || ''
    });
  }

  closeForm() {
    this.editingDateISO = null;
    this.holidayForm.reset();
  }

  addOrUpdateHoliday() {
    if (this.holidayForm.invalid) return;
    const holiday = this.holidayForm.value as Holiday;
    this.holidaysMap[holiday.dateISO] = holiday;

    // Save to backend
    this.http.post(`${this.apiUrl}`, holiday).subscribe(() => {
      this.closeForm();
      this.loadHolidaysFromApi();
    });
  }

  removeHoliday() {
    if (!this.editingDateISO) return;
    const date = this.editingDateISO;
    this.http.delete(`${this.apiUrl}/${date}`).subscribe(() => {
      delete this.holidaysMap[date];
      this.closeForm();
    });
  }

  changeYear(offset: number) {
    this.year += offset;
    this.generateCalendar(this.year);
    this.loadHolidaysFromApi();
  }

  /** Load holidays from API */
  loadHolidaysFromApi() {
    this.http.get<Holiday[]>(`${this.apiUrl}?year=${this.year}`).subscribe({
      next: (res) => {
        this.holidaysMap = {};
        res.forEach(h => (this.holidaysMap[h.dateISO] = h));
      },
      error: () => {
        console.error('Failed to load holidays');
      }
    });
  }

  /** Export holidays to Excel */
  exportToExcel() {
    const holidays = Object.values(this.holidaysMap);
    const worksheet = XLSX.utils.json_to_sheet(holidays);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${this.year} Holidays`);
    XLSX.writeFile(workbook, `Holidays_${this.year}.xlsx`);
  }
}

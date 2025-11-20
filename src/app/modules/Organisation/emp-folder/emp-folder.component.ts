import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.client';
import { Employee } from '../employee.model';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
declare var bootstrap: any;
@Component({
  selector: 'app-emp-folder',
  templateUrl: './emp-folder.component.html',
  styleUrls: ['./emp-folder.component.scss']
})


export class EmpFolderComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  filteredDocuments: any[] = [];
  loading = false;
  filteredEmployees: any[] = [];
  searchTerm: string = '';

  constructor(
    private toast: ToastrService,
    private util: UtilsServiceService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.getEmployeeList();
  }

 
  getEmployeeList() {
    this.loading = true;
    const compannyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    const queryParams = new URLSearchParams({
      compannyId: compannyId,
    }).toString();

    this.api.get(`all_employees?${queryParams}`).subscribe({
      next: (res: any) => {
        this.employees = res;
        this.filteredEmployees = res; // ✅ initialize filtered list
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading employees', err);
        this.toast.error('Failed to load employees');
      },
    });
  }

  filterEmployees() {
    const term = this.searchTerm?.toLowerCase().trim() || '';
    this.filteredEmployees = this.employees.filter(
      (emp) =>
        emp.full_Name?.toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) ||
        emp.employee_Code?.toLowerCase().includes(term)
    );
  }
  onSelectEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.getEmployeeDetails(employee.id);
  }

  getEmployeeDetails(id: number) {
    this.loading = true;
    this.api.get<Employee>(`${id}`).subscribe({
      next: (res: any) => {
        const emp: Employee = res;
        this.selectedEmployee = emp;
        this.filteredDocuments = [
          ...(emp.educationDetails || []),
          ...(emp.experienceDetails || []),
          ...(emp.kycDocuments || []),
        ];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching employee details:', err);
        this.toast.error('Failed to fetch employee details');
      },
    });
  }

  isImage(filePath: string): boolean {
    if (!filePath) return false;
    const extension = filePath.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension || '');
  }

  openPreview(doc: any) {
    window.open(`https://payrolladmin.nginfosolutions.com${doc.path || doc.document_Path}`, '_blank');
  }
}

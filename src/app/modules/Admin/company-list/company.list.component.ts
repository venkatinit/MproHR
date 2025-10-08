import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
// import { FileUploadComponent } from '../../hrm/masters/file-upload/file-upload.component';
import { ApiService } from 'src/app/api.client';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from '../../hrm/masters/file-upload/file-upload.component';
// import { FileUploadComponent } from 'src/app/hrm/masters/file-upload/file-upload.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  company_list: any[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;
  loading = false;
  company_remove: any;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private api: ApiService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      destroy: true,
      processing: true
    };
    this.getCompanyList();
  }

  getCompanyList() {
    this.api.get(`api/company/all?page=${this.page}&limit=${this.limit}`).subscribe({
      next: (res: any) => {
        this.company_list = res?.data?.data || [];
        this.total = res?.data?.total || 0;
        this.dtTrigger.next(null);
        this.toast.success('Companies Data Retrieved successfully', 'Success');

      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      }
    });
  }
  onPageChange(pageNum: number) {
    this.page = pageNum;
    this.getCompanyList();
  }
  open_fileUpload(): void {
    const modalRef = this.modalService.open(FileUploadComponent, {
      windowClass: 'custom-ngb-modal-window',
      backdropClass: 'custom-ngb-modal-backdrop',
      size: 'md'
    });

    modalRef.result.then(
      (result) => {
        if (result === 'Success') {
          this.getCompanyList();
        }
      },
      () => {
      }
    );
  }

  updateCompany(i: number): void {
    const Company = this.company_list[i];
    this.router.navigate(['/update-Company'], { state: { Company } });
  }

  deleteCompany(Id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this company record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {
        this.api.delete(`api/company/${Id}`).subscribe({
          next: (res: any) => {
            Swal.fire('Deleted!', 'Company has been deleted.', 'success');
            this.getCompanyList(); // ✅ Reload list without refreshing page
          },
          error: (err) => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
            console.error(err);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Company is safe.', 'info');
      }
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}

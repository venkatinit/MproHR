
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { FileUploadComponent } from '../../masters/file-upload/file-upload.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.scss']
})
export class ApplicantListComponent {
  addEmployee: any;
  invoice: any;
  constructor(private modalService: NgbModal, private router: Router) { }
  dtOptions: DataTables.Settings = {};
  persons: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();

  applicant_list = [
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0002', 'emp_name': ' Siva', 'email': ' Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' }

  ]
  open_fileUpload() {
    const options = {
      windowClass: 'custom-ngb-modal-window',
      backdropClass: 'custom-ngb-modal-backdrop',
      size: 'md'
    };
    const modalRef = this.modalService.open(FileUploadComponent, options);
    // Pass any additional data you need to display in the modal
    // modalRef.componentInstance.userAnswers = this.userAnswers; 
    modalRef.result.then(
      (data) => {
        // Handle modal result
      },
      (error) => {
        if (error === 'Success') {
          // Handle success
        }
      }
    );
  }
  updateEmployee(index: number) {
    this.router.navigate(['/update-employee']);

  }
  deleteEmployee(index: number): void {
    if (confirm("Are you sure you want to delete this employee?")) {
      this.applicant_list.splice(index, 1);
      // alert("Employee deleted successfully!");
    }
  }



}

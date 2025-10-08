import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-company-configuration',
  templateUrl: './company-configuration.component.html',
  styleUrls: ['./company-configuration.component.scss']
})
export class CompanyConfigurationComponent {
  constructor(private modalService: NgbModal){}
  dtOptions: DataTables.Settings = {};
  persons: any[] = []; 
  dtTrigger: Subject<any> = new Subject<any>();
  employee_list=[
    {'emp_code':'NG0001','emp_name':'Venkat','email':'Venkat@gmail.com','mbl_no':'7987578478','dept':'IT','designation':'Angular Developer'},
    {'emp_code':'NG0002','emp_name':' Siva','email':' Siva@gmail.com','mbl_no':'7987578478','dept':'IT','designation':'Angular Developer'},
    {'emp_code':'NG0001','emp_name':'Venkat','email':'Venkat@gmail.com','mbl_no':'7987578478','dept':'IT','designation':'Angular Developer'},
    {'emp_code':'NG0002','emp_name':' Siva','email':' Siva@gmail.com','mbl_no':'7987578478','dept':'IT','designation':'Angular Developer'}
  
    ]
      open_fileUpload(){
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
    ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      this.dtTrigger.unsubscribe();
    } 
}

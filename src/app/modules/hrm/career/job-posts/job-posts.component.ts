import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../../masters/file-upload/file-upload.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-job-posts',
  templateUrl: './job-posts.component.html',
  styleUrls: ['./job-posts.component.scss']
})
export class JobPostsComponent implements OnInit, OnDestroy {

  activeModal: any;
  addPost!: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;

  dtOptions: DataTables.Settings = {};
  isSelected: any;
  dtTrigger: Subject<any> = new Subject<any>();

  editor!: Editor;   // ngx-editor instance
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4'] }],
    ['link', 'image'],
    ['align_left', 'align_center', 'align_right'],
  ];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // ✅ Initialize ngx-editor
    this.editor = new Editor();

    // Reactive form
    this.addPost = this.formBuilder.group({
      job_role: ['', Validators.required],
      employee_type: ['', Validators.required],
      industry_type: ['', Validators.required],
      experience: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      department: ['', Validators.required],
      skills: ['', Validators.required],
      positions: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      requirements: ['', Validators.required],
      summary: ['', Validators.required] // ✅ bind this to ngx-editor
    });
  }

  ngOnDestroy(): void {
    // ✅ Destroy editor to prevent memory leaks
    if (this.editor) {
      this.editor.destroy();
    }
  }

  get f() {
    return this.addPost.controls;
  }

  applicant_list = [
    { 'emp_code': 'NG0001', 'emp_name': 'Venkat', 'email': 'Venkat@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
    { 'emp_code': 'NG0002', 'emp_name': 'Siva', 'email': 'Siva@gmail.com', 'mbl_no': '7987578478', 'dept': 'IT', 'designation': 'Angular Developer' },
  ];

  open_fileUpload() {
    const options = {
      windowClass: 'custom-ngb-modal-window',
      backdropClass: 'custom-ngb-modal-backdrop',
      size: 'md'
    };
    const modalRef = this.modalService.open(FileUploadComponent, options);
    modalRef.result.then(
      (data) => { },
      (error) => {
        if (error === 'Success') {
          // Handle success
        }
      }
    );
  }

  saveaddPost() {
    this.submitted = true;
    if (this.addPost.invalid) {
      return;
    }
    console.log("Job Post Data:", this.addPost.value);
    alert("Job Post Saved!");
  }

  updateEmployee(index: number) {
    this.router.navigate(['/update-employee']);
  }

  deleteEmployee(index: number): void {
    if (confirm("Are you sure you want to delete this employee?")) {
      this.applicant_list.splice(index, 1);
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}

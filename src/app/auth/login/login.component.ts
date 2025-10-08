import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/api.client";
import { UtilsServiceService } from "src/app/utils/utils-service.service";
import { environment } from "src/environments/environment";
declare var bootstrap: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  data: any;
  api_url = environment.API_URL;
  message: string | undefined;
  errors: string[] = [];
  messages: string[] = [];
  spinLoader = false;
  show = false;
  password: string = 'password';
  @Input() disabled: boolean;
  @Input() spin: boolean;
  email: string = '';
  constructor(private el: ElementRef, private util: UtilsServiceService, private formBuilder: FormBuilder, private router: Router, private api: ApiService, public toast: ToastrService) { }
  forgotPasswordForm: FormGroup;
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Added email validator
      password: ['', [Validators.required]],
    });
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
      OldPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onClick() {
    this.show = !this.show;
  }
  openForgotPasswordModal() {
    const modalElement = document.getElementById('forgotPasswordModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  submitForgotPassword() {
    this.submitted = true;
    this.errors = [];
    this.messages = [];
    if (!this.forgotPasswordForm.valid) {
      return;
    }
    const url = "api/company/changepassword";
    const body = {
      "email": this.forgotPasswordForm.get("email")?.value,
      "oldPassword": this.forgotPasswordForm.get("OldPassword")?.value,
      "newPassword": this.forgotPasswordForm.get("confirmPassword")?.value
    };
    this.api.updatePassword(url, this.forgotPasswordForm?.get("email")?.value, this.forgotPasswordForm?.get("OldPassword")?.value, this.forgotPasswordForm?.get("confirmPassword")?.value).subscribe(
      (res: any) => {
        this.toast.success('Password Changed Successfully', 'Success');
        this.submitted = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.message || "An error occurred during login"];
        this.toast.error(this.errors[0], "Incorrect Credentials");
        // this.router.navigate(['/changePassword']);
      }
    );
  }
  saveNewMember() {
    this.submitted = true;
    this.errors = [];
    this.messages = [];
    if (!this.loginForm.valid) {
      return;
    }
    const url = "api/company/login";
    const body = {
      "email": this.loginForm.get("email")?.value,
      "password": this.loginForm.get("password")?.value,
      // "fcm_Token": "string"
    };
    this.api.login(url, this.loginForm?.get("email")?.value, this.loginForm?.get("password")?.value).subscribe(
      (res: any) => {
        if (res.succeeded && res.data) {
          console.log(localStorage);
          // Save company data
          localStorage.setItem('company_id', this.util.encrypt_Text(res.data.id.toString()) || "");
          localStorage.setItem('company_name', this.util.encrypt_Text(res.data.companyName) || "");
          localStorage.setItem('email', this.util.encrypt_Text(res.data.email) || "");
          localStorage.setItem('mobile_no', this.util.encrypt_Text(res.data.mobileNumber) || "");
          if (res.data.logo) {
            localStorage.setItem('logo', this.util.encrypt_Text(res.data.logo) || "");
          }
          this.toast.success('Congratulations, Welcome to EmproHr.', 'Success');
          setTimeout(() => {
            this.router.navigate(['/dashboard',]);
          }, 200);
        } else {
          this.toast.error(res.message || "Login failed", "Error");
        }
        this.submitted = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.message || "An error occurred during login"];
        this.toast.error(this.errors[0], "Incorrect Credentials");
      }
    );
  }
  do_logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
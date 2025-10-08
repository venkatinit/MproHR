import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/api.client";
import { UtilsServiceService } from "src/app/utils/utils-service.service";
import { environment } from "src/environments/environment";
declare var bootstrap: any;
@Component({
  selector: 'app-company-login-page',
  templateUrl: './company-login-page.component.html',
  styleUrls: ['./company-login-page.component.scss']
})
export class CompanyLoginPageComponent implements OnInit {
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
    // this.forgotPasswordForm = this.formBuilder.group({
    //   password: ['', Validators.required],
    //   confirmPassword: ['', Validators.required]
    // },
    //  {
    //   validators: this.passwordsMatchValidator
    // });
    // this.signUpButton = this.el.nativeElement.querySelector('#signUp');
    // this.signInButton = this.el.nativeElement.querySelector('#signIn');
    // this.container = this.el.nativeElement.querySelector('#container');

    // this.signUpButton.addEventListener('click', () => {
    //   this.container.classList.add('right-panel-active');
    // });

    // this.signInButton.addEventListener('click', () => {
    //   this.container.classList.remove('right-panel-active');
    // });
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
    if (this.email) {
      console.log('Password reset email sent to:', this.email);
    }
  }
  get passwordMismatch(): boolean {
    return this.submitted && this.forgotPasswordForm.errors?.['passwordMismatch'];
  }
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
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
    };
    this.api.login(url, this.loginForm?.get("email")?.value, this.loginForm?.get("password")?.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', this.util.encrypt_Text(res.data?.token) || "");
        // localStorage.setItem('user_id', this.util.encrypt_Text(res.data.id) || "");
        localStorage.setItem('first_name', this.util.encrypt_Text(res.data.first_Name) || "");
        localStorage.setItem('last_name', this.util.encrypt_Text(res.data.last_Name) || "");
        localStorage.setItem('email', this.util.encrypt_Text(res.data.email_Id) || "");
        localStorage.setItem('mobile_no', this.util.encrypt_Text(res.data.mobile_Number) || "");
        localStorage.setItem('currentUser', this.util.encrypt_Text(JSON.stringify(res.data)) || "");
        this.toast.success('Congratulations Welcome to EmproHr', 'Success');
        this.router.navigate(['/dashboard']);
        this.submitted = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.message || "An error occurred during login"];
        this.toast.error(this.errors[0], "Validation Failed");
      }
    );
  }
  do_logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
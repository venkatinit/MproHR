import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.client';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  RegisterForm: FormGroup;
  username: any;
  password: any;
  returnUrl: string;
  message: string | undefined;
  errors: string[] = [];
  messages: string[] = [];
  user: User | undefined;
  submitted: boolean = false;
  loginUserData: any;
  showMessages: any;
  api_url = environment.API_URL;
  isSelected: any;
  show = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private util: UtilsServiceService, private api: ApiService,
    private userService: UsersService, protected service: AuthService,
    public toast: ToastrService) {
    this.RegisterForm = this.formBuilder.group({
      company_name: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      established_date: ['', [Validators.required]],
      mobile_no: ['', [Validators.required]],
      office_mail: ['', [Validators.required]],
      password: ['', [Validators.required]],
      gst: ['', [Validators.required]],
      // ofc_contact_no: [''],
      website: ['', [Validators.required]],
      // address: ['', [Validators.required]],
      // username: ['', [Validators.required]],
    });

  }
  ngOnInit(): void {

  }

  get f() {
    return this.RegisterForm.controls;
  }

  SaveRegisterForm() {
    this.submitted = true;
    this.errors = [];
    this.messages = [];
    if (!this.RegisterForm.valid) {
      return;
    }
    const url = "api/company/register";
    var body = {
      "companyName": this.RegisterForm?.get("company_name")?.value,
      "contactPerson": this.RegisterForm?.get("contact_person")?.value,
      // "business_type": this.RegisterForm?.get("business_type")?.value,
      // "ceo": this.RegisterForm?.get("ceo")?.value,
      "establishedDate": this.RegisterForm?.get("established_date")?.value,
      "mobileNumber": this.RegisterForm?.get("mobile_no")?.value,
      // "office_contatc_no": this.RegisterForm?.get("ofc_contact_no")?.value,
      "email": this.RegisterForm?.get("office_mail")?.value,
      // "address": this.RegisterForm?.get("address")?.value,
      // "user_name": this.RegisterForm.get("username")?.value,
      "password": this.RegisterForm.get("password")?.value,
      "id": 0,
      "address": " ",
      "city": " ",
      "stateId": 0,
      "districtId": 0,
      "pincode": " ",
      "website": this.RegisterForm.get("website")?.value,
      "logoUrl": " ",
      "location": " ",
      "gstNumber": this.RegisterForm.get("gst")?.value,
      "stampUrl": " ",
      "password_Changed": true
    }
    this.api.register(url, body).subscribe((res: any) => {
      localStorage.setItem('access_token', this.util.encrypt_Text(res.data?.jwToken) || "")
      this.userService.current_user = res.data;
      // localStorage.setItem('user_data', this.util.encrypt_Text(res.Data.Email));
      localStorage.setItem('user_id', this.util.encrypt_Text(res.response.id) || "");
      localStorage.setItem('currentUser', this.util.encrypt_Text(JSON.stringify(res.response)) || "");
      this.router.navigate(['/login']);
      this.toast.success('Registration Completed successfully', 'Success');

      this.submitted = false;
    },
      (error: any) => {

        console.log(error);
        // this.loaded=false;        
        // this.SpinnerService.hide();

        // console.log("====================")
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], "Validation Failed");
        // this.loaded=false;
      }

    );
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }

  }
}
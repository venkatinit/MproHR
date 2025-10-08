import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.client';

@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.scss']
})
export class OrgProfileComponent implements OnInit {
  updateOrgProfile: FormGroup;
  submitted = false;
  logoPreview: string | ArrayBuffer | null = null;
  signaturePreview: string | ArrayBuffer | null = null;
  stampPreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) {
    this.updateOrgProfile = this.formBuilder.group({
      // Organization
      logo: [null, Validators.required],
      organizationName: ['', Validators.required],
      country: ['', Validators.required],
      natureOfBusiness: ['', Validators.required],
      businessAddress: ['', Validators.required],

      // Bank
      accountName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountType: ['', Validators.required],
      ifsc: ['', Validators.required],
      bankName: ['', Validators.required],

      // HR
      hrMailId: ['', [Validators.required, Validators.email]],
      hrContactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      // Authorization
      authorisedBy: ['', Validators.required],
      authoriserDesignation: ['', Validators.required],
      signature: [null, Validators.required],
      stamp: [null, Validators.required] 
    });
  }

  ngOnInit(): void {
    this.api.get('/orgProfile/details').subscribe((res: any) => {
      this.updateOrgProfile.patchValue(res);
      if (res.logo) this.logoPreview = res.logo;
      if (res.signature) this.signaturePreview = res.signature;
      if (res.stamp) this.stampPreview = res.stamp;
    });
  }

  get f() {
    return this.updateOrgProfile.controls;
  }

  onFileChange(event: any, field: 'logo' | 'signature' | 'stamp') {
    const file = event.target.files[0];
    if (file) {
      this.updateOrgProfile.patchValue({ [field]: file });
      this.updateOrgProfile.get(field)?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'logo') this.logoPreview = reader.result;
        if (field === 'signature') this.signaturePreview = reader.result;
        if (field === 'stamp') this.stampPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveOrgProfile() {
    this.submitted = true;
    if (this.updateOrgProfile.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.updateOrgProfile.value).forEach(key => {
      formData.append(key, this.updateOrgProfile.value[key]);
    });

    this.api.post('/orgProfile/update', formData).subscribe({
      next: () => {
        this.toast.success('Organization profile updated successfully!');
        this.submitted = false;
      },
      error: (err) => {
        this.toast.error('Failed to update profile');
        console.error(err);
      }
    });
  }
}

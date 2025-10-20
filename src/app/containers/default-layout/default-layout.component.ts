import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { HikeComponent } from 'src/app/modules/hrm/Modifications/hike/hike.component';
import { OfferLetterComponent } from 'src/app/modules/hrm/Modifications/offer-letter/offer-letter.component';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsServiceService } from 'src/app/utils/utils-service.service';
@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  activeDropdown: string = '';
  form: FormGroup;
  org: any;
  isMobileSidebarOpen = false;

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? '' : menu;
  }
  has_user_login: boolean = false
  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal, private util: UtilsServiceService, private api: ApiService
  ) { }
  ngOnInit(): void {

    const accessToken = this.authService.getAccessToken();
    //console.log(accessToken);
    if (accessToken != null) {
      this.has_user_login = true;
    } else {
      this.has_user_login = false;
    }

    // if (this.form.invalid) return;
    // const companyId = this.util.decrypt_Text(localStorage.getItem('company_id')) || '';
    // const queryParams = new URLSearchParams({
    //   companyId: companyId,
    // }).toString();
    // this.api.get(`api/company/?${queryParams}`).subscribe((res: ApiResponse<any>) => {
    //   this.org = Array.isArray(res.data) ? res.data : [res.data];
    // });

  }

  do_logout() {
    localStorage.clear();
    // window.location.reload();
    this.router.navigate(['/login']);
    // this.router.navigate(['/member_login']);
  }
}

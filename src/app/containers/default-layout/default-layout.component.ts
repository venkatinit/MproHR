import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HikeComponent } from 'src/app/modules/hrm/Modifications/hike/hike.component';
import { OfferLetterComponent } from 'src/app/modules/hrm/Modifications/offer-letter/offer-letter.component';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  activeDropdown: string = '';
  hoveredDropdown: string = '';

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? '' : menu;
  }

  onHoverDropdown(menu: string) {
    if (this.isSidebarCollapsed) {
      this.hoveredDropdown = menu;
    } else {
      this.hoveredDropdown = '';
    }
  }

  has_user_login: boolean = false
  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal) { }
  ngOnInit(): void {
    const accessToken = this.authService.getAccessToken();
    //console.log(accessToken);
    if (accessToken != null) {
      this.has_user_login = true;
    } else {
      this.has_user_login = false;
    }
  }
  do_logout() {
    localStorage.clear();
    // window.location.reload();
    this.router.navigate(['/login']);
    // this.router.navigate(['/member_login']);
  }
   
  

}

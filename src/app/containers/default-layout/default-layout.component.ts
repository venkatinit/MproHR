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
  activeDropdown: string | null = null;

  toggleDropdown(menu: string): void {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
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

  open_offer() {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };

    const modalRef = this.modalService.open(OfferLetterComponent, options);

    modalRef.result.then((data) => {

    },
      (error) => {
        if (error == "Success") {
          // this.LoadBrands();
        }
      });

  }
  open_hike() {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };

    const modalRef = this.modalService.open(HikeComponent, options);

    modalRef.result.then((data) => {

    },
      (error) => {
        if (error == "Success") {
          // this.LoadBrands();
        }
      });

  }
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 992) {
      sidebar?.classList.remove('show-sidebar');
      this.isSidebarCollapsed = false;
    }
  }

}

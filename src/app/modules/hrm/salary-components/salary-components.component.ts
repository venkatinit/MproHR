
import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-salary-components',
  templateUrl: './salary-components.component.html',
  styleUrls: ['./salary-components.component.scss']
})
export class SalaryComponentsComponent implements OnInit {
  salaryTabs = [
    { name: 'Allowances', component: 'allowances' },
    { name: 'Deductions', component: 'deductions' },
    { name: 'Reimbursement', component: 'reimbursement' }
  ];
  activeTab: string = this.salaryTabs[0].name;
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  ngOnInit(): void {
    this.activeTab = this.salaryTabs[0].name;
  }
}
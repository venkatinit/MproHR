import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-statutory-component',
  templateUrl: './statutory-component.component.html',
  styleUrls: ['./statutory-component.component.scss']
})
export class StatutoryComponentComponent implements OnInit {
  statutoryTabs = [
    { name: 'EPFO', component: 'epfo' },
    { name: 'ESIC', component: 'esic' },
    { name: 'PT', component: 'professional_tax' },
    { name: 'LWF', component: 'labour_welfare_fund' },
    { name: 'Bonus', component: 'statutory_bonus' }

  ];
  activeTab: string = '';
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  ngOnInit(): void {
    this.activeTab = this.statutoryTabs[0].name;
  }
}
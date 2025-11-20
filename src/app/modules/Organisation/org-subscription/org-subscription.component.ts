import { Component, OnInit } from '@angular/core';

interface Company {
  id: number;
  name: string;
  startDate: string;
  expiryDate: string;
  businessValue: number;
  status?: string;
  progress?: number;
  daysLeft?: number;
}

@Component({
  selector: 'app-org-subscription',
  templateUrl: './org-subscription.component.html',
  styleUrls: ['./org-subscription.component.scss']
})
export class OrgSubscriptionComponent implements OnInit {
  searchTerm: string = '';
  filterCompanies: Company[] = [];

  companyList: Company[] = [
    { id: 1, name: 'TechNova Solutions', startDate: '2025-01-10', expiryDate: '2026-01-10', businessValue: 850000 },
    { id: 2, name: 'GreenField Industries', startDate: '2024-08-15', expiryDate: '2025-08-15', businessValue: 420000 },
    { id: 3, name: 'Skyline Builders Pvt Ltd', startDate: '2025-03-01', expiryDate: '2025-09-01', businessValue: 630000 },
    { id: 4, name: 'BlueOcean Retail', startDate: '2025-05-05', expiryDate: '2026-05-05', businessValue: 1250000 },
    { id: 5, name: 'NextGen Logistics', startDate: '2024-11-01', expiryDate: '2025-11-01', businessValue: 980000 },
    { id: 6, name: 'EcoFinTech Services', startDate: '2024-10-15', expiryDate: '2025-10-15', businessValue: 750000 },
    { id: 7, name: 'Visionary IT Labs', startDate: '2025-06-01', expiryDate: '2026-06-01', businessValue: 1100000 }
  ];

  ngOnInit(): void {
    this.companyList.forEach(company => this.calculateProgress(company));
    this.filterCompanies = [...this.companyList]; // ✅ initialize filtered list
  }

  filtercompany(): void {
    const term = this.searchTerm?.toLowerCase().trim() || '';
    this.filterCompanies = this.companyList.filter(
      company => company.name.toLowerCase().includes(term)
    );
  }

  private calculateProgress(company: Company): void {
    const start = new Date(company.startDate);
    const end = new Date(company.expiryDate);
    const today = new Date();

    const total = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    const progress = (elapsed / total) * 100;

    company.progress = Math.min(100, Math.max(0, Number(progress.toFixed(1))));
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    company.daysLeft = diffDays > 0 ? diffDays : 0;
    company.status = diffDays > 0 ? 'Active' : 'Expired';
  }
}

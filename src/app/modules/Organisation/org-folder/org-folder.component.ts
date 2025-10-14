import { Component, HostListener } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-org-folder',
  templateUrl: './org-folder.component.html',
  styleUrls: ['./org-folder.component.scss']
})
export class OrgFolderComponent {
  searchTerm = '';
  documents = [
    { name: 'Employee Photo', url: 'assets/img/ng.jpg' },
    { name: 'Company Policy', url: 'assets/img/ng.jpg' },
    { name: 'Invoice Example', url: 'assets/img/ng.jpg' },
    { name: 'Team Photo', url: 'assets/img/ng.jpg' },
    { name: 'Invoice Example', url: 'assets/img/ng.jpg' },
  ];

  filteredDocuments = [...this.documents];
  selectedDoc: any = null;

  filterDocuments() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDocuments = this.documents.filter(doc =>
      doc.name.toLowerCase().includes(term)
    );
  }
  openPreview(doc: any) {
    this.selectedDoc = doc;
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    modal.show();
  }

  isImage(url: string | undefined): boolean {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  }
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboard(event: KeyboardEvent) {
  //   if (this.isViewerOpen && (event.ctrlKey && ['s', 'p'].includes(event.key.toLowerCase()))) {
  //     event.preventDefault();
  //   }
  // }
}

import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  isMenuOpen = false;
  private readonly landingpageurl = inject(landingPageService);

 header: any = {};
 
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    this.landingpageurl.getdados().subscribe({
      next: (data) => {
        this.header = data.headerResponseDto || {};
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.dropdown')) {
      this.isMenuOpen = false;
    }
  }
}
 
import { Component, ElementRef, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;

  constructor(private toastr: ToastrService, private location: Location) {}

  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // Adjust the threshold as needed
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Display a toast message when the section is visible
          this.toastr.success(`Section ${entry.target.id} is visible`);

          // Cast the entry target to HTMLElement to access style property
          const targetElement = entry.target as HTMLElement;
          targetElement.style.opacity = '1';

          // Set opacity to 0 for all other sections
          this.scrollSections.forEach(section => {
            const sectionElement = section.nativeElement as HTMLElement;
            if (sectionElement !== targetElement) {
              sectionElement.style.opacity = '0';
            }
          });

          // Highlight the corresponding navigation link
          this.navLinks.forEach(link => {
            const linkElement = link.nativeElement as HTMLElement;
            if (linkElement.getAttribute('href') === `#${entry.target.id}`) {
              linkElement.style.color = 'blue';
            } else {
              linkElement.style.color = '';
            }
          });

          // Update the URL fragment without scrolling
          this.location.replaceState(`#${entry.target.id}`);
        }
      });
    }, options);

    // Observe each scroll-section element after view init
    this.scrollSections.forEach(section => {
      observer.observe(section.nativeElement);
    });
  }
}

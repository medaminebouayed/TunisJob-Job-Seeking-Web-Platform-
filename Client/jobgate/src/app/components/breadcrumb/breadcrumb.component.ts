import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];

  constructor(private router: Router) {}

  navigate(path?: string): void {
    if (path) {
      this.router.navigate([path]);
    }
  }
}

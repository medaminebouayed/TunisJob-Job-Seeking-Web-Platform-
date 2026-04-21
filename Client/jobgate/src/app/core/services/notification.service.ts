import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastSubject = new Subject<Toast | null>();
  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ type: 'success', message });
    this.autoHide();
  }

  showError(message: string): void {
    this.toastSubject.next({ type: 'error', message });
    this.autoHide();
  }

  showInfo(message: string): void {
    this.toastSubject.next({ type: 'info', message });
    this.autoHide();
  }

  hide(): void {
    this.toastSubject.next(null);
  }

  private autoHide(): void {
    setTimeout(() => {
      this.hide();
    }, 5000);
  }
}

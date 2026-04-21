import { Component, OnInit } from '@angular/core';
import { NotificationService, Toast } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  template: `
    <div *ngIf="toast$ | async as toast"
         role="status"
         aria-live="polite"
         class="fixed z-[20000] left-4 right-4 top-20 sm:left-auto sm:right-6 sm:top-24 sm:w-[min(100%,420px)] pointer-events-none">
      <div
        class="pointer-events-auto flex items-start gap-4 p-5 rounded-3xl shadow-2xl border transition-all duration-300 backdrop-blur-md"
        [ngClass]="{
          'bg-emerald-50/95 text-emerald-900 border-emerald-100 shadow-emerald-900/5': toast.type === 'success',
          'bg-red-50/95 text-red-900 border-red-100 shadow-red-900/5': toast.type === 'error',
          'bg-indigo-50/95 text-indigo-900 border-indigo-100 shadow-indigo-900/5': toast.type === 'info',
          'bg-amber-50/95 text-amber-900 border-amber-100 shadow-amber-900/5': toast.type === 'warning'
        }">

        <div class="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
             [ngClass]="{
               'bg-emerald-100 text-emerald-600': toast.type === 'success',
               'bg-red-100 text-red-600': toast.type === 'error',
               'bg-indigo-100 text-indigo-600': toast.type === 'info',
               'bg-amber-100 text-amber-600': toast.type === 'warning'
             }">
          <svg *ngIf="toast.type === 'success'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <svg *ngIf="toast.type === 'error'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
          <svg *ngIf="toast.type !== 'success' && toast.type !== 'error'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        </div>

        <div class="flex-1 min-w-0 pt-1">
          <p class="text-sm font-bold leading-snug break-words tracking-tight">{{ toast.message }}</p>
        </div>

        <button type="button" (click)="hide()" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded-xl p-1.5 hover:bg-gray-100 focus:outline-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .animate-in {
      animation: slide-in 0.3s ease-out;
    }
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnInit {
  toast$: Observable<Toast | null>;

  constructor(private notificationService: NotificationService) {
    this.toast$ = this.notificationService.toast$;
  }

  ngOnInit(): void {}

  hide(): void {
    this.notificationService.hide();
  }
}

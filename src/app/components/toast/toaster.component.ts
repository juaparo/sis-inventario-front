import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';
import { LucideAngularModule, CheckCircle2, XCircle, Info, X } from 'lucide-angular';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2">
      <div *ngFor="let toast of toastService.toasts()" 
           class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all"
           [ngClass]="{
             'bg-green-50 border-green-200 text-green-900': toast.type === 'success',
             'bg-red-50 border-red-200 text-red-900': toast.type === 'error',
             'bg-white border-gray-200 text-gray-900': toast.type === 'info'
           }">
        
        <div class="flex items-center gap-3">
          <lucide-icon *ngIf="toast.type === 'success'" [img]="CheckCircle2Icon" class="w-5 h-5 text-green-600"></lucide-icon>
          <lucide-icon *ngIf="toast.type === 'error'" [img]="XCircleIcon" class="w-5 h-5 text-red-600"></lucide-icon>
          <lucide-icon *ngIf="toast.type === 'info'" [img]="InfoIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
          
          <div class="text-sm font-semibold">
            {{ toast.message }}
          </div>
        </div>

        <button (click)="toastService.remove(toast.id)" class="absolute right-2 top-2 rounded-md p-1 text-inherit opacity-50 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none">
          <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>
  `
})
export class ToasterComponent {
  toastService = inject(ToastService);
  
  CheckCircle2Icon = CheckCircle2;
  XCircleIcon = XCircle;
  InfoIcon = Info;
  XIcon = X;
}

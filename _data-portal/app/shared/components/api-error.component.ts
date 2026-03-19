import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiErrorService } from '../../core/services/api-error.service';
import { ApiErrorHandle } from '../api-error-handle';

@Component({
    selector: 'api-error',
    templateUrl: './api-error.component.html',
})
export class ApiErrorComponent implements OnInit{

  // public properties
  errors: ApiErrorHandle[] = [];

  //private properties
  errorSubscription: Subscription = null;

  constructor(
    private apiErrorService: ApiErrorService,
  ) {};

  ngOnInit(): void {
    this.errorSubscription =
      this.apiErrorService.error$.subscribe((handle:ApiErrorHandle) => {
        if (!this.errors.some((existing: ApiErrorHandle) => existing.error === handle.error)) {
          this.errors.push(handle);
        }
      });
    return;
  };

  ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    this.dismiss();
    return;
  };

  get hasBanner(): boolean {
    return this.errors.length > 0;
  }

  get bannerLevel(): string {
    return 'warning';
  }

  get bannerTitle(): string {
    if (this.errors.length === 0) {
      return '';
    }

    if (this.isTooManyRequestsError(this.errors[0].error)) {
      return 'Too Many Requests';
    }

    if (this.isNotFoundError(this.errors[0].error)) {
      return 'Requested Item Not Found';
    }

    if (this.isPortalUnavailableError(this.errors[0].error)) {
      return 'Data Portal Temporarily Unavailable';
    }

    return 'Request Could Not Be Completed';
  }

  get bannerMessage(): string {
    return this.errors.length > 0 ? this.errors[0].error : '';
  }

  dismiss(): void {
    for (let handle of this.errors) {
      handle.dismiss();
    }
    this.errors = [];
    this.apiErrorService.clearErrors();
    return;
  };

  private isTooManyRequestsError(message: string): boolean {
    return message === 'Too many requests are coming from your network. Please wait a moment and try again.';
  }

  private isNotFoundError(message: string): boolean {
    return message === 'The requested page or record could not be found.';
  }

  private isPortalUnavailableError(message: string): boolean {
    return message === 'Apologies, the data portal is temporarily unavailable. We are working to get it back up.';
  }
}

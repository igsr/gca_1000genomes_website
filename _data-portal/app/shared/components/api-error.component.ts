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
    return 'Data Portal Temporarily Unavailable';
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
}

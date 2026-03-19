import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiErrorService } from '../../core/services/api-error.service';
import { ApiStatusService, ApiStatusSnapshot } from '../../core/services/api-status.service';
import { ApiErrorHandle } from '../api-error-handle';

interface ApiBannerContent {
  key: string;
  level: string;
  title: string;
  message: string;
}

@Component({
    selector: 'api-error',
    templateUrl: './api-error.component.html',
})
export class ApiErrorComponent implements OnInit{

  // public properties
  errors: ApiErrorHandle[] = [];
  status: ApiStatusSnapshot = { state: 'ok' };

  //private properties
  errorSubscription: Subscription = null;
  statusSubscription: Subscription = null;
  dismissedBannerKey: string = null;

  constructor(
    private apiErrorService: ApiErrorService,
    private apiStatusService: ApiStatusService,
  ) {};

  ngOnInit(): void {
    this.errorSubscription =
      this.apiErrorService.error$.subscribe((handle:ApiErrorHandle) => {
        if (!this.errors.some((existing: ApiErrorHandle) => existing.error === handle.error)) {
          this.errors.push(handle);
        }
        this.dismissedBannerKey = null;
      });
    this.statusSubscription =
      this.apiStatusService.status$.subscribe((status: ApiStatusSnapshot) => {
        if (this.status.state !== status.state) {
          this.dismissedBannerKey = null;
        }
        this.status = status;
      });
    return;
  };

  ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    this.dismiss();
    return;
  };

  get hasBanner(): boolean {
    return this.banner !== null;
  }

  get bannerLevel(): string {
    return this.banner ? this.banner.level : 'warning';
  }

  get bannerTitle(): string {
    return this.banner ? this.banner.title : '';
  }

  get bannerMessage(): string {
    return this.banner ? this.banner.message : '';
  }

  dismiss(): void {
    if (this.banner) {
      this.dismissedBannerKey = this.banner.key;
    }
    for (let handle of this.errors) {
      handle.dismiss();
    }
    this.errors = [];
    return;
  };

  private get banner(): ApiBannerContent {
    const banner: ApiBannerContent = this.buildBanner();
    if (!banner || banner.key === this.dismissedBannerKey) {
      return null;
    }
    return banner;
  }

  private buildBanner(): ApiBannerContent {
    if (this.status.state === 'degraded' || this.status.state === 'unavailable') {
      return {
        key: 'status:data_portal_unavailable',
        level: 'warning',
        title: 'Data Portal Temporarily Unavailable',
        message: 'The data portal is temporarily unavailable. We are working to get it back up. Static website content is still available.',
      };
    }

    if (this.status.state === 'rate_limited') {
      return {
        key: 'status:rate_limited',
        level: 'warning',
        title: 'Too Many Requests',
        message: 'Too many requests are coming from your network. Please wait a moment and try again.',
      };
    }

    if (this.errors.length > 0) {
      return {
        key: `error:${this.errors[0].error}`,
        level: 'warning',
        title: 'Request Could Not Be Completed',
        message: this.errors[0].error,
      };
    }

    return null;
  }

}

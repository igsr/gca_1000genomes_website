import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiErrorService } from '../../core/services/api-error.service';
import { ApiTimeoutService } from '../../core/services/api-timeout.service';

@Component({
    selector: 'api-slow-response',
    templateUrl: './api-slow-response.component.html',
})
export class ApiSlowResponseComponent implements OnInit{

  // public properties
  numSlowResponses: number;
  activeErrorCount: number = 0;

  //private properties
  subscription: Subscription = null;
  errorSubscription: Subscription = null;

  constructor(
    private apiTimeoutService: ApiTimeoutService,
    private apiErrorService: ApiErrorService,
  ) {};

  ngOnInit(): void {
    this.subscription =
      this.apiTimeoutService.numSlowResponses$.subscribe((num:number) => this.numSlowResponses = num);
    this.errorSubscription =
      this.apiErrorService.activeErrorCount$.subscribe((count:number) => this.activeErrorCount = count);
    return;
  };

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    return;
  };

  get showSlowBanner(): boolean {
    return this.numSlowResponses > 0 && this.activeErrorCount === 0;
  }

}

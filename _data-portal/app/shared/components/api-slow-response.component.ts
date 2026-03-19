import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiTimeoutService } from '../../core/services/api-timeout.service';
import { ApiStatusService, ApiStatusSnapshot } from '../../core/services/api-status.service';

@Component({
    selector: 'api-slow-response',
    templateUrl: './api-slow-response.component.html',
})
export class ApiSlowResponseComponent implements OnInit{

  // public properties
  numSlowResponses: number;
  status: ApiStatusSnapshot = { state: 'ok' };

  //private properties
  subscription: Subscription = null;
  statusSubscription: Subscription = null;

  constructor(
    private apiTimeoutService: ApiTimeoutService,
    private apiStatusService: ApiStatusService,
  ) {};

  ngOnInit(): void {
    this.subscription = 
      this.apiTimeoutService.numSlowResponses$.subscribe((num:number) => this.numSlowResponses = num);
    this.statusSubscription =
      this.apiStatusService.status$.subscribe((status: ApiStatusSnapshot) => this.status = status);
    return;
  };

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    return;
  };

  get showSlowBanner(): boolean {
    return this.status.state === 'ok' && this.numSlowResponses > 0;
  }

}

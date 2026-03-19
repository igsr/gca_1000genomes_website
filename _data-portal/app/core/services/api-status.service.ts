import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

export type ApiStatusState = 'ok' | 'degraded' | 'unavailable' | 'rate_limited';

export interface ApiStatusSnapshot {
  state: ApiStatusState;
}

@Injectable()
export class ApiStatusService {
  readonly status$: Observable<ApiStatusSnapshot>;

  private readonly pollIntervalMs: number = 30000;
  private statusSource: BehaviorSubject<ApiStatusSnapshot>;
  private pollHandle: number = null;
  private healthSubscription: Subscription = null;

  constructor(
    private http: Http,
  ) {
    this.statusSource = new BehaviorSubject<ApiStatusSnapshot>(this.makeSnapshot('ok'));
    this.status$ = this.statusSource.asObservable();
  }

  startPolling(): void {
    if (this.pollHandle !== null) {
      return;
    }
    this.refreshHealth();
    this.pollHandle = window.setInterval(() => this.refreshHealth(), this.pollIntervalMs);
  }

  stopPolling(): void {
    if (this.pollHandle !== null) {
      window.clearInterval(this.pollHandle);
      this.pollHandle = null;
    }
    if (this.healthSubscription) {
      this.healthSubscription.unsubscribe();
      this.healthSubscription = null;
    }
  }

  private refreshHealth(): void {
    if (this.healthSubscription) {
      return;
    }

    this.healthSubscription = this.http.get(`/api/beta/health`).subscribe(
      (response: Response) => this.onHealthResponse(response),
      (error: any) => this.onHealthError(error)
    );
  }

  reportError(error: any): void {
    const state: ApiStatusState = this.classifyError(error);
    if (state === 'unavailable' || state === 'rate_limited') {
      this.setState(state);
    }
    this.refreshHealth();
  }

  private onHealthResponse(response: Response): void {
    this.healthSubscription = null;
    const payload: { status?: string } = response.json() || {};
    const nextState: ApiStatusState = payload.status === 'degraded' ? 'degraded' : 'ok';
    this.setState(nextState);
  }

  private onHealthError(error: any): void {
    this.healthSubscription = null;
    this.setState(this.classifyError(error));
  }

  private classifyError(error: any): ApiStatusState {
    if (error && error.status === 403) {
      return 'rate_limited';
    }
    return 'unavailable';
  }

  private setState(state: ApiStatusState): void {
    const current: ApiStatusSnapshot = this.statusSource.getValue();
    if (current && current.state === state) {
      return;
    }
    this.statusSource.next(this.makeSnapshot(state));
  }

  private makeSnapshot(state: ApiStatusState): ApiStatusSnapshot {
    return {
      state: state,
    };
  }
}

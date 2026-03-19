import { Injectable }    from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { ApiErrorHandle } from '../../shared/api-error-handle';

@Injectable()
export class ApiErrorService {

  // private properties
  private errorSource: Subject<ApiErrorHandle>;
  private activeErrorCountSource: BehaviorSubject<number>;

  // public properties
  readonly error$: Observable<ApiErrorHandle>;
  readonly activeErrorCount$: Observable<number>;

  // public methods

  constructor() {
    this.errorSource = new Subject<ApiErrorHandle>();
    this.activeErrorCountSource = new BehaviorSubject<number>(0);
    this.error$ = this.errorSource.asObservable();
    this.activeErrorCount$ = this.activeErrorCountSource.asObservable();
  };

  handleError(observable: Observable<Response>): Observable<Response> {
    return Observable.create((observer : Observer<Response>) => this.try(observable, observer));
  }

  // private methods

  private try(observable: Observable<Response>, observer: Observer<Response>) {
    observable.subscribe(
      (res: Response) => {
        observer.next(res);
        observer.complete();
      },
      (error: any) => this.onErrorFn(observer, error)
      );
  }

  private onErrorFn(observer: Observer<Response>, error: any) {
    console.log('An error occurred', error); // for debugging

    let errMsg = this.makeFriendlyMessage(error);
    this.activeErrorCountSource.next(1 + this.activeErrorCountSource.getValue());
    this.errorSource.next(new ApiErrorHandle(errMsg, observer));

  }

  clearErrors(): void {
    this.activeErrorCountSource.next(0);
  }

  private makeFriendlyMessage(error: any): string {
    const status: number = error && error.status ? error.status : 0;

    if (status === 403) {
      return 'Too many requests are coming from your network. Please wait a moment and try again.';
    }

    if (status === 404) {
      return 'The requested page or record could not be found.';
    }

    if (status === 0 || status >= 500) {
      return 'Apologies, the data portal is temporarily unavailable. We are working to get it back up.';
    }

    return 'The request could not be completed. Please try again.';
  }

}

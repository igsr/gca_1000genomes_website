import { Injectable }    from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

import { ApiErrorHandle } from '../../shared/api-error-handle';
import { ApiStatusService } from './api-status.service';

@Injectable()
export class ApiErrorService {

  // private properties
  private errorSource: Subject<ApiErrorHandle>;

  // public properties
  readonly error$: Observable<ApiErrorHandle>;

  // public methods

  constructor(
    private apiStatusService: ApiStatusService,
  ) {
    this.errorSource = new Subject<ApiErrorHandle>();
    this.error$ = this.errorSource.asObservable();
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

    this.apiStatusService.reportError(error);

    let errMsg = this.makeFriendlyMessage(error);
    this.errorSource.next(new ApiErrorHandle(errMsg, observer));

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
      return 'The data portal is temporarily unavailable. Static site content is still available.';
    }

    return 'The request could not be completed. Please try again.';
  }

}

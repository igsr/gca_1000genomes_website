import { Observer } from 'rxjs/Observer';

export class ApiErrorHandle {
  private dismissed: boolean = false;

  constructor(
    public error: string,
    private observer: Observer<any>,
  ) { };

  dismiss = function(): void {
    if (this.dismissed) {
      return;
    }
    if (this.observer) {
      this.observer.complete();
    };
    this.dismissed = true;
    return;
  };

}

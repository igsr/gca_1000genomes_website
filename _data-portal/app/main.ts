import 'zone.js';
import '@angular/compiler';
import { Observable as RxObservable, of as rxOf, timer as rxTimer } from 'rxjs';
import { Observable as LegacyObservable } from 'rxjs/Observable';
import {
  catchError as rxCatchError,
  debounceTime as rxDebounceTime,
  map as rxMap,
  switchMap as rxSwitchMap,
} from 'rxjs/operators';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

function patchObservablePrototype(observableType: any): void {
  const prototype = observableType.prototype as any;
  prototype.map = prototype.map || function(project: any, thisArg?: any) {
    return this.pipe(rxMap(project, thisArg));
  };
  prototype.catch = prototype.catch || function(selector: any) {
    return this.pipe(rxCatchError((error: any, caught: any) => selector(error, caught)));
  };
  prototype.switchMap = prototype.switchMap || function(project: any, resultSelector?: any) {
    return this.pipe(rxSwitchMap(project, resultSelector));
  };
  prototype.debounceTime = prototype.debounceTime || function(dueTime: number, scheduler?: any) {
    return this.pipe(rxDebounceTime(dueTime, scheduler));
  };
}

function patchObservableStaticMethods(observableType: any): void {
  observableType.of = observableType.of || rxOf;
  observableType.timer = observableType.timer || rxTimer;
}

patchObservablePrototype(RxObservable);
patchObservablePrototype(LegacyObservable);
patchObservableStaticMethods(RxObservable);
patchObservableStaticMethods(LegacyObservable);

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);

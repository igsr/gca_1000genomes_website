import { Component } from '@angular/core';

let appComponentStyles: string = `
div.data-portal-section {
  position: relative;
}
h3.data-portal-beta {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #262626;
  color: #DAA406;
  padding: 15px;
  margin: 0px;
  border-bottom-left-radius: 4px;
}
span.beta {
  color: #FFF;
}
`;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [ appComponentStyles ],
})
export class AppComponent{};

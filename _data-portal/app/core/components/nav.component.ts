import { Component } from '@angular/core';

let navStyles: string = `

ul.data-portal-nav {
  margin-bottom: -20px;
  margin-left: 20px;
}
li > a {
  background-color: white;
}

`;

@Component({
    selector: 'data-portal-nav',
    templateUrl: './nav.component.html',
    styles: [ navStyles ],
})
export class NavComponent {

}

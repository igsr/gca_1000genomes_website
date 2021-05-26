/*
Experimenting with layout and tidying banner
Original Author: susanfairley (content branch)
Changes to test branch: ranjits@ebi.ac.uk
Date: 19 April 2021
Change: margin-left: 20px;
*/ 
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

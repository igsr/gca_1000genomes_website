/*
Experimenting with layout and tidying banner
Original Author: susanfairley (content branch)
Changes to test branch: ranjits@ebi.ac.uk
Date: 19 April 2021
Changes:
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 10px;
*/ 

import { Component } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';

let appComponentStyles: string = `
div.data-portal-section {
  position: relative;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 10px;
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
export class AppComponent{
  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {};
};

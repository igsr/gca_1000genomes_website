import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: './sample-home.component.html',
})
export class SampleHomeComponent implements OnInit {
  public constructor(private titleService: Title ) { }

  ngOnInit() {
    this.titleService.setTitle('IGSR | samples');
  }
};

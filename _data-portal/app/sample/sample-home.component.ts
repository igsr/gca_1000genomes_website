import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ApiSampleService } from '../core/services/api-sample.service';
import { ApiHits } from '../shared/api-types/api-hits';

@Component({
    templateUrl: './sample-home.component.html',
})
export class SampleHomeComponent implements OnInit {
  public constructor(
    private titleService: Title,
    private apiSampleService: ApiSampleService,
  ) { }

  public apiHits: ApiHits;

  ngOnInit() {
    this.titleService.setTitle('IGSR | samples');
    this.apiSampleService.getAll()
      .subscribe((h: ApiHits) => this.apiHits = h);
  }
};

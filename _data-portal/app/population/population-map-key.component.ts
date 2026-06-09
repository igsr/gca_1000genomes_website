import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiPopulationService} from '../core/services/api-population.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';

let popMapKeyStyles: string = `
  div.panel {
  }
  .panel-body.continent-grid::before, .panel-body.continent-grid::after {
    display: none !important;
    content: none !important;
  }
  .continent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }   
  .continent {
    width: 100%;
  }
  .continent-title {
    font-weight: 700;
    margin-bottom: 6px;
  }
  .continent-list {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
  }
  .continent-item {
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1.3;
    margin: 2px 0;
  }
  .swatch {
    flex: 0 0 auto;
  }
  .continent-item-label {
    min-width: 0;
  }

}
`;

@Component({
    selector: 'population-map-key',
    templateUrl: './population-map-key.component.html',
    styles: [ popMapKeyStyles ],
})
export class PopulationMapKeyComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();



  constructor(
    private apiPopulationService: ApiPopulationService,
  ){};
  
  // public properties:
  public popHits: SearchHits<Population>;

  // private properties:
  private popHitsSubscription: Subscription = null;

  private getContinent(latitude: string | number, longitude: string | number): string {
    const lat = Number(latitude);
    const lon = this.normaliseLongitude(Number(longitude));

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90) {
      return 'Other';
    }

    if (lat <= -60) {
      return 'Antarctica';
    }

    if (
      this.isWithin(lat, lon, -50, 0, 110, 180) ||
      (lat >= -30 && lat <= 30 && (lon >= 160 || lon <= -110))
    ) {
      return 'Oceania';
    }

    if (
      this.isWithin(lat, lon, -56, 13, -82, -34) ||
      this.isWithin(lat, lon, 5, 84, -170, -52)
    ) {
      return 'America';
    }

    if (lat >= 12 && lat <= 38 && lon >= 34 && lon <= 60) {
      return 'Asia';
    }

    if (
      this.isWithin(lat, lon, -35, 37, -20, 52) &&
      !(lat > 12 && lon > 33)
    ) {
      return 'Africa';
    }

    if (this.isWithin(lat, lon, 35, 72, -25, 60)) {
      return 'Europe';
    }

    if (lat >= -10 && lat <= 82 && (lon >= 25 || lon <= -168)) {
      return 'Asia';
    }

    return 'Other';
  }

  private normaliseLongitude(longitude: number): number {
    if (isNaN(longitude)) {
      return longitude;
    }

    while (longitude < -180) {
      longitude += 360;
    }

    while (longitude > 180) {
      longitude -= 360;
    }

    return longitude;
  }

  private isWithin(
    latitude: number,
    longitude: number,
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number,
  ): boolean {
    return (
      latitude >= minLatitude &&
      latitude <= maxLatitude &&
      longitude >= minLongitude &&
      longitude <= maxLongitude
    );
  }
  
  get populationsByContinent(): { continent: string; populations: any[] }[] {
    if (!this.popHits || !this.popHits.hits) return [];
  
    const grouped = this.popHits.hits.reduce((acc, pop) => {
      const latitude = (pop && pop._source) ? pop._source.latitude : null;
      const longitude = (pop && pop._source) ? pop._source.longitude : null;
      const continent = this.getContinent(latitude, longitude);
      if (!acc[continent]) acc[continent] = [];
      acc[continent].push(pop);
      return acc;
    }, {} as Record<string, any[]>);
  
    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((continent) => ({
        continent: continent,
        populations: grouped[continent].sort((a, b) => {
          const aName = (a && a._source && a._source.name) ? a._source.name : '';
          const bName = (b && b._source && b._source.name) ? b._source.name : '';
          return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
        }),
      }));
  }

  ngOnInit() {
    this.popHitsSubscription = this.apiPopulationService.getAll()
      .subscribe((h: SearchHits<Population>) => {
        
        // sort alphabetically by name for the key
        const hits = (h && h.hits) ? h.hits : [];
        const sortedHits = ([] as any[]).concat(hits).sort((a, b) => {
          let na = (a && a._source && a._source.name ? a._source.name : '').toLowerCase();
          let nb = (b && b._source && b._source.name ? b._source.name : '').toLowerCase();
          return na < nb ? -1 : na > nb ? 1 : 0;
        });

        
        this.popHits = Object.assign({}, h, { hits: sortedHits });
      });
  }

  ngOnDestroy() {
    if (this.popHitsSubscription) {
      this.popHitsSubscription.unsubscribe();
    }
  }

  closePanel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}

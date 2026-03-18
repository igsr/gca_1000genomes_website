import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiSuperPopulationService} from '../core/services/api-superpopulation.service';
import { SearchHits } from '../shared/api-types/search-hits';
import { SuperPopulation } from '../shared/api-types/superpopulation';

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
    private apiSuperPopulationService: ApiSuperPopulationService,
  ){};
  
  // public properties:
  public superpopHits: SearchHits<SuperPopulation>;

  // private properties:
  private popHitsSubscription: Subscription = null;

  private readonly continentMap: Record<string, string> = {
    'East Asian Ancestry':             'East Asia',
    'European Ancestry':               'Europe',
    'African Ancestry':                'Africa',
    'American Ancestry':               'America',
    'South Asian Ancestry':            'South Asia',
    'America (HGDP)':                  'America',
    'Central South Asia (HGDP)':       'Central/South Asia',
    'Europe (HGDP)':                   'Europe',
    'Middle East (HGDP)':              'Middle East',
    'East Asia (HGDP)':                'East Asia',
    'Oceania (HGDP)':                  'Oceania',
    'Africa (HGDP)':                   'Africa',
    'Africa (SGDP)':                   'Africa',
    'America (SGDP)':                  'America',
    'Central Asia and Siberia (SGDP)': 'Central/South Asia',
    'East Asia (SGDP)':                'East Asia',
    'Oceania (SGDP)':                  'Oceania',
    'South Asia (SGDP)':               'South Asia',
    'West Eurasia (SGDP)':             'Europe',
  };
  
  get populationsByContinent(): { continent: string; superPopulations: any[] }[] {
    if (!this.superpopHits || !this.superpopHits.hits) return [];
  
    const grouped = this.superpopHits.hits.reduce((acc, pop) => {
      const popName = (pop && pop._source) ? pop._source.name : '';
      const continent = (popName && this.continentMap[popName]) ? this.continentMap[popName] : 'Other';
      if (!acc[continent]) acc[continent] = [];
      acc[continent].push(pop);
      return acc;
    }, {} as Record<string, any[]>);
  
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([continent, superPopulations]) => ({
        continent,
        superPopulations: superPopulations.sort((a, b) => {
          const aName = (a && a._source && a._source.name) ? a._source.name : '';
          const bName = (b && b._source && b._source.name) ? b._source.name : '';
          return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
        }),
      }));
  }

  ngOnInit() {
    this.popHitsSubscription = this.apiSuperPopulationService.getAll()
      .subscribe((h: SearchHits<SuperPopulation>) => {
        
        // sort alphabetically by name for the key
        const hits = (h && h.hits) ? h.hits : [];
        const sortedHits = ([] as any[]).concat(hits).sort((a, b) => {
          let na = (a && a._source && a._source.name ? a._source.name : '').toLowerCase();
          let nb = (b && b._source && b._source.name ? b._source.name : '').toLowerCase();
          return na < nb ? -1 : na > nb ? 1 : 0;
        });

        
        this.superpopHits = Object.assign({}, h, { hits: sortedHits });
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

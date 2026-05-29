import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiPopulationService } from '../core/services/api-population.service';
import { ApiAnalysisGroupService } from '../core/services/api-analysis-group.service';
import { ApiDataCollectionService } from '../core/services/api-data-collection.service';
import { ApiSuperPopulationService } from '../core/services/api-superpopulation.service';
import { AnalysisGroup } from '../shared/api-types/analysis-group';
import { DataCollection } from '../shared/api-types/data-collection';
import { SearchHit, SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';
import { SuperPopulation } from '../shared/api-types/superpopulation';
import { buildReadableFilterSummary as buildReadableFilterSummaryFromRpn } from '../shared/filter-builder-summary';
import { FilterBuilderBase, FilterSelectionChange, FilterTokenBase } from '../shared/filter-builder-base';
import { filterBuilderStyles } from '../shared/filter-builder.styles';

declare var L: any;

interface FilterToken extends FilterTokenBase<'dc' | 'ag'> {}

let populationHomeStyles: string = filterBuilderStyles;
populationHomeStyles += `

div.map {
  width: 95%;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

table {
  margin-top: 70px;
}

div.matrix-dot {
  text-align: center;
  font-size: 20px;
  cursor: default;
}

.population-marker-dot {
  display: block;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .35);
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

th.matrix-dot {
  width: 70px;
  white-space: nowrap;
  padding: 0;
}

th.matrix-dot > div {
  transform: translate(100%, 0) rotate(315deg);
  transform-origin: left bottom;
  width: inherit;
}

th.matrix-dot > div > div {
  border-bottom: 1px solid #ccc;
  width: 125px;
  height: 49px;
  line-height: 49px;
  cursor: pointer;
}

.data-collection-dot {
  color: #DAA406;
}

.analysis-group-dot {
  color: #79C7E7;
}

.Container {
  width: 110%;
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 60px;
}

.Content {
  width: 300px;
}

.Flipped, .Flipped .Content {
  transform: rotateX(180deg);
}

@media (max-width: 991px) {
  table {
    margin-top: 80px;
  }
  th.matrix-dot > div {
    transform: translate(100%, 0) rotate(270deg);
  }
  th.matrix-dot {
    width: 55px;
  }
  th.matrix-dot > div > div {
    height: 55px;
    line-height: 55px;
    text-indent: 5px;
  }
}
`;

@Component({
    templateUrl: './population-home.component.html',
    styles: [ populationHomeStyles ],
})
export class PopulationHomeComponent extends FilterBuilderBase<'dc' | 'ag', FilterToken> implements AfterViewInit, OnInit, OnDestroy {
  public constructor(
    private titleService: Title,
    private apiPopulationService: ApiPopulationService,
    private apiAnalysisGroupService: ApiAnalysisGroupService,
    private apiDataCollectionService: ApiDataCollectionService,
    private apiSuperPopulationService: ApiSuperPopulationService,
  ) {
    super();
    this.agTitleMap = this.apiAnalysisGroupService.titleMap;
    this.dcTitleMap = this.apiDataCollectionService.titleMap;
  }

  public populationHits: SearchHits<Population>;
  public superpopHits: SearchHits<SuperPopulation>;
  public dataCollectionList: SearchHits<DataCollection>;
  public analysisGroupList: SearchHits<AnalysisGroup>;
  public viewOption: number = 0;
  public filterBuilderCollapsed: boolean = true;

  public agFilterVisible: boolean = false;
  public agFilters: {[code: string]: boolean} = {};
  public agFiltersArr: string[] = [];
  readonly agTitleMap: {[key: string]: string};

  public dcFilterVisible: boolean = false;
  public dcFilters: {[code: string]: boolean} = {};
  public dcFiltersArr: string[] = [];
  readonly dcTitleMap: {[key: string]: string};

  public readableFilterSummary: string = '';
  public mapKeyVisible: boolean = false;

  private populationHitsSource: Subject<Observable<SearchHits<Population>>>;
  private populationHitsSubscription: Subscription = null;
  private superpopulationSubscription: Subscription = null;
  private dataCollectionSubscription: Subscription = null;
  private analysisGroupSubscription: Subscription = null;
  private map: any;
  private mapLayer: any;
  private markers: any;
  private markerRadius: number = 20;
  private readonly continentMap: Record<string, string> = {
    'East Asian Ancestry': 'Asia',
    'European Ancestry': 'Europe',
    'African Ancestry': 'Africa',
    'American Ancestry': 'America',
    'South Asian Ancestry': 'Asia',
    'America (HGDP)': 'America',
    'Central South Asia (HGDP)': 'Asia',
    'Europe (HGDP)': 'Europe',
    'Middle East (HGDP)': 'Middle East',
    'East Asia (HGDP)': 'Asia',
    'Oceania (HGDP)': 'Oceania',
    'Africa (HGDP)': 'Africa',
    'Africa (SGDP)': 'Africa',
    'America (SGDP)': 'America',
    'Central Asia and Siberia (SGDP)': 'Asia',
    'East Asia (SGDP)': 'Asia',
    'Oceania (SGDP)': 'Oceania',
    'South Asia (SGDP)': 'Asia',
    'West Eurasia (SGDP)': 'Europe',
  };

  ngOnInit() {
    this.titleService.setTitle('IGSR | populations');
    this.populationHitsSource = new Subject<Observable<SearchHits<Population>>>();
    this.populationHitsSubscription = this.populationHitsSource
      .switchMap((o: Observable<SearchHits<Population>>): Observable<SearchHits<Population>> => o)
      .subscribe((h: SearchHits<Population>) => {
        this.populationHits = h;
        this.updateMap();
      });
    this.dataCollectionSubscription = this.apiDataCollectionService.getAll()
      .subscribe((l: SearchHits<DataCollection>) => this.dataCollectionList = l);
    this.analysisGroupSubscription = this.apiAnalysisGroupService.getAll()
      .subscribe((l: SearchHits<AnalysisGroup>) => this.analysisGroupList = l);
    this.superpopulationSubscription = this.apiSuperPopulationService.getAll()
      .subscribe((h: SearchHits<SuperPopulation>) => this.superpopHits = this.sortSuperpopulations(h));
    this.search();
  }

  ngAfterViewInit() {
    this.updateMap();
  }

  ngOnDestroy() {
    if (this.populationHitsSubscription) {
      this.populationHitsSubscription.unsubscribe();
    }
    if (this.dataCollectionSubscription) {
      this.dataCollectionSubscription.unsubscribe();
    }
    if (this.analysisGroupSubscription) {
      this.analysisGroupSubscription.unsubscribe();
    }
    if (this.superpopulationSubscription) {
      this.superpopulationSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  mapView() {
    this.viewOption = 0;
    this.updateMap();
  }

  dataCollectionView() {
    this.viewOption = 1;
  }

  technologyView() {
    this.viewOption = 2;
  }

  onAgFiltersChange(change: FilterSelectionChange) {
    let nextKeys = this.buildSelectedKeysFromChange(this.agFiltersArr, change);
    this.updateTokenOrder('ag', this.agFiltersArr, nextKeys);
    this.agFilters = change.filters;
    this.agFiltersArr = nextKeys;
    this.filterBuilderCollapsed = this.filterTokens.length === 0;
    this.search();
  }

  onDcFiltersChange(change: FilterSelectionChange) {
    let nextKeys = this.buildSelectedKeysFromChange(this.dcFiltersArr, change);
    this.updateTokenOrder('dc', this.dcFiltersArr, nextKeys);
    this.dcFilters = change.filters;
    this.dcFiltersArr = nextKeys;
    this.filterBuilderCollapsed = this.filterTokens.length === 0;
    this.search();
  }

  toggleChainOperator(index: number) {
    super.toggleChainOperator(index);
    this.search();
  }

  groupSelection() {
    super.groupSelection();
    this.search();
  }

  ungroupSelection() {
    super.ungroupSelection();
    this.search();
  }

  toggleNegationForSelection() {
    super.toggleNegationForSelection();
    this.search();
  }

  search() {
    this.readableFilterSummary = this.buildReadableFilterSummary();
    this.populationHitsSource.next(this.apiPopulationService.search(-1, 0, this.buildFilterQuery()));
  }

  searchExport() {
    this.apiPopulationService.searchExport(this.buildFilterQuery(), 'igsr_populations');
  }

  toggleDcFilter(code: string) {
    this.dcFilters[code] = !this.dcFilters[code];
    this.onDcFiltersChange({ filters: this.dcFilters, code, isFiltered: this.dcFilters[code] });
  }

  toggleAgFilter(code: string) {
    this.agFilters[code] = !this.agFilters[code];
    this.onAgFiltersChange({ filters: this.agFilters, code, isFiltered: this.agFilters[code] });
  }

  get populationsByContinent(): { continent: string; superPopulations: SearchHit<SuperPopulation>[] }[] {
    if (!this.superpopHits || !this.superpopHits.hits) {
      return [];
    }
    let grouped: {[continent: string]: SearchHit<SuperPopulation>[]} = {};
    for (let pop of this.superpopHits.hits) {
      let popName = pop && pop._source ? pop._source.name : '';
      let continent = this.continentMap[popName] || 'Other';
      if (!grouped[continent]) {
        grouped[continent] = [];
      }
      grouped[continent].push(pop);
    }
    return Object.keys(grouped)
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((continent: string) => ({
        continent,
        superPopulations: grouped[continent],
      }));
  }

  public hasDataCollection(population: Population, dc: DataCollection): boolean {
    if (!population.dataCollections) {
      return false;
    }
    for (let populationDc of population.dataCollections) {
      if (populationDc.title === dc.title) {
        return true;
      }
    }
    return false;
  }

  public hasAnalysisGroup(populationHit: SearchHit<Population>, ag: AnalysisGroup): boolean {
    if (populationHit.fields && populationHit.fields.hasOwnProperty('dataCollections._analysisGroups')) {
      for (let agTitle of populationHit.fields['dataCollections._analysisGroups']) {
        if (agTitle === ag.title) {
          return true;
        }
      }
    }
    return false;
  }

  removeTokenFromFilters(token: FilterToken) {
    if (token.type === 'dc') {
      this.dcFilters[token.key] = false;
      this.onDcFiltersChange({ filters: this.dcFilters, code: token.key, isFiltered: false });
      return;
    }
    this.agFilters[token.key] = false;
    this.onAgFiltersChange({ filters: this.agFilters, code: token.key, isFiltered: false });
  }

  protected createToken(type: 'dc' | 'ag', key: string, id: string): FilterToken {
    return { id, type, key, negated: false };
  }

  private buildFilterQuery() {
    return super.buildQuery((token: FilterToken) => this.buildTokenClause(token));
  }

  private buildReadableFilterSummary(): string {
    if (this.filterTokens.length === 0) {
      return '';
    }
    return buildReadableFilterSummaryFromRpn(this.buildRpnTokens(), {
      entityLabel: 'populations',
      getFilterTypeLabel: (type: string) => this.getFilterTypeLabel(type),
      getFilterTypePluralLabel: (type: string) => this.getFilterTypePluralLabel(type),
      getTokenDisplayLabel: (token: FilterToken) => this.getTokenDisplayLabel(token),
    });
  }

  private getFilterTypeLabel(type: string): string {
    if (type === 'dc') {
      return 'data collection';
    }
    return 'technology';
  }

  private getFilterTypePluralLabel(type: string): string {
    if (type === 'dc') {
      return 'data collections';
    }
    return 'technologies';
  }

  private getTokenDisplayLabel(token: FilterToken): string {
    if (token.type === 'dc') {
      return this.dcTitleMap[token.key] || token.key;
    }
    return this.agTitleMap[token.key] || token.key;
  }

  private buildTokenClause(token: FilterToken): any {
    if (token.type === 'dc') {
      if (token.negated) {
        return { bool: { must_not: [{ term: { 'dataCollections.title': token.key } }] } };
      }
      return { term: { 'dataCollections.title': token.key } };
    }
    if (token.negated) {
      return { bool: { must_not: [{ term: { 'dataCollections._analysisGroups': token.key } }] } };
    }
    return { term: { 'dataCollections._analysisGroups': token.key } };
  }

  private updateMap() {
    setTimeout(() => {
      if (this.viewOption !== 0 || !this.populationHits || typeof L === 'undefined') {
        return;
      }
      let mapElement = document.getElementById('population-map');
      if (!mapElement) {
        return;
      }
      if (!this.map) {
        this.map = new L.map('population-map').setView([0, 0], 2);
        this.map.options.minZoom = 2;
        this.map.options.maxZoom = 6;
        this.mapLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
          minZoom: 0,
          maxZoom: 20,
          ext: 'png'
        }).addTo(this.map);
        let corner1 = new L.latLng(-90, -180);
        let corner2 = new L.latLng(90, 180);
        this.map.options.maxBounds = new L.latLngBounds(corner1, corner2);
        this.map.options.maxBoundsViscosity = 1.0;
      }
      this.plotPopulationHits();
      this.map.invalidateSize();
    }, 0);
  }

  private plotPopulationHits() {
    if (!this.map || !this.populationHits) {
      return;
    }
    if (this.markers) {
      this.map.removeLayer(this.markers);
    }
    this.markers = new L.markerClusterGroup({ maxClusterRadius: this.markerRadius });
    for (let hit of this.populationHits.hits) {
      let population = hit._source;
      let displayColour = population.superpopulation && population.superpopulation.display_colour ? population.superpopulation.display_colour : '#018ead';
      let icon = L.MakiMarkers ? L.MakiMarkers.icon({ icon: 'circle-stroked', color: displayColour, size: 's' }) : undefined;
      let lat = Number(population.latitude);
      let lon = Number(population.longitude);
      if (isNaN(lat) || isNaN(lon)) {
        continue;
      }
      let superpopulationName = population.superpopulation ? population.superpopulation.name : '';
      this.markers.addLayer(new L.marker([lat, lon], { icon }).bindPopup(`<a href="/data-portal/population/${population.elasticId}">${population.description}</a><br>${superpopulationName}`));
    }
    this.map.addLayer(this.markers);
  }

  private sortSuperpopulations(h: SearchHits<SuperPopulation>): SearchHits<SuperPopulation> {
    if (!h || !h.hits) {
      return h;
    }
    let sortedHits = ([] as SearchHit<SuperPopulation>[]).concat(h.hits).sort((a, b) => {
      let aName = a && a._source && a._source.name ? a._source.name : '';
      let bName = b && b._source && b._source.name ? b._source.name : '';
      return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
    });
    return Object.assign({}, h, { hits: sortedHits });
  }
}

import { Component, OnChanges, SimpleChange, OnInit, Input } from '@angular/core';
import { SearchHit, SearchHits } from '../shared/api-types/search-hits';
import { Population } from '../shared/api-types/population';

//L is the Leaflet global variable - library loaded in script tag in data-portal.html
declare var L: any;

let populationMapStyles: string = `

	div.map {
  	width: 95%;
  	height: 100vh;
  	margin-left: auto;
  	margin-right: auto;
		margin-bottom: 10px;
	}

`;


@Component({
    templateUrl: './population-map.component.html',
		styles: [ populationMapStyles ],
		selector: 'population-map',
})
export class PopulationMapComponent implements OnInit, OnChanges{
	@Input() populationHits: SearchHits<Population>;

	L: any;
	map: any;
	layer: any;
	markers: any;
	token: any;
  radius: any;

	constructor(){
	}

	ngOnInit(){

		//map setup
		this.token = 'pk.eyJ1IjoiaWdzciIsImEiOiJjandtMmZxb2MxOTdhNDVuNmxtN3IycTZvIn0.j1vNmN7B9ansOhnun1-nlQ';
		L.MakiMarkers.accessToken = this.token;
		this.map = new L.map('map').setView([0, 0], 2);
		this.map.options.minZoom = 2;
		this.map.options.maxZoom = 6;
		//this.layer = new L.StamenTileLayer("toner-lite").addTo(this.map);
		this.layer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
   minZoom: 0,
   maxZoom: 20,
   ext: 'png'
}).addTo(this.map);

		//prevent moving beyond world into grey space
		let corner1 = new L.latLng(-90, -180);
		let corner2 = new L.latLng(90, 180);
		let bounds = new L.latLngBounds(corner1, corner2);
		this.map.options.maxBounds = bounds;
		this.map.options.maxBoundsViscosity = 1.0;


		//set up cluster group
		this.radius = 20;
		this.markers = new L.markerClusterGroup({
        maxClusterRadius: this.radius
    });
		this.plotPopulationHits();
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}){
		//only one @Input for this component, so not checking which input changed
		//only update markers after OnInit has set up markers
		if(this.markers){
			this.map.removeLayer(this.markers);
			this.markers = new L.markerClusterGroup({
				maxClusterRadius: this.radius
			});
			this.plotPopulationHits();
		}
	}

	plotPopulationHits(){

		if(this.populationHits != null){
    	for(let hit of this.populationHits.hits){
				let displayColour = hit._source.superpopulation.display_colour;
				let icon = L.MakiMarkers.icon({icon: "circle-stroked", color: displayColour, size: "s"});
      	let lat = Number(hit._source.latitude);
      	let lon = Number(hit._source.longitude);
      	this.markers.addLayer(new L.marker([lat, lon], {icon: icon}).bindPopup("<a href=\"/data-portal/population/"+hit._source.elasticId+"\">"+hit._source.description+"</a><br>"+hit._source.superpopulation.name));
    	}
    	this.map.addLayer(this.markers);
		}

	}

};


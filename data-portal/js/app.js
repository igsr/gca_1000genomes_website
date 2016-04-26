'use strict';

var dependencies = [
    'ngRoute',
    'ngSanitize',
    'gcaElasticsearch'
];

var app = angular.module('igsrPortal', dependencies);

app.config(['$locationProvider', '$routeProvider', 'gcaElasticsearchProvider',
            function($locationProvider, $routeProvider, gcaElasticsearchProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/beta/sample/:sample', {
        templateUrl: 'partials/sample-detail.html',
        controller: 'SampleCtrl',
        controllerAs: 'SampleCtrl',
    })
    .otherwise({
        redirectTo: '/beta/sample/NA12878',
    });

    gcaElasticsearchProvider.baseUrl = 'http://www.1000genomes.org/api/beta';

}]);

app.controller('SampleCtrl', ['$routeParams', function($routeParams) {
    var c = this;
    c.name = $routeParams.sample;

    c.fileSearchBody = function(es, dataCollection, dataType, analysisGroup) {
      es.search( {
        query: {
          bool: {
            must: [
              {term: {dataCollections: dataCollection}},
              {term: {analysisGroup: analysisGroup}},
              {term: {dataType: dataType}},
            ]
          }
        }
      });
    };
}]);


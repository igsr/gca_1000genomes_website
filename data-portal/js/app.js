'use strict';

var dependencies = [
    'ngRoute',
    'ngSanitize',
    'gcaElasticsearch',
    'ui.bootstrap'
];


var app = angular.module('igsrPortal', dependencies);

app.config(['$locationProvider', '$routeProvider', 'gcaElasticsearchProvider',
            function($locationProvider, $routeProvider, gcaElasticsearchProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/sample/:sample', {
        templateUrl: 'partials/sample-detail.html?ver=20160429',
        controller: 'SampleCtrl',
        controllerAs: 'SampleCtrl',
    })
    .when('/population/:population', {
        templateUrl: 'partials/population-detail.html?ver=20160429',
        controller: 'PopulationCtrl',
        controllerAs: 'PopCtrl',
    })
    .otherwise({
        redirectTo: '/sample/NA12878',
    });

    gcaElasticsearchProvider.baseUrl = 'http://test.1000genomes.org/api/beta';

}]);

app.filter('ucFirst', function() {
    return function(string) {
        string = string || '';
        return string.charAt(0).toUpperCase() + string.slice(1) };
});
app.filter('softHyphenUrl', function($sce) {
    return function(string) {
        string = string || '';
        return $sce.trustAsHtml(string.replace(/\//g, '/&shy;'));
    };
});

app.controller('SampleCtrl', ['$routeParams', '$scope', 'gcaElasticsearch', function($routeParams, $scope, gcaElasticsearch) {
    var c = this;
    c.name = $routeParams.sample;
    c.fileSearchBody = null;
    c.hitsPerPage = 20;

    c.setDataCollection = function(dc) {
        if (dc !== c.dataCollection) {
            c.dataCollection = dc;
            c.filePage = 1;
            c.fileSearch();
        }
    };

    c.setFileSelection = function() {
      if (angular.isObject($scope.sample) && $scope.sample.hasOwnProperty('dataCollections')) {
          c.dataCollection = $scope.sample.dataCollections[0];
          c.dataType = c.dataCollection.dataTypes[0];
          c.analysisGroup = c.dataCollection[c.dataType][0];
          c.fileSearch();
      }
      else {
          c.dataCollection = null;
          c.dataType = null;
          c.analysisGroup = null;
      }
    };

    c.fileSearch = function(options) {
      if (angular.isObject(options) && options.page1) {
          c.filePage = 1;
      };
      
      if (angular.isObject(c.dataCollection) && angular.isString(c.analysisGroup) && angular.isString(c.dataType)) {
          if ( ! c.dataCollection.hasOwnProperty(c.dataType)) {
              c.dataType = c.dataCollection.dataTypes[0];
          }
          if (c.dataCollection[c.dataType].indexOf(c.analysisGroup) <0) {
              c.analysisGroup = c.dataCollection[c.dataType][0];
          }
          c.fileSearchBody = {
            from: (c.filePage -1)*c.hitsPerPage,
            size: c.hitsPerPage,
            query: {
              bool: {
                must: [
                  {term: {dataCollections: c.dataCollection.dataCollection}},
                  {term: {analysisGroup: c.analysisGroup}},
                  {term: {dataType: c.dataType}},
                  {term: {samples: c.name}},
                ]
              }
            }
          };
      }
      else {
          c.fileSearchBody = null;
      }
    };

    c.fileSearchExport = function() {
      var fileSearchBody = {
        fields: ["url", "md5", "dataCollections"],
        column_names: ["url", "md5", "Data Collection"],
        query: {
          bool: {
            must: [
              {term: {dataCollections: c.dataCollection.dataCollection}},
              {term: {analysisGroup: c.analysisGroup}},
              {term: {dataType: c.dataType}},
              {term: {samples: c.name}},
            ]
          }
        }
      };

      gcaElasticsearch.searchExport({type: 'file', format: 'tsv', filename: 'igsr', body: fileSearchBody});
    };

}]);

app.controller('PopulationCtrl', ['$routeParams', '$scope', 'gcaElasticsearch', function($routeParams, $scope, gcaElasticsearch) {
    var c = this;
    c.popCode = $routeParams.population;

    c.sampleHitsPerPage = 10;
    c.samplePage = 1;

    c.sampleSearch = function() {
      c.sampleSearchBody = {
        from: (c.samplePage -1)*c.sampleHitsPerPage,
        size: c.sampleHitsPerPage,
        query: { filtered: { filter: { term:{ 'population.code': c.popCode } } } }
      };
    }
    c.sampleSearch();

    c.sampleExport = function() {
      var searchBody = {
        fields: ['name', 'sex', 'population.code', 'biosampleId'],
        column_names: ['Name', 'Sex', 'Population', 'Biosample ID'],
        query: { filtered: { filter: { term:{ 'population.code': c.popCode } } } }
      };

      gcaElasticsearch.searchExport({type: 'sample', format: 'tsv', filename: c.popCode, body: searchBody});
    };
}]);


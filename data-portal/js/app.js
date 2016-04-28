'use strict';

var dependencies = [
    'ngRoute',
    'ngSanitize',
    'gcaElasticsearch'
];

var igsrUtils = {
    ucFirst: function(string) {
        if (angular.isString(string)) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
};

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

app.controller('SampleCtrl', ['$routeParams', '$scope', function($routeParams, $scope) {
    var c = this;
    c.name = $routeParams.sample;
    c.fileSearchBody = null;

    $scope.igsrUtils = igsrUtils;

    c.setDataCollection = function(dc) {
        if (dc !== c.dataCollection) {
            c.dataCollection = dc;
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

    c.fileSearch = function() {
      if (angular.isObject(c.dataCollection) && angular.isString(c.analysisGroup) && angular.isString(c.dataType)) {
          if ( ! c.dataCollection.hasOwnProperty(c.dataType)) {
              c.dataType = c.dataCollection.dataTypes[0];
          }
          if (c.dataCollection[c.dataType].indexOf(c.analysisGroup) <0) {
              c.analysisGroup = c.dataCollection[c.dataType][0];
          }
          c.fileSearchBody = {
            query: {
              bool: {
                must: [
                  {term: {dataCollections: c.dataCollection.dataCollection}},
                  {term: {analysisGroup: c.analysisGroup}},
                  {term: {dataType: c.dataType}},
                ]
              }
            }
          };
      }
      else {
          c.fileSearchBody = null;
      }
    };

}]);


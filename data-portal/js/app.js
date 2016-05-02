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
        templateUrl: 'partials/sample-detail.html?ver=20160502',
        controller: 'SampleCtrl',
        controllerAs: 'SampleCtrl',
    })
    .when('/population/:population', {
        templateUrl: 'partials/population-detail.html?ver=20160502',
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
        return $sce.trustAsHtml(string.replace(/[\/\.]/g, '$&&shy;'));
    };
});

app.controller('SampleCtrl', ['$routeParams', '$scope', 'gcaElasticsearch', function($routeParams, $scope, gcaElasticsearch) {
    var c = this;
    c.name = $routeParams.sample;

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
        query: { constant_score: { filter: { term:{ 'population.code': c.popCode } } } }
      };
    }
    c.sampleSearch();

    c.sampleExport = function() {
      var searchBody = {
        fields: ['name', 'sex', 'population.code', 'biosampleId'],
        column_names: ['Name', 'Sex', 'Population', 'Biosample ID'],
        query: { constant_score: { filter: { term:{ 'population.code': c.popCode } } } }
      };

      gcaElasticsearch.searchExport({type: 'sample', format: 'tsv', filename: c.popCode, body: searchBody});
    };
}]);


app.directive('dcFileList', function() { return {
  scope: {},
  bindToController: {
    dataCollectionArr: '=dcArray',
    esFileTerm: '@',
    objectName: '@dcFileList',
    fileHits: '=',
  },
  templateUrl: 'partials/dc-file-list.html?ver=?20160502',
  controllerAs: 'ListCtrl',
  transclude: true,
  link: function(scope, iElement, iAttr, controller) {
      var watcher = scope.$watch('ListCtrl.dataCollectionArr', function(dataCollectionArr) {
        if (angular.isArray(dataCollectionArr)) {
          controller.setDataCollection(dataCollectionArr[0]);
        }
      });
      iElement.on('$destroy', watcher);
  },
  controller: ['gcaElasticsearch', function(gcaElasticsearch) {
    var c = this;
    c.fileSearchBody = null;
    c.hitsPerPage = 20;
    c.dataCollection = null;

    c.setDataCollection = function(dc) {
        if (dc !== c.dataCollection) {
            c.dataCollection = dc;
            c.filePage = 1;
            c.filterDataTypes = {};
            c.filterAnalysisGroups = {};
            c.disableDataTypes = {};
            c.disableAnalysisGroups = {};
            angular.forEach(dc.dataTypes, function(dt) {
                c.filterDataTypes[dt] = false;
                angular.forEach(dc[dt], function(ag) {
                    c.filterAnalysisGroups[ag] = false;
                });
            });
            c.fileSearch();
        }
    };

    c.selectDataType = function() {
        var enableAnalysisGroups = {};
        var numFilteredDataTypes = 0;
        c.disableAnalysisGroups = {};
        angular.forEach(c.filterDataTypes, function(dtIsSelected, dt) {
            if (!dtIsSelected) {return;}
            angular.forEach(c.dataCollection[dt], function(ag) {
                enableAnalysisGroups[ag] = true;
            });
            numFilteredDataTypes += 1;
        });
        if (numFilteredDataTypes > 0) {
            angular.forEach(c.filterAnalysisGroups, function(agIsSelected, ag) {
                if (enableAnalysisGroups[ag]) {return;}
                c.disableAnalysisGroups[ag] = true;
            });
        }
        c.fileSearch();
    };

    c.selectAnalysisGroup = function() {
        var enableDataTypes = {};
        var numFilteredAnalysisGroups = 0;
        c.disableDataTypes = {};
        angular.forEach(c.filterAnalysisGroups, function (agIsSelected, ag) {
            if (!agIsSelected) {return;}
            angular.forEach(c.dataCollection.dataTypes, function(dt) {
                if (c.dataCollection[dt].indexOf(ag) > -1) {
                    enableDataTypes[dt] = true;
                }
            });
            numFilteredAnalysisGroups += 1;
        });
        if (numFilteredAnalysisGroups > 0) {
            angular.forEach(c.filterDataTypes, function(dtIsSelected, dt) {
                if (enableDataTypes[dt]) {return;}
                c.disableDataTypes[dt] = true;
            });
        }
        c.fileSearch();
    };

    c.fileSearch = function() {
      
      if (angular.isObject(c.dataCollection)) {
          c.fileSearchBody = {
            from: (c.filePage -1)*c.hitsPerPage,
            size: c.hitsPerPage,
            query: { constant_score: { filter: {
              bool: {
                must: [
                  {term: {dataCollections: c.dataCollection.dataCollection}},
                ]
              }
            }}}
          };
          var objectTerm = {}
          objectTerm[c.esFileTerm] = c.objectName;
          c.fileSearchBody.query.constant_score.filter.bool.must.push({term: objectTerm});

          var dtShould = [];
          angular.forEach(c.filterDataTypes, function (isFiltered, dt) {
              if (!isFiltered) {return;}
              dtShould.push({term: {dataType: dt}});
          });
          if (dtShould.length == 1) {
              c.fileSearchBody.query.constant_score.filter.bool.must.push(dtShould[0]);
          }
          else if (dtShould.length > 1) {
              c.fileSearchBody.query.constant_score.filter.bool.must.push({bool: {should: dtShould}});
          }

          var agShould = [];
          angular.forEach(c.filterAnalysisGroups, function (isFiltered, ag) {
              if (!isFiltered) {return;}
              agShould.push({term: {analysisGroup: ag}});
          });
          if (agShould.length == 1) {
              c.fileSearchBody.query.constant_score.filter.bool.must.push(agShould[0]);
          }
          else if (agShould.length > 1) {
              c.fileSearchBody.query.constant_score.filter.bool.must.push({bool: {should: agShould}});
          }


      }
      else {
          c.fileSearchBody = null;
      }
    };


    c.fileSearchExport = function() {
      var fileSearchBody = {
        fields: ["url", "md5", "dataCollections"],
        column_names: ["url", "md5", "Data Collection"],
        query: c.fileSearchBody.query
      };

      gcaElasticsearch.searchExport({type: 'file', format: 'tsv', filename: 'igsr', body: fileSearchBody});
    };

  }],
};});

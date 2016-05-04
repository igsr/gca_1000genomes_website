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
    .when('/sample', {
        templateUrl: 'partials/sample-list.html?ver=20160503',
        controller: 'SampleListCtrl',
        controllerAs: 'ListCtrl',
    })
    .when('/sample/:sample', {
        templateUrl: 'partials/sample-detail.html?ver=20160503',
        controller: 'SampleCtrl',
        controllerAs: 'SampleCtrl',
    })
    .when('/population/:population', {
        templateUrl: 'partials/population-detail.html?ver=20160503',
        controller: 'PopulationCtrl',
        controllerAs: 'PopCtrl',
    })
    .otherwise({
        redirectTo: '/sample',
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

app.controller('SampleCtrl', ['$routeParams', function($routeParams) {
    var c = this;
    c.name = $routeParams.sample;

}]);

app.controller('PopulationCtrl', ['$routeParams', 'gcaElasticsearch', function($routeParams, gcaElasticsearch) {
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
        fields: ['name', 'sex', 'biosampleId', 'population.code', 'population.name', 'superpopulation.code', 'superpopulation.name', 'dataCollections.dataCollection'],
        column_names: ['Sample name', 'Sex', 'Biosample ID', 'Population code', 'Population name', 'Superpopulation code', 'Superpopulation name', 'Data collections'],
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
  templateUrl: 'partials/dc-file-list.html?ver=?20160503',
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
        fields: ['url', 'md5', 'dataCollections', 'dataType', 'analysisGroup', 'samples', 'populations', 'dataReusePolicy'],
        column_names: ['url', 'md5', 'Data collection', 'Data type', 'Analysis group', 'Sample', 'Population', 'Data reuse policy'],
        query: c.fileSearchBody.query
      };

      gcaElasticsearch.searchExport({type: 'file', format: 'tsv', filename: 'igsr', body: fileSearchBody});
    };

  }],
};});

app.controller('SampleListCtrl', [function() {
    var c = this;
    c.hitsPerPage = 100;
    c.page = 1;
    c.viewOption = 2;
    c.searchBody = {
      from: (c.page -1)*c.hitsPerPage,
      size: c.hitsPerPage,
    };

    c.dataCollectionNames = [
        ['1000 Genomes on GRCh38', 'GRCh38'],
        ['1000 Genomes phase 3 release', 'Phase 3'],
        ['1000 Genomes phase 1 release', 'Phase 1'],
        ['Illumina Platinum pedigree', 'Platinum pedigree'],
        ['Human Genome Structural Variation Consortium', 'Structural variation']
    ];

    c.analysisGroupNames = [
        ['Exome', 'Exome'],
        ['Low coverage WGS', 'Low cov WGS'],
        ['High coverage WGS', 'High cov WGS'],
        ['HD genotype chip', 'HD genotype chip'],
        ['Complete Genomics', 'Complete Genomics'],
        ['Targetted exon', 'Targetted exon'],
        ['Illumina platinum pedigree', 'Platinum pedigree'],
        ['Strand specific RNA-seq', 'Strand RNA-seq'],
        ['Strand-seq', 'Strand-seq'],
        ['3.5kb jumping library', '3.5kb jump library'],
        ['7kb mate pair libray', '7kb mate pair'],
        ['Single molecule real time (SMRT)','SMRT'],
        ['PCR-free high coverage', 'PCR-free high cov'],
        ['HiC', 'HiC'],
    ];

    
    c.hasCollection = function(sample, dcName) {
        if (sample && sample._source && sample._source.dataCollections) {
          for (var i in sample._source.dataCollections) {
            if (sample._source.dataCollections[i].dataCollection === dcName) {
              return true;
            }
          }
        }
        return false;
    };

    c.hasAnalysisGroup = function(sample, agName) {
        if (sample && sample._source && sample._source.dataCollections) {
          for (var i in sample._source.dataCollections) {
            var dc = sample._source.dataCollections[i];
            for (var j in dc.dataTypes) {
              if (dc[dc.dataTypes[j]].indexOf(agName) > -1) {
                return true;
              }
            }
          }
        }
        return false;
    };

}]);

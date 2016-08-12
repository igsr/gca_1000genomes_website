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
        templateUrl: 'partials/sample-list.html?ver=20160810',
        controller: 'SampleListCtrl',
        controllerAs: 'ListCtrl',
    })
    .when('/population', {
        templateUrl: 'partials/population-list.html?ver=20160810',
        controller: 'PopulationListCtrl',
        controllerAs: 'ListCtrl',
    })
    .when('/search', {
        templateUrl: 'partials/search-page.html?ver=20160810',
    })
    .when('/sample/:sample', {
        templateUrl: 'partials/sample-detail.html?ver=20160810',
        controller: 'SampleCtrl',
        controllerAs: 'SampleCtrl',
    })
    .when('/population/:population', {
        templateUrl: 'partials/population-detail.html?ver=20160810',
        controller: 'PopulationCtrl',
        controllerAs: 'PopCtrl',
    })
    .when('/data-collection/:dc', {
        templateUrl: 'partials/data-collection.html?ver=20160810',
        controller: 'DataCollectionCtrl',
        controllerAs: 'DcCtrl',
    })
    .otherwise({
        redirectTo: '/sample',
    });

    gcaElasticsearchProvider.baseUrl = '/api/beta';
    gcaElasticsearchProvider.cachedSearches = {
      pops: { type: 'population', body: {
        size: -1,
        fields: ['code', 'name'],
        sort: ['code']
      }},
      dc: { type: 'data-collection', body: {
        size: -1,
        sort: ['displayOrder'],
      }},
    };

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
  templateUrl: 'partials/dc-file-list.html?ver=?20160810',
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

app.controller('SampleListCtrl', ['gcaElasticsearch', function(gcaElasticsearch) {
    var c = this;
    c.hitsPerPage = 50;
    c.page = 1;
    c.viewOption = 1;
    c.showPopPanel = false;
    c.showAGPanel = false;
    c.showDCPanel = false;

    c.filteredAGs = {};
    c.filteredDCs = {};
    c.filteredPops = {};

    c.filteredAGsArray = [];
    c.filteredDCsArray = [];
    c.filteredPopsArray = [];

    c.searchBody = {
      from: (c.page -1)*c.hitsPerPage,
      size: c.hitsPerPage,
      fields: ['name', 'sex', 'population.name', 'population.code', 'dataCollections.dataCollection', 'dataCollections._analysisGroups'],
    };

    c.toggleView = function() {
       c.viewOption = c.viewOption == 1 ? 2 : 1;
    };

    c.togglePopPanel = function() {
      c.showPopPanel = c.showPopPanel ? false : true;
      c.showAGPanel = false;
      c.showDCPanel = false;
      c.populations = gcaElasticsearch.cachedSearch('pops');
    };
    c.toggleAGPanel = function() {
      c.showAGPanel = c.showAGPanel ? false : true;
      c.showPopPanel = false;
      c.showDCPanel = false;
      if (c.showAGPanel) {
        c.viewOption = 2;
      }
    };
    c.toggleDCPanel = function() {
      c.showDCPanel = c.showDCPanel ? false : true;
      c.showPopPanel = false;
      c.showAGPanel = false;
      if (c.showDCPanel) {
        c.viewOption = 1;
      }
    };

    c.dataCollections = gcaElasticsearch.cachedSearch('dc');

    c.analysisGroupNames = [
        ['Exome', 'Exome'],
        ['Low coverage WGS', 'Low cov WGS'],
        ['High coverage WGS', 'High cov WGS'],
        ['HD genotype chip', 'HD genotype chip'],
        ['Complete Genomics', 'Complete Genomics'],
        ['Targeted exon', 'Targeted exon'],
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
        if (sample && sample.fields && sample.fields['dataCollections.dataCollection'] ) {
          if (sample.fields['dataCollections.dataCollection'].indexOf(dcName) > -1) {
            return true;
          }
        }
        return false;
    };

    c.hasAnalysisGroup = function(sample, agName) {
        if (sample && sample.fields && sample.fields['dataCollections._analysisGroups'] ) {
          if (sample.fields['dataCollections._analysisGroups'].indexOf(agName) > -1) {
            return true;
          }
        }
        return false;
    };

    c.search = function(options) {
      if (options && options.page) {
        c.page = options.page;
      };
      c.searchBody = {
        from: (c.page -1)*c.hitsPerPage,
        size: c.hitsPerPage,
        fields: c.searchBody.fields
      };

      var filtPopTerms = [];
      c.filteredPopsArray = [];
      angular.forEach(c.filteredPops, function(isFiltered, popCode) {
        if (!isFiltered) {return;}
        var term = {};
        term['population.code'] = popCode;
        filtPopTerms.push({term: term});
        c.filteredPopsArray.push(popCode);
      });
      c.filteredPopsArray = c.filteredPopsArray.sort();


      var mustTerms = [];
      c.filteredDCsArray = [];
      if (angular.isArray(c.dataCollections.hits.hits)) {
        for (var i=0; i<c.dataCollections.hits.hits.length; i++) {
          var dc = c.dataCollections.hits.hits[i]._source;
          if (c.filteredDCs[dc.title]) {
            var term = {};
            term['dataCollections.dataCollection'] = dc.title;
            mustTerms.push({term: term});
            c.filteredDCsArray.push(dc);
          }
        };
      }
      c.filteredAGsArray = [];
      for (var i=0; i<c.analysisGroupNames.length; i++) {
        if (c.filteredAGs[c.analysisGroupNames[i][0]]) {
          var term = {};
          term['dataCollections._analysisGroups'] = c.analysisGroupNames[i][0];
          mustTerms.push({term: term});
          c.filteredAGsArray.push(c.analysisGroupNames[i]);
        }
      };

      if (filtPopTerms.length > 0 && mustTerms.length == 0) {
        c.searchBody.query = {constant_score: {filter: {bool: {should: filtPopTerms}}}};
      }
      else if (mustTerms.length > 0) {
        if (filtPopTerms.length >0) {
            mustTerms.push({bool: {should: filtPopTerms}});
        }
        c.searchBody.query = {constant_score: {filter: {bool: {must: mustTerms}}}};
      }

        
    };

    c.sampleExport = function() {
      var searchBody = {
        fields: ['name', 'sex', 'biosampleId', 'population.code', 'population.name', 'superpopulation.code', 'superpopulation.name', 'dataCollections.dataCollection'],
        column_names: ['Sample name', 'Sex', 'Biosample ID', 'Population code', 'Population name', 'Superpopulation code', 'Superpopulation name', 'Data collections'],
      };

      if (c.searchBody.query) {
          searchBody.query = c.searchBody.query;
      }
      gcaElasticsearch.searchExport({type: 'sample', format: 'tsv', filename: 'igsr_samples', body: searchBody});
    };

}]);

app.controller('PopulationListCtrl', ['gcaElasticsearch', function(gcaElasticsearch) {
    var c = this;
    c.viewOption = 1;
    c.showAGPanel = false;
    c.showDCPanel = false;

    c.filteredAGs = {};
    c.filteredDCs = {};

    c.filteredAGsArray = [];
    c.filteredDCsArray = [];

    c.searchBody = {
      size: -1,
      fields: ['code', 'name', 'description', 'superpopulation.code', 'superpopulation.name', 'samples.count', 'dataCollections.dataCollection', 'dataCollections._analysisGroups'],
    };

    c.toggleView = function() {
       c.viewOption = c.viewOption == 1 ? 2 : 1;
    };

    c.toggleAGPanel = function() {
      c.showAGPanel = c.showAGPanel ? false : true;
      c.showPopPanel = false;
      c.showDCPanel = false;
      if (c.showAGPanel) {
        c.viewOption = 2;
      }
    };
    c.toggleDCPanel = function() {
      c.showDCPanel = c.showDCPanel ? false : true;
      c.showPopPanel = false;
      c.showAGPanel = false;
      if (c.showDCPanel) {
        c.viewOption = 1;
      }
    };
    c.dataCollections = gcaElasticsearch.cachedSearch('dc');

    c.analysisGroupNames = [
        ['Exome', 'Exome'],
        ['Low coverage WGS', 'Low cov WGS'],
        ['High coverage WGS', 'High cov WGS'],
        ['HD genotype chip', 'HD genotype chip'],
        ['Complete Genomics', 'Complete Genomics'],
        ['Targeted exon', 'Targeted exon'],
        ['Illumina platinum pedigree', 'Platinum pedigree'],
        ['Strand specific RNA-seq', 'Strand RNA-seq'],
        ['Strand-seq', 'Strand-seq'],
        ['3.5kb jumping library', '3.5kb jump library'],
        ['7kb mate pair libray', '7kb mate pair'],
        ['Single molecule real time (SMRT)','SMRT'],
        ['PCR-free high coverage', 'PCR-free high cov'],
        ['HiC', 'HiC'],
    ];

    
    c.hasCollection = function(population, dcName) {
        if (population && population.fields && population.fields['dataCollections.dataCollection'] ) {
          if (population.fields['dataCollections.dataCollection'].indexOf(dcName) > -1) {
            return true;
          }
        }
        return false;
    };

    c.hasAnalysisGroup = function(population, agName) {
        if (population && population.fields && population.fields['dataCollections._analysisGroups'] ) {
          if (population.fields['dataCollections._analysisGroups'].indexOf(agName) > -1) {
            return true;
          }
        }
        return false;
    };

    c.search = function(options) {
      c.searchBody = {
        size: -1,
        fields: c.searchBody.fields
      };

      var mustTerms = [];
      c.filteredDCsArray = [];
      if (angular.isArray(c.dataCollections.hits.hits)) {
        for (var i=0; i<c.dataCollections.hits.hits.length; i++) {
          var dc = c.dataCollections.hits.hits[i]._source;
          if (c.filteredDCs[dc.title]) {
            var term = {};
            term['dataCollections.dataCollection'] = dc.title;
            mustTerms.push({term: term});
            c.filteredDCsArray.push(dc);
          }
        };
      }
      c.filteredAGsArray = [];
      for (var i=0; i<c.analysisGroupNames.length; i++) {
        if (c.filteredAGs[c.analysisGroupNames[i][0]]) {
          var term = {};
          term['dataCollections._analysisGroups'] = c.analysisGroupNames[i][0];
          mustTerms.push({term: term});
          c.filteredAGsArray.push(c.analysisGroupNames[i]);
        }
      };

      if (mustTerms.length > 0) {
        c.searchBody.query = {constant_score: {filter: {bool: {must: mustTerms}}}};
      }

        
    };

    c.populationExport = function() {
      var searchBody = {
        fields: ['code', 'name', 'description', 'superpopulation.code', 'superpopulation.name', 'samples.count', 'dataCollections.dataCollection'],
        column_names: ['Population code', 'Population name', 'Population description', 'Superpopulation code', 'Superpopulation name', 'Number of samples', 'Data collections'],
      };

      if (c.searchBody.query) {
          searchBody.query = c.searchBody.query;
      }
      gcaElasticsearch.searchExport({type: 'population', format: 'tsv', filename: 'igsr_populations', body: searchBody});
    };

}]);

app.controller('DataCollectionCtrl', ['$routeParams', '$scope', 'gcaElasticsearch', '$http', function($routeParams, $scope, gcaElasticsearch, $http) {
    var c = this;
    
    var processDCs = function(esDCs) {
      if (esDCs.error) {
        c.apiError = esDCs.error;
        return;
      }
      var dcId;
      angular.forEach(esDCs.hits.hits, function(dc) {
        if (dc._id === $routeParams.dc) {
          c.dc = dc._source;
          dcId = dc._id;
        }
      });
      if (!c.dc) {
        c.apiError = {status: 404, statusText: 'Not found'};
        return;
      }
      $http.get('data-collections/'+dcId+'.html').then(function(resp) {
        if (resp.data.startsWith('<div')) {
          c.description = resp.data;
        }
      });
      c.sampleSearch();
      c.popSearch();
    };

    var esDCs = gcaElasticsearch.cachedSearch('dc');
    if (esDCs.finished) {
      processDCs(esDCs);
    }
    else {
      c.watcher = $scope.$watchCollection(function() {return esDCs;}, function(esDCs) {
        if (esDCs.isLoading) {
          c.isLoading = true;
          return;
        }
        if (esDCs.finished) {
          c.isLoading = false;
          c.watcher();
          processDCs(esDCs);
        }
      });
      $scope.$on('$destroy', c.watcher);
    }

    c.sampleHitsPerPage = 10;
    c.samplePage = 1;
    c.sampleSearch = function() {
      c.sampleSearchBody = {
        from: (c.samplePage -1)*c.sampleHitsPerPage,
        size: c.sampleHitsPerPage,
        query: { constant_score: { filter: { term:{ 'dataCollections.dataCollection': c.dc.title } } } }
      };
    }
    c.sampleExport = function() {
      var searchBody = {
        fields: ['name', 'sex', 'biosampleId', 'population.code', 'population.name', 'superpopulation.code', 'superpopulation.name', 'dataCollections.dataCollection'],
        column_names: ['Sample name', 'Sex', 'Biosample ID', 'Population code', 'Population name', 'Superpopulation code', 'Superpopulation name', 'Data collections'],
        query: { constant_score: { filter: { term:{ 'dataCollections.dataCollection': c.dc.title } } } }
      };
      gcaElasticsearch.searchExport({type: 'sample', format: 'tsv', filename: $routeParams.dc+'_samples', body: searchBody});
    };

    c.popHitsPerPage = 10;
    c.popPage = 1;
    c.popSearch = function() {
      c.popSearchBody = {
        from: (c.popPage -1)*c.popHitsPerPage,
        size: c.popHitsPerPage,
        query: { constant_score: { filter: { term:{ 'dataCollections.dataCollection': c.dc.title } } } }
      };
    }
    c.popExport = function() {
      var searchBody = {
        fields: ['name', 'sex', 'biosampleId', 'population.code', 'population.name', 'superpopulation.code', 'superpopulation.name', 'dataCollections.dataCollection'],
        column_names: ['Sample name', 'Sex', 'Biosample ID', 'Population code', 'Population name', 'Superpopulation code', 'Superpopulation name', 'Data collections'],
        query: { constant_score: { filter: { term:{ 'dataCollections.dataCollection': c.dc.title } } } }
      };
      gcaElasticsearch.searchExport({type: 'population', format: 'tsv', filename: $routeParams.dc+'_populations', body: searchBody});
    };

}]);

app.directive('searchComponent', ['$location', function($location) { return {
  scope: {},
  templateUrl: 'partials/search-component.html?ver=?20160810',
  controllerAs: 'SearchCtrl',
  link: function(scope, iElement, iAttr, controller) {
    scope.searchType = iAttr.searchComponent || 'sample';

    scope.examples = {
        sample: 'NA12878',
        population: 'GBR'
    };

    scope.search = function() {
      if (scope.inputText) {
          $location.path(scope.searchType.concat('/', scope.inputText));
      }
    };
  }
};}]);

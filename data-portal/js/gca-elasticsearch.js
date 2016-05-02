'use strict';

var module = angular.module('gcaElasticsearch', []);

module.provider('gcaElasticsearch', function() {
  var p = this;
  p.baseUrl = 'http://www.1000genomes.org/api';
  p.$get = ['$http', function($http) {
    var getDoc = function(options) {
      var url = p.baseUrl.concat('/', options.type, '/', options.id);
      return $http.get(url, {cache: true});
    };

    var search = function(options) {
      var url = p.baseUrl.concat('/', options.type, '/_search');
      return $http.post(url, options.body);
    };

    var searchExport = function(options) {
      var format = angular.isString(options.format) ? options.format : 'tsv';
      var filename = angular.isString(options.filename) ? options.filename : options.type;

      var url = p.baseUrl.concat('/', options.type, '/_search/', filename, '.', format);
      var form = document.createElement('form');
      form.action= url;
      form.method='POST';
      form.target="_self";
      var input = document.createElement("textarea");
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', 'json');
      input.value = JSON.stringify(options.body);
      form.appendChild(input);
      form.style.display = 'none';
      document.body.appendChild(form);
      form.submit();
    };

    return {
      getDoc: getDoc,
      search: search,
      searchExport: searchExport,
    };

  }];
});

module.directive('esDoc', function() {
  return {
    scope: {},
    bindToController: {
        bindSourceAs: '@esDoc',
        bindErrorAs: '@errorAs',
        esType: '@',
        esId: '=',
    },
    controllerAs: 'esDocCtrl',
    transclude: true,
    controller: ['gcaElasticsearch', function(gcaElasticsearch) {
        var c = this;
        c.destroy = function() {
            c.watcher();
            c.transcludedScope.$destroy();
        };
        c.esGet = function(esId) {
          if (angular.isString(c.bindSourceAs)) {c.transcludedScope[c.bindSourceAs] = null};
          if (angular.isString(c.bindErrorAs)) {c.transcludedScope[c.bindErrorAs] = null};
          if (angular.isString(esId) && angular.isString(c.esType)) {
              gcaElasticsearch.getDoc({type: c.esType, id: esId}).then(
                function(resp) {
                    if (angular.isString(c.bindSourceAs)) {c.transcludedScope[c.bindSourceAs] = resp.data._source;}
                },
                function(reason) {if (angular.isString(c.bindErrorAs)) {c.transcludedScope[c.bindErrorAs] = reason;}}
              );
          }
        };
    }],
    link: function(scope, iElement, iAttr, controller, $transclude) {
      $transclude(function(clone, transcludedScope) {
          iElement.append(clone);
          controller.transcludedScope = transcludedScope;
      });
      controller.watcher = scope.$watch('esDocCtrl.esId', controller.esGet);
      iElement.on('$destroy', controller.destroy);
    }
  };
});

module.directive('esSearch', function() {
  return {
    scope: {},
    bindToController: {
        searchBody: '=esSearch',
        bindErrorAs: '@errorAs',
        bindHitsAs: '@hitsAs',
        bindAggsAs: '@aggsAs',
        esType: '@',
    },
    controllerAs: 'esSearchCtrl',
    transclude: true,
    controller: ['gcaElasticsearch', function(gcaElasticsearch) {
      var c = this;
      var setHits = function(hits) {
          if (angular.isString(c.bindHitsAs)) {c.transcludedScope[c.bindHitsAs] = hits};
      };
      var setAggs = function(aggs) {
          if (angular.isString(c.bindAggsAs)) {c.transcludedScope[c.bindAggsAs] = aggs};
      };
      var setError = function(error) {
          if (angular.isString(c.bindErrorAs)) {c.transcludedScope[c.bindErrorAs] = error};
      };
      c.search = function() {
        if (!angular.isString(c.esType) || !angular.isObject(c.searchBody)) {
          setHits(null); setAggs(null); setError(null);
          return;
        }
        gcaElasticsearch.search({type: c.esType, body: c.searchBody}).then(
          function(resp) {
            setHits(resp.data.hits); setAggs(resp.data.aggs); setError(null);
          },
          function(reason) {
            setHits(null); setAggs(null); setError(reason);
          }
        );
      }

      c.destroy = function() {
        c.watcher();
      };
    }],
    link: function(scope, iElement, iAttr, controller, $transclude) {
      $transclude(function(clone, transcludedScope) {
          iElement.append(clone);
          controller.transcludedScope = transcludedScope;
      });
      controller.watcher = scope.$watch('esSearchCtrl.searchBody', controller.search);
      iElement.on('$destroy', controller.destroy);
    },
  }
});

'use strict';

var module = angular.module('gcaElasticsearch', []);

module.provider('gcaElasticsearch', function() {
  var p = this;
  p.baseUrl = '/api';
  p.cachedSearches = {};
  p.$get = ['$http', '$q', '$timeout', function($http, $q, $timeout) {
    var getDoc = function(options) {
      var url = p.baseUrl.concat('/', options.type, '/', options.id);
      var httpTimeout = $q.defer();
      var promise = $http.get(url, {cache: true, timeout: httpTimeout.promise});
      promise._httpTimeout = httpTimeout;
      return promise;
    };

    var search = function(options) {
      var url = p.baseUrl.concat('/', options.type, '/_search');
      var httpTimeout = $q.defer();
      var promise = $http.post(url, options.body, {timeout: httpTimeout.promise});
      promise._httpTimeout = httpTimeout;
      return promise;
    };

    var cancel = function(promise) {
        if (promise && promise._httpTimeout && promise._httpTimeout.resolve) {
            promise._httpTimeout.resolve();
        }
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

    var cachedSearchResps = {};
    var cachedSearch = function(searchName) {
      if (cachedSearchResps.hasOwnProperty(searchName)) {
        return cachedSearchResps[searchName].result;
      }
      if (! p.cachedSearches.hasOwnProperty(searchName)) {
        return;
      }
      var r = {result: {isLoading: false}};
      cachedSearchResps[searchName] = r
      r.timer = $timeout(function() {r.result.isLoading = true}, 1000);
      search(p.cachedSearches[searchName]).then(
        function(resp) {
          $timeout.cancel(r.timer);
          r.result.isLoading = false;
          r.result.hits = resp.data.hits;
          r.result.aggs = resp.data.aggs;
          r.result.error = null;
        },
        function(reason) {
          r.result.isLoading = false;
          r.result.hits = null;
          r.result.aggs = null;
          r.result.error = reason;
        }
      );
      return r.result;
    };

    return {
      getDoc: getDoc,
      search: search,
      searchExport: searchExport,
      cancel: cancel,
      cachedSearch: cachedSearch,
    };

  }];
});

module.directive('esDoc', function() {
  return {
    scope: {},
    bindToController: {
        source: '=esDoc',
        error: '=errorAs',
        esType: '@',
        esId: '=',
        isLoading: '=isLoadingAs'
    },
    controllerAs: 'esDocCtrl',
    controller: ['gcaElasticsearch', '$timeout', function(gcaElasticsearch, $timeout) {
        var c = this;
        c.isLoading = false;
        c.esGet = function(esId) {
          c.source = null;
          c.error = null;
          $timeout.cancel(c.timer);
          gcaElasticsearch.cancel(c.currentPromise);
          if (angular.isString(esId) && angular.isString(c.esType)) {
              c.timer = $timeout(function() {c.isLoading = true}, 1000);
              c.currentPromise = gcaElasticsearch.getDoc({type: c.esType, id: esId}).then(
                function(resp) {
                    $timeout.cancel(c.timer);
                    c.isLoading = false;
                    c.source = resp.data._source;
                },
                function(reason) {
                    $timeout.cancel(c.timer);
                    c.isLoading = false;
                    c.error = reason;
                }
              );
          }
        };

        c.destroy = function() {
            gcaElasticsearch.cancel(c.currentPromise);
            $timeout.cancel(c.timer);
        };
    }],
    link: function(scope, iElement, iAttr, controller, $transclude) {
      var watcher = scope.$watch('esDocCtrl.esId', controller.esGet);
      scope.$on('$destroy', function() {watcher(); controller.destroy();});
    }
  };
});

module.directive('esSearch', function() {
  return {
    scope: {},
    bindToController: {
        searchBody: '=esSearch',
        error: '=errorAs',
        hits: '=hitsAs',
        aggs: '=aggsAs',
        isLoading: '=isLoadingAs',
        esType: '@',
    },
    controllerAs: 'esSearchCtrl',
    controller: ['gcaElasticsearch', '$timeout', function(gcaElasticsearch, $timeout) {
      var c = this;
      c.isLoading = false;
      c.search = function() {
        $timeout.cancel(c.timer);
        gcaElasticsearch.cancel(c.currentPromise);
        if (!angular.isString(c.esType) || !angular.isObject(c.searchBody)) {
          c.hits = null;
          c.aggs = null;
          c.error = null;
          return;
        }
        c.timer = $timeout(function() {c.isLoading = true}, 1000);
        c.currentPromise = gcaElasticsearch.search({type: c.esType, body: c.searchBody}).then(
          function(resp) {
            $timeout.cancel(c.timer);
            c.isLoading = false;
            c.hits = resp.data.hits;
            c.aggs = resp.data.aggs;
            c.error = null;
          },
          function(reason) {
            $timeout.cancel(c.timer);
            c.isLoading = false;
            c.hits = null;
            c.aggs = null;
            c.error = reason;
          }
        );
      };

      c.destroy = function() {
        gcaElasticsearch.cancel(c.currentPromise);
        $timeout.cancel(c.timer);
      };

    }],
    link: function(scope, iElement, iAttr, controller, $transclude) {
      var watcher = scope.$watch('esSearchCtrl.searchBody', controller.search);
      scope.$on('$destroy', function() {watcher(); controller.destroy();});
    },
  }
});

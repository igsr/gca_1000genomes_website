'use strict';

var module = angular.module('gcaElasticsearch', []);

var config = {
    baseUrl: 'http://www.1000genomes.org/api',
};

module.factory('gcaElasticsearch', ['$http', function($http) {
  var getDoc = function(options) {
      var url = config.baseUrl.concat('/', options.type, '/', options.id);
      return $http.get(url, {cache: true});
  };
  var getDocSrc = function(options) {
      return getDoc(options).then(function(resp) {return resp.data._source});
  }

  return {
    config: config,
    getDoc: getDoc,
    getDocSrc: getDocSrc,
  };
}]);

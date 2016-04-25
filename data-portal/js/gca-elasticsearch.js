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
    var getDocSrc = function(options) {
      return getDoc(options).then(function(resp) {return resp.data._source});
    }
    return {
      getDoc: getDoc,
      getDocSrc: getDocSrc,
    };

  }];
});

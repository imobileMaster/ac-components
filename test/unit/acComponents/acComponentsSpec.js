'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('acComponents');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('acComponents.config')).to.be.ok;
  });

  
  it('should load filters module', function() {
    expect(hasModule('acComponents.filters')).to.be.ok;
  });
  

  
  it('should load directives module', function() {
    expect(hasModule('acComponents.directives')).to.be.ok;
  });
  

  
  it('should load services module', function() {
    expect(hasModule('acComponents.services')).to.be.ok;
  });
  

});
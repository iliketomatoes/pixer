'use strict';

var doc = window.document;

describe('Pixer', function() {

  // We need these before-and-after stuff to load the html
  before(function() {
      fixture.setBase('test/templates');
  });

  beforeEach(function(){
    this.result = fixture.load('core.html');
  });

  afterEach(function(){
    fixture.cleanup()
  });
  
});

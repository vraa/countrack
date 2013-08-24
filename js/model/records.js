define([
    'jquery'
  , 'underscore'
  , 'backbone'
  , 'model/record'
], function(
  $
  , _
  , Backbone
  , Record
){

  var Records = Backbone.Collection.extend({
    model : Record
  });

  return Records;
});
define([
    'jquery'
  , 'underscore'
  , 'backbone'
  , 'model/activity'
], function(
  $
  , _
  , Backbone
  , Activity
){

  var Activities = Backbone.Collection.extend({
    model : Activity
  });

  return Activities;

});
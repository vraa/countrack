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
    model : Activity,

    comparator : function(actOne, actTwo){
      var d1 = actOne.get('updated').getTime(), 
          d2 = actTwo.get('updated').getTime();
      return d1 > d2 ? 1 : -1;
    }

  });

  return Activities;

});
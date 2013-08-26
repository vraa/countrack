define([
    'jquery'
  , 'underscore'
  , 'backbone'
], function(
  $
  , _
  , Backbone
){

  var Record = Backbone.Model.extend({
    defaults : {
      count : 1,
    },

    initialize : function(){
      this.set('date', _.dateOrToday(this.get('date')));
    }
  });

  return Record;

});
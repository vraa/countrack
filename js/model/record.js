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
      this.set('date', new Date(this.get('date')) || new Date());
    }
  });

  return Record;

});
define([
    'jquery'
  , 'underscore'
  , 'backbone'
  , 'model/activities'
  , 'text!template/day-graph.html'
], function(
  $
  , _
  , Backbone
  , Activities
  , DayGraphTemplate
){

  var DaySummary = Backbone.View.extend({
    className : 'glance',
    collection : Activities,
    template : _.template(DayGraphTemplate),

    initialize : function(){
      this.collection.on('change', this.render, this);
    },

    render : function(){
      this.$el.html(this.template({
        plotPoints : this.collection.plotPointsForToday()
      }));
      return this;
    },

  });

  return DaySummary;
});
define([
    'jquery'
  , 'underscore'
  , 'backbone'
  , 'model/activity'
  , 'model/records'
], function(
  $
  , _
  , Backbone
  , Activity
  , Records
){

  var Activities = Backbone.Collection.extend({
    model : Activity,

    comparator : function(actOne, actTwo){
      var d1 = actOne.get('updated').getTime(), 
          d2 = actTwo.get('updated').getTime();
      return d1 > d2 ? 1 : -1;
    },

    plotPointsForToday : function(){

      var todaysRecords = new Records();
      var today = _.stripTime(new Date());

      this.each(function(activity){
        var records = activity.get('records');
        var nature = activity.get('nature');
        var name = activity.get('name');
        var filtered = records.filter(function(record){
          return (_.stripTime(record.get('date')) === today);
        });
        _.each(filtered, function(record){
          console.log(record.get('count'));
          record.set({
            name : name,
            nature : nature,
            cssClass : _.calculateCellWeight(record.get('count'))
          }, {silent : true});
        });
        todaysRecords.add(filtered);
      });
      
      todaysRecords = todaysRecords.sortBy(function(record){
        return -(record.get('date').getTime());
      });

      return (JSON.parse(JSON.stringify(todaysRecords)));
    }

  });

  return Activities;

});
define([
    'jquery'
  , 'underscore'
  , 'backbone'
  , 'model/records'
  , 'constants'
], function(
    $
  , _
  , Backbone
  , Records
  , CONST
){

  var Activity = Backbone.Model.extend({

    defaults : {
      'name' : 'Activity name',
      'nature' : 'good'
    },

    initialize : function(){
      this.set({
        'id' : this.id || CONST.KEY_PREFIX + _.guid(),
        'records' : new Records(),
        'created' : _.dateOrToday(this.get('created')),
        'updated' : _.dateOrToday(this.get('updated'))
      });
      this.on('change', this.persist, this);
      this.on('unpersist', this.unpersist, this);
      this.on('add:records', this.persist, this);
    },

    persist : function(){
      window.localStorage.setItem(this.id, JSON.stringify(this));
    }, 

    unpersist : function(){
      window.localStorage.removeItem(this.id);
    },

    getCount : function(){
      return this.get('records').reduce(function(memo, record){
        return memo + record.get('count');
      }, 0);
    },

    getDayCount : function(){
      return this.get('records').filter(function(record){
        var d1 = parseInt(_.stripTime(record.get('date')).replace(/-/g, ''), 10);
        var d2 = parseInt(_.stripTime(new Date()).replace(/-/g, ''), 10);
        return d1 === d2;
      }).reduce(function(memo, record){
        return memo + record.get('count');
      }, 0);
    },

    toTemplateJSON : function(){
      var json = this.toJSON();
      json.count = this.getCount();
      json.dayCount = this.getDayCount();
      return json;
    },

    plotPoints : function(){
      var records = this.get('records');
      var startDate  = new Date();

      var mapped = records.map(function(record){
        var date = new Date(Date.parse(record.get('date')));
        return {
          date : _.stripTime(date),
          count : record.get('count')
        }
      });
      var reduced = _.reduce(mapped, function(memo, record){
        if(!memo[record.date]) memo[record.date] = 0;
        memo[record.date] = memo[record.date] + record.count;
        return memo;
      }, {});

      var plotPoints = [];
      for(var idx =  0 ; idx < CONST.MONTH ; idx += 1){
        var pointDate = _.stripTime(_.subtractDays(startDate, idx));
        plotPoints.push( {
          date : pointDate,
          count : reduced[pointDate] || 0,
          cssClass : _.calculateCellWeight(reduced[pointDate] || 0)
        } );
      }      
      return plotPoints;
    }

  });

  return Activity;

});
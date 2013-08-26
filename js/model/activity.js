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
      var endDate  = new Date();
      var startDate = _.subtractDays(endDate, CONST.MONTH);

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
      for(var idx =  1 ; idx <= CONST.MONTH ; idx += 1){
        var pointDate = _.stripTime(_.addDays(startDate, idx));
        plotPoints.push( {
          date : pointDate,
          count : reduced[pointDate] || 0,
          cssClass : this.determinePlotPointClass(reduced[pointDate] || 0)
        } );
      }      
      return plotPoints;
    },

    determinePlotPointClass : function(count){
      var pointClass = 'empty';
      if(count == 1){
        pointClass = 'low';
      }else if (count == 2 || count == 3){ 
        pointClass = 'medium';
      }else if (count >= 4 && count <= 6){
        pointClass = 'high';
      }else if(count >= 7){
        pointClass = 'insane';
      }
      return pointClass;
    }

  });

  return Activity;

});
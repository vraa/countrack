/* Require.js Configuration */
require.config({
  /* create path aliases. */
  paths : {
      'jquery' : 'lib/jquery-2.0.3.min'
    , 'backbone' : 'lib/backbone-min'
    , 'underscore' : 'lib/underscore-min'
  }, 

  /* legacy JS loading */
  shim : {
    'underscore' : {
      exports : '_'
    },
    'backbone' : {
      deps: ['underscore', 'jquery'],
      exports : 'Backbone'
    }
  }
});

/* Mixin util method to _ that generate GUID */

require(['underscore'], function(_){
  _.mixin({

    guid : function(){
      var guidPattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      return guidPattern.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      }); 
    },

    addDays : function(date, days){
      return new Date(date.getFullYear() , date.getMonth(), date.getDate() + days); 
    },

    subtractDays : function(date, days){
      return new Date(date.getFullYear() , date.getMonth(), date.getDate() - days);
    },

    stripTime : function(date){
      return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    }

  });
});


/* Start the Application */
require(['view/application'], function(ApplicationView){
  var countrack = window.countrack || new ApplicationView();
});

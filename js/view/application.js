define([
    'underscore'
  , 'jquery'
  , 'backbone'
  , 'model/activities'
  , 'model/activity'
  , 'model/record'
  , 'view/activity'
  , 'text!template/intro.html'
  , 'model/sample'
  , 'constants'
], function(
    _
  , $
  , Backbone
  , Activities
  , Activity
  , Record
  , ActivityView
  , IntroTemplate
  , SampleActivities
  , CONST
){

  var ApplicationView = Backbone.View.extend({

    el : '.app',

    activities : new Activities(),

    events : {
      'keydown [name="activityName"]' : 'saveOnEnter',
      'click #addActivity, #introAddActivity' : 'showActivityForm',
      'click #saveActivity' : 'saveActivityForm',
      'click #cancelActivity' : 'hideActivityForm',
      'click #loadSample' : 'loadSample'
    },

    initialize : function(){
      this.$io = this.$el.find('.io'); 
      this.$activityList = this.$el.find('.activity-list');
      this.$info = this.$el.find('.info');

      this.listenTo(this.activities, 'add', this.addOneActivity);
      this.listenTo(this.activities, 'unpersist', this.removeActivity);
      
      this.$info.html('Loading ...');
      this.loadActivities();
      this.addAllActivity();
      this.$info.html('');
      
      if(this.activities.length === 0){
        this.$activityList.html(IntroTemplate);
      }

    },


    // this method writes sample activities to local storage.
    writeSampleDate : function(){
      _.each(SampleActivities, function(sample){
        var activity = new Activity({
          name : sample.name,
          nature : sample.nature
        });
        for(var j=1; j <=20; j++){
          var record = new Record();
          record.set('date', _.subtractDays(new Date(), _.random(1,25)));
          record.set('count', _.random(0,10));
          activity.get('records').add(record);
        }
        localStorage.setItem(activity.id, JSON.stringify(activity));
      }, this);
    },

    /* this method loads the activity data from localstorage. 
      If local storage is empty, then it returns an empty Activitis collection.
    */
    loadActivities : function(){
      this.activities.reset();
      for(key in localStorage){
        if(key.indexOf(CONST.KEY_PREFIX) === 0){
          var obj = JSON.parse(localStorage.getItem(key));
          var activity = new Activity(obj);
          _.each(obj.records, function(record){
            activity.get('records').add(new Record(record), {silent : true});
          });
          this.activities.add(activity, {silent : true});
        }
      }
    },

    // this method fills the app with sample activities.
    loadSample : function(){
      this.$activityList.empty();
      this.writeSampleDate();
      this.initialize();
    },

    removeActivity : function(activity){
      this.activities.remove(activity);
    }, 

    addOneActivity : function(activity){
      var view = new ActivityView({model : activity});
      this.$activityList.prepend(view.render().$el);
    },

    addAllActivity : function(){
      this.activities.each(this.addOneActivity, this);
    },

    //  this method listens to activity name textbox and saves the activity
    //  when 'Enter' ley is pressed.
    saveOnEnter : function(evt){
      if(evt.which === 13){
        evt.preventDefault();
        this.saveActivityForm();
        return false;
      }
    },

     // this method replaces the add activity button with the form.
    showActivityForm : function(){
      if(this.activities.length === 0){
        this.$activityList.html('');
      }
      this.$io.removeClass('action-mode').addClass('form-mode').find('[type="text"]').focus();
    },

    /* this method saves the form data to model/storage. */
    saveActivityForm : function(){
      var name = this.$io.find('[name="activityName"]').val();
      if($.trim(name) !== ''){
        var nature = this.$io.find('[name="nature"]').is(':checked') ? CONST.GOOD : CONST.BAD;
        this.$io.find('[name="activityName"]').val('');
        var activity = new Activity({
          name : name,
          nature : nature
        });
        this.activities.add(activity);
        activity.persist();
      }
      this.hideActivityForm();
    },

    /* this method toggles to action mode.*/
    hideActivityForm : function(){
      if(this.activities.length === 0){
        this.$activityList.html(IntroTemplate);
      }
      this.$io.removeClass('form-mode').addClass('action-mode');
    }

  });

  return ApplicationView;

});
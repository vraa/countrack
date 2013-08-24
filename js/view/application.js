define([
    'underscore'
  , 'jquery'
  , 'backbone'
  , 'model/activities'
  , 'model/activity'
  , 'model/record'
  , 'view/Activity'
  , 'constants'
], function(
    _
  , $
  , Backbone
  , Activities
  , Activity
  , Record
  , ActivityView
  , CONST
){

  var ApplicationView = Backbone.View.extend({

    el : '.app',

    activities : new Activities(),

    events : {
      'click #addActivity' : 'showActivityForm',
      'click #saveActivity' : 'saveActivityForm',
      'click #cancelActivity' : 'hideActivityForm'
    },

    initialize : function(){
      this.$io = this.$el.find('.io'); 
      this.$activityList = this.$el.find('.activity-list');

      this.listenTo(this.activities, 'add', this.addOneActivity);
      this.listenTo(this.activities, 'unpersist', this.removeActivity);
      // this.writeTestDate();
      this.loadActivities();
    },


    writeTestDate : function(){
      for(var i=1; i<=5; i+=1){
        var activity = new Activity();
        activity.get('records').add(new Record()).add(new Record());
        localStorage.setItem(activity.id, JSON.stringify(activity));
      }
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
            activity.get('records').add(new Record(record));
          });
          this.activities.add(activity);
        }
      }
    },

    removeActivity : function(activity){
      this.activities.remove(activity);
    }, 

    addOneActivity : function(activity){
      var view = new ActivityView({model : activity});
      this.$activityList.append(view.render().$el);
    },

    addAllActivity : function(){

    },

    /* this method replaces the add activity button with the form.*/
    showActivityForm : function(){
      this.$io.removeClass('action-mode').addClass('form-mode').find('[type="text"]').focus();
    },

    /* this method saves the form data to model/storage. */
    saveActivityForm : function(){
      var name = this.$io.find('[name="activityName"]').val();
      if($.trim(name) !== ''){
        this.$io.find('[name="activityName"]').val('');
        var activity = new Activity({
          name : name
        });
        this.activities.add(activity);
        activity.persist();
      }
      this.hideActivityForm();
    },

    /* this method toggles to action mode.*/
    hideActivityForm : function(){
      this.$io.removeClass('form-mode').addClass('action-mode');
    }

  });

  return ApplicationView;

});
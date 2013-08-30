define([
    'underscore'
  , 'jquery'
  , 'backbone'
  , 'model/activities'
  , 'model/activity'
  , 'model/record'
  , 'view/activity'
  , 'view/day-summary'
  , 'text!template/intro.html'
  , 'text!template/menu.html'
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
  , DaySummaryView
  , IntroTemplate
  , MenuTemplate
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
      'click #loadSample' : 'loadSample',
      'click .icons' : 'selectIcon',
      'click .menu-icon' : 'showMenu',
      'click #cancelMenu' : 'cancelMenu',
      'click .mask' : 'cancelMenu',
      'click #export' : 'exportData',
      'click #import' : 'importData'
    },

    initialize : function(){

      this.$io = this.$el.find('.io'); 
      this.$activityList = this.$el.find('.activity-list');
      this.$info = this.$el.find('.info');
      this.$daySummary = this.$el.find('.day-summary');

      this.listenTo(this.activities, 'add', this.addOneActivity);
      this.listenTo(this.activities, 'unpersist', this.removeActivity);
      
      this.render();
    },

    render : function(){
      this.$info.html('Loading ...');
      this.loadActivities();
      this.addAllActivity();
      this.$info.html('');

      this.$daySummary.html(new DaySummaryView({
        collection : this.activities
      }).render().$el);
      
      if(this.activities.length === 0){
        this.$activityList.html(IntroTemplate);
      }
    },


    // this method writes sample activities to local storage.
    writeSampleDate : function(){
      _.each(SampleActivities, function(sample){
        var activity = new Activity(sample);
        for(var j=1; j <=10; j++){
          var record = new Record();
          record.set('date', _.subtractDays(new Date(), _.random(1,20)));
          record.set('count', _.random(0,10));
          activity.get('records').add(record);
        }
        localStorage.setItem(activity.id, JSON.stringify(activity));
      }, this);
    },

    // this method loads the activity data from localstorage. 
    // If local storage is empty, then it returns an empty Activitis collection.
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
      this.render();
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

     // this method saves the form data to model/storage. 
    saveActivityForm : function(){
      var name = this.$io.find('[name="activityName"]').val();
      if($.trim(name) !== ''){
        var nature = this.$io.find('[name="nature"]').is(':checked') ? CONST.GOOD : CONST.BAD;
        var icon = _.stripIconName(this.$io.find('.icons .selected').attr('class'));
        var activity = new Activity({
          name : name,
          nature : nature,
          icon : icon
        });
        this.activities.add(activity);
        activity.persist();
      }
      this.hideActivityForm();
    },

    // this method resets the activity form to their initial value.
    resetActivityForm : function(){
      this.$io.find('[name="activityName"]').val('');
      this.$io.find('[name="nature"]').prop('checked', true);
      this.$io.find('[class*="icon-"].selected').removeClass('selected');
    },

     // this method toggles to action mode.
    hideActivityForm : function(){
      if(this.activities.length === 0){
        this.$activityList.html(IntroTemplate);
      }
      this.$io.removeClass('form-mode').addClass('action-mode');
      this.resetActivityForm();
    },

    // select an icon.
    selectIcon : function(evt){
      var iconElem = $(evt.target);
      if(iconElem.prop('tagName') === 'I'){
        this.$io.find('[class*="icon-"].selected').removeClass('selected');
        iconElem.addClass('selected');
      }
    },

    // display menu
    showMenu : function(){
      this.$el.append(MenuTemplate);
      this.$el.find('.menu').css({
        'height' : this.$el.css('height')
      });
    },

    // close menu
    cancelMenu : function(evt){
      evt.stopImmediatePropagation();
      this.$el.find('.menu').remove();
    },

    // encodes entire data to base64 and creates a URI component so that it
    // can be saved as a file.
    exportData : function(){
      if(this.activities.length === 0){
        alert('You have not created any activities to export.');
        return;
      }
      var uriContent = "data:text/plain;base64," + btoa(JSON.stringify(this.activities));
      window.open(uriContent, 'Save your Data');
    },

    // imports a data from a base64 encoded string and creates activities 
    // from that.
    importData : function(){
      alert('This function will be build in the upcoming releases.');
    }

  });

  return ApplicationView;

});
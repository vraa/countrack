define([
    'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!template/activity.html'
  , 'text!template/graph.html'
  , 'model/record'
], function(
  $
  , _
  , Backbone
  , ActivityTemplate
  , GraphTemplate
  , Record
){

  var ActivityView = Backbone.View.extend({

    tagName : 'article',
    className : 'activity container',
    template : _.template(ActivityTemplate),
    graphTemplate : _.template(GraphTemplate),

    events : {
      'click' : 'expandActivity',
      'click .increment' : 'increment',
      'click .delete' : 'delete',
      'click .edit' : 'edit'
    },

    initialize : function(){
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'unpersist', this.remove);
    },

    render : function(){
      this.$el.html(this.template(this.model.toTemplateJSON()));
      this.$el.attr('id', this.model.id);
      this.$el.find('.graph-wrapper').html(this.graphTemplate({plotPoints : this.model.plotPoints()}));
      return this;
    },

    expandActivity : function(){
      this.$el.toggleClass('expanded');
    },

    increment : function(evt){
      evt.stopImmediatePropagation();
      var record = new Record();
      this.model.get('records').add(record);
      this.model.trigger('change');
    },

    delete : function(){
      this.model.trigger('unpersist', this.model);
    }

  });

  return ActivityView;

});
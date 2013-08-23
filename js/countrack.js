;(function($){

  var Countrack = (function(){

    var itemList = [];
    var PREFIX = "ct-", 
        MONTH = 30,
        WEEK = 7;

    function guid(){
      var guidPattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      return guidPattern.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }

    function Activity(){
      this.date = new Date();
      this.count = 1;
    }

    function Item(itemName){
      this.id = PREFIX + guid();
      this.name = $.trim(itemName) === "" ? "Name" : itemName;
      this.count = 0;
      this.activity = [];
      this.timestamp = new Date();
    }

    function init(){
      readItems();
      renderItems();
      bindEvents();
    }

    function writeItem(item){
      localStorage.setItem(item.id, JSON.stringify(item));
    }

    function readItems(){
      itemList.length = 0;
      _.each(_.keys(localStorage), function(key){
        if(key.indexOf(PREFIX) === 0){
          itemList.push(JSON.parse(localStorage.getItem(key)));
        }
      });
    }

    function renderItems(){
      var template = $('#itemListTemplate').html();
      $('.item-list').html(_.template(template, {items : itemList}));
    }

    function bindEvents(){
      $('#add').click(addItem);
      $('#help').click(showHelp);
      $('.app').on('click', '#save', saveItem);
      $('.app').on('click', '.plusOne', plusOne);
      $('.app').on('click', '.more', showMore);
    };

    function addItem(){
      var formTemplate = $('#itemForm').html();
      $('.io').html(formTemplate).show();
      $('.io').find('[type="text"]').focus();
    }

    function saveItem(){
      var itemName = $('[name="item-name"]').val();
      if(! ($.trim(itemName) === '') ){
        var item = new Item(itemName);
        itemList.push(item);
        writeItem(item);
        renderItems();
      }
      $('.io').empty().hide();
    }

    function findItem(id){
      return _.find(itemList, function(item){
        return item.id === id;
      });
    }

    function plusOne(evt){
      var itemElm = $(evt.target).closest('article');
      var item = findItem(itemElm.attr('id'));
      item.count = item.count + 1;
      item.activity.push(new Activity());
      localStorage.setItem(item.id, JSON.stringify(item));
      renderItems();
    }

    function showMore(evt){

      var itemElm = $(evt.target).closest('article');
      var item = findItem(itemElm.attr('id'));
      if(itemElm.find('.graph').length){
        itemElm.find('.graph').remove();
      }else{
        var moreTemplate = $('#moreGraphTemplate').html();
        var plotPoints = _buildPlotPoints(item.activity);
        itemElm.append(_.template(moreTemplate, {plotPoints : plotPoints}));
      }
    }

    function showHelp(){
      // TODO
    }

    function _findPreviousDate(date, days){
      return new Date(date.getFullYear() , date.getMonth(), date.getDate() - days);
    }

    function _findNextDate(date, days){
      return new Date(date.getFullYear() , date.getMonth(), date.getDate() + days); 
    }

    function _stripTime(date){
      return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    }

    function _buildPlotPoints(activities){

      var endDate  = new Date();
      var startDate = _findPreviousDate(endDate, MONTH);

      var mapped = _.map(activities, function(activity){
        var actDate = new Date(Date.parse(activity.date));
        return {
          date : _stripTime(actDate),
          count : activity.count
        }
      });

      var reduced = _.reduce(mapped, function(memo, activity){
        if(!memo[activity.date]) memo[activity.date] = 0;
        memo[activity.date] = memo[activity.date] + activity.count;
        return memo;
      }, {});

      var plotPoints = [];
      for(var idx =  1 ; idx <= MONTH ; idx += 1){
        var pointDate = _stripTime(_findNextDate(startDate, idx));
        plotPoints.push( {
          date : pointDate,
          count : reduced[pointDate] || 0,
          cssClass : _determinePlotPointClass(reduced[pointDate] || 0)
        } );
      }      
      return plotPoints;

    }

    function _determinePlotPointClass(count){
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

    return {
      init : init
    }

  }());

  $(Countrack.init);

}(jQuery));
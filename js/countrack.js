;(function($){

  var Countrack = (function(){

    var itemList = [];
    var PREFIX = "ct-";

    function guid(){
      var guidPattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      return guidPattern.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }

    function Activity(){
      this.date = new Date();
      this.count = 0;
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
    };

    function addItem(){
      var formTemplate = $('#itemForm').html();
      $('.io').html(formTemplate).show();
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
      localStorage.setItem(item.id, JSON.stringify(item));
      renderItems();
    }

    function showHelp(){
      // TODO
    }

    return {
      init : init
    }

  }());

  $(Countrack.init);

}(jQuery));
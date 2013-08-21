;(function($){

  var Countrack = (function(){

    function Activity(){
      this.date = new Date();
      this.count = 0;
    }

    function Item(){
      this.name = "Name";
      this.count = 0;
      this.activity = [];
    }

    function init(){
      bindEvents();
    };

    function bindEvents(){
      $('#add').click(addItem);
      $('#help').click(showHelp);
      $('.app').on('click', '#save', saveItem);
    };

    function addItem(){
      var formTemplate = $('#itemForm').html();
      $('.io').html(formTemplate).show();
    }

    function saveItem(){
      $('.io').empty().hide();
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
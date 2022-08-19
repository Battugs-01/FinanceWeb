// Дэлгэцийн controller
var uiController = (function(){
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn"
    }
    // Орлого зарлага , Ямар зориулалттай , Хэдэн төгрөг орж ирсэнийг DOM оос олж return ашиглаж App controller луу явуулж байна 
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
        };
    },
    getDOMstrings : function(){
        return DOMstrings;
        },

    addListItem : function(item , type){
        // 1Рт : Орлого зарлагын element ийг агуулсан Html ийг бэлтгэнэ
        var html , list;
        if(type==='inc'){
            list = ".income__list"
            html='<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else {
            list = ".expenses__list"
           html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        // 2рт : Тэр html дотроо орлого зарлагын утгуудыг Replace ашиглан өөрчилнө
           html =  html.replace('%id' , item.id);
           html = html.replace('%DESCRIPTION%' , item.description);
           html = html.replace('%VALUE%' , item.value);
        // 3рт ;: Бэлтэгсэн HTMl ээ Dom руу хийж өгнө

        document.querySelector(list).insertAdjacentHTML('beforeend',html);
    } 
};
})();

// Санхүүгийн хэсгийг хариуцах controller
var financeController = (function(){
   // private data
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // private data
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // private data
  var data = {
    items: {
      inc: [],
      exp: []
    },

    totals: {
      inc: 0,
      exp: 0
    }
  };
  return {
    addItem: function(type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },

    seeData: function() {
      return data;
    }
  };  
})();

// Санхүүгийн болон дэлгэцийн controller Ийг хооронд нь зангидах controller
var appController = (function(uiCtrl , fnCtrl){

    // EventListener ажиллах үед ажиллах дараагийн үйлдлүүдийг хариуцсан функц 
    var ctrlAddItem = function(){
                // 1рт : Оруулах өгөгдлийг дэлгэцээс олж авна
                var input = uiCtrl.getInput();
                console.log(input);
                // 2рт : Олж авсан өгөгдлүүдээ санхүүгийн controllert дамжуулж тэнд хаднална
               var item =  fnCtrl.addItem(input.type , input.description , input.value);
            
                // 3рт : Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана
                uiCtrl.addListItem(item , input.type);
                // 4рт : Төсвийг тооцоолно 
        
                // 5рт : Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана
};

 var setupEventListener = function(){

// UIcontroller т байгаа getDOMstrings обвектийг DOM гэх хувьсагчид авж ашиглаж байгаа
    var DOM = uiCtrl.getDOMstrings();

      // Зөв товчийг дархад ажиллах eventlistener
      document.querySelector(DOM.addBtn).addEventListener('click',function(){
        ctrlAddItem();
    });

    // Enter дархад ажиллах eventListener
    document.addEventListener('keypress' , function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
 };

return {
    init : function(){
        console.log('Applicition starter>>!');
        setupEventListener();
    }
}

})(uiController , financeController);

appController.init();
// Дэлгэцийн controller
var uiController = (function(){
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList : ".income__list",
        expList : ".expenses__list",
        budgetlevel : ".budget__value",
        incomeLabel : ".budget__income--value",
        expenseLabel : ".budget__expenses--value",
        percentageLabel : ".budget__expenses--percentage"
}
    // Орлого зарлага , Ямар зориулалттай , Хэдэн төгрөг орж ирсэнийг DOM оос олж return ашиглаж App controller луу явуулж байна 
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseInt(document.querySelector(DOMstrings.inputValue).value)
        };
    },
    getDOMstrings : function(){
        return DOMstrings;
        },

    // Desctiption болон value хэсгийг цэвэрлэх 
    clearFields : function() {
        var fields = document.querySelectorAll(DOMstrings.inputDescription + " , " + DOMstrings.inputValue);

        // Convert list to array 
        var fieldsArr = Array.prototype.slice.call(fields);

        // ForEach давталт ашиглах 
        fieldsArr.forEach(function(el, index , array){
            el.value = "";
        });
        // for (var i = 0 ; i<fieldsArr.length ; i++){
        //     fieldsArr[i].value = "";
        // }

        // Cursor шууд description хэсэг рүү шилжих
        fieldsArr[0].focus();
    },

    // Төсвийг дэлгэцэнд үзүүлэх 
    budgetWatch : function(budget){
        document.querySelector(DOMstrings.budgetlevel).textContent = budget.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = budget.totalInc;
        document.querySelector(DOMstrings.expenseLabel).textContent = budget.totalexp;

        if(budget.percent!==0){
            document.querySelector(DOMstrings.percentageLabel).textContent = budget.percent + '%';
        }else{
            document.querySelector(DOMstrings.percentageLabel).textContent = budget.percent;
        }

    },

        // Орлого зарлагийн html ийг дэлгэцэнд харуулах publicservice
    addListItem : function(item , type){
        // 1Рт : Орлого зарлагын element ийг агуулсан Html ийг бэлтгэнэ
        var html , list;
        if(type==='inc'){
            list = DOMstrings.incomeList;
            html='<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else {
            list = DOMstrings.expList;
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

  var calculateTotal = function(type){
    var sum = 0;
    data.items[type].forEach(function(el){
        sum = sum + el.value;
    });

    data.totals[type] = sum;
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
    },
    budget : 0,
    percent : 0
    
  };
  return {

    // Санхүүгийн тооцоолол хийнэ
    financeCalculate : function(){

        // Нийт орлогын нийлбэрийг тооцоолно
        calculateTotal('inc');

        // Нийт зарлагын нийлбэрийг тооцоолно
        calculateTotal('exp');

        // Төсвийг шинээр тооцоолно
        data.budget = data.totals.inc - data.totals.exp;

        // Орлого зарлагын хувийг тооцоолно
        data.percent = Math.round((data.totals.exp / data.totals.inc)*100); 
    },

    budgeGet : function(){
        return { 
            budget : data.budget,
            percent : data.percent,
            totalInc : data.totals.inc,
            totalexp : data.totals.exp
        }
    },

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
                
                if(input.description !== "" && input.value !== ""){ 
                    // 2рт : Олж авсан өгөгдлүүдээ санхүүгийн controllert дамжуулж тэнд хаднална
                   var item =  fnCtrl.addItem(input.type , input.description , input.value);
                
                    // 3рт : Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана
                    uiCtrl.addListItem(item , input.type);
                    uiCtrl.clearFields();
                    // 4рт : Төсвийг тооцоолно 
                    fnCtrl.financeCalculate();
                    // 5рт : Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана
                    var budget = fnCtrl.budgeGet();

                    // 6 : Төсвийн тооцоог дэлгэцэнд гаргана

                    uiCtrl.budgetWatch(budget);

                }
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
        uiCtrl.budgetWatch({
            budget : 0,
            percent : 0,
            totalInc : 0,
            totalexp : 0
        });
        setupEventListener();
    }
}

})(uiController , financeController);

appController.init();
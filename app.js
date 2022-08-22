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
        percentageLabel : ".budget__expenses--percentage",
        containerDiv : ".container",
        expensePercentageLabel : ".item__percentage",
        dateLabel : ".budget__title--month"
};

var formatMoney = function(too , type){
            
        too = '' + too;

        var x = too.split("").reverse().join("");
       

        var y = "";
        var count = 1;

        for(var i = 0 ; i < x.length ; i++){
        y = y +x[i];

        if(count%3 === 0 ) {

            y = y + ",";
        }
        count++;
        }

        var z = y.split("").reverse().join("");
        

        if(z[0] === ","){
        z = z.substring(1 , z.length);
        }

       if(type === 'inc') z = "+" + z;
       else z = "-" + z;
       return z ;

}

var nodeListForEach = function(list , callback){
    for(var i=0 ; i<list.length ; i++){
        callback(list[i] , i);
    }
};
    // Орлого зарлага , Ямар зориулалттай , Хэдэн төгрөг орж ирсэнийг DOM оос олж return ашиглаж App controller луу явуулж байна 
    return {
        displayDate : function(){
            var today = new Date();
            document.querySelector(DOMstrings.dateLabel).textContent = today.getMonth()+"сар"
        }, 

        getInput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseInt(document.querySelector(DOMstrings.inputValue).value)
        };
    },

    // Зарлагын Node list Ийг олох 
    displayPercentages : function(allPercentages){
        var elements = document.querySelectorAll(DOMstrings.expensePercentageLabel);

        // элемент болгоны хувьд зарлагын хувийг массиваас авж шивж оруулах
        nodeListForEach(elements , function(el , index){
            el.textContent = allPercentages[index] 
        });
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
        var type;
        if(budget.budget > 0) type = 'inc';
        else type = 'exp';
        document.querySelector(DOMstrings.budgetlevel).textContent = formatMoney(budget.budget);
        document.querySelector(DOMstrings.incomeLabel).textContent =formatMoney( budget.totalInc  , 'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent =formatMoney( budget.totalexp , 'exp');

        if(budget.percent!==0){
            document.querySelector(DOMstrings.percentageLabel).textContent = budget.percent + '%';
        }else{
            document.querySelector(DOMstrings.percentageLabel).textContent = budget.percent;
        }

    },

    // Дэлгэцнээс элемент устгах 
    deleteListItem : function(id){
        var el = document.getElementById(id);
        el.parentNode.removeChild(el);
    },
        // Орлого зарлагийн html ийг дэлгэцэнд харуулах publicservice
    addListItem : function(item , type){
        // 1Рт : Орлого зарлагын element ийг агуулсан Html ийг бэлтгэнэ
        var html , list;
        if(type==='inc'){
            list = DOMstrings.incomeList;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else {
            list = DOMstrings.expList;
           html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        // 2рт : Тэр html дотроо орлого зарлагын утгуудыг Replace ашиглан өөрчилнө
           html =  html.replace('%id%' , item.id);
           html = html.replace('%DESCRIPTION%' , item.description);
           html = html.replace('%VALUE%' , formatMoney(item.value  , type) );
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
    this.percentage = -1;
  };

  //   
  Expense.prototype.calcPercentage = function(totalIncome){

    if(totalIncome > 0){
        this.percentage = Math.round((this.value/totalIncome)*100);
    }else{
        this.percentage = 0;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.items[type].forEach(function(el){
        sum = sum + el.value;
    });

    data.totals[type] = sum;
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
        if(data.totals.inc > 0){
            data.percent = Math.round((data.totals.exp / data.totals.inc)*100); 
        }else{
            data.percent = 0;
        }
    },

    calculatePercentages : function(){
        data.items.exp.forEach(function(el){
            el.calcPercentage(data.totals.inc);
        });
    },

    getPercentages : function(){
       var allPercentages =  data.items.exp.map(function(el){
            return el.getPercentage();
        });
        return allPercentages;
    },

    budgeGet : function(){
        return { 
            budget : data.budget,
            percent : data.percent,
            totalInc : data.totals.inc,
            totalexp : data.totals.exp
        }
    },

    deleteItem : function(type , id){
        var ids = data.items[type].map(function(el){
            return el.id;
        });

        var index  = ids.indexOf(id);

        if(index !== -1){
            data.items[type].splice(index , 1);
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

                    // Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ
                   updateBudget();
                }
};


var updateBudget = function()
{
     // 4рт : Төсвийг тооцоолно 
     fnCtrl.financeCalculate();
     // 5рт : Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана
     var budget = fnCtrl.budgeGet();

     // 6 : Төсвийн тооцоог дэлгэцэнд гаргана

     uiCtrl.budgetWatch(budget);

    //  7рт : Элементүүдийн хувийг тооцоолно 
    fnCtrl.calculatePercentages();

    // 8рт : Элементүүдийн хувийг хүлээж авна
    var allPercentages = fnCtrl.getPercentages();

    // 9рт эдгээр хувийг дэлгэцэнд гаргана
    console.log(allPercentages);
    uiCtrl.displayPercentages(allPercentages);
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

    // X дэмдэг дархад ажиллах event listener ийг eventBubbling ашиглан хииж байна
    document.querySelector(DOM.containerDiv).addEventListener('click',function(event){
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(id){
            var arr = id.split('-');
            var type = arr[0];
            var itemId  = parseInt(arr[1]);

            // 1рт : Санхүүгийн module аас type , id ашиглаад устгана . 
            fnCtrl.deleteItem(type , itemId);
            // 2рт : Дэлгэц дээрээс энэ элементийг устгана
            uiCtrl.deleteListItem(id);
            // 3рт : Үлдэгдэл тооцоог шинэчилж харуулна
             updateBudget();
        }
    });
 };

return {
    init : function(){
        console.log('Applicition starter>>!');
        uiCtrl.displayDate();
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
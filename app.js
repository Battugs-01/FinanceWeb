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
        }
};
})();

// Санхүүгийн хэсгийг хариуцах controller
var financeController = (function(){
    var Income = function(id , description , value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function(id , description , value){
        this.id  = id;
        this.description = description ; 
        this.value = value;
    };

    var data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals : {
            inc : 0,
            exp : 0
        }
    }
})();

// Санхүүгийн болон дэлгэцийн controller Ийг хооронд нь зангидах controller
var appController = (function(uiCtrl , fnCtrl){

    // EventListener ажиллах үед ажиллах дараагийн үйлдлүүдийг хариуцсан функц 
    var ctrlAddItem = function(){
                // 1рт : Оруулах өгөгдлийг дэлгэцээс олж авна
                console.log(uiCtrl.getInput());
                // 2рт : Олж авсан өгөгдлүүдээ санхүүгийн controllert дамжуулж тэнд хаднална
        
                // 3рт : Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана
        
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
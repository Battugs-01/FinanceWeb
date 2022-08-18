// Дэлгэцийн controller
var uiController = (function(){
    
})();

// Санхүүгийн хэсгийг хариуцах controller
var financeController = (function(){
    
})();

// Санхүүгийн болон дэлгэцийн controller Ийг хооронд нь зангидах controller
var appController = (function(uiCtrl , fnCtrl){
    
    // EventListener ажиллах үед ажиллах дараагийн үйлдлүүдийг хариуцсан функц 
    var ctrlAddItem = function(){
                // 1рт : Оруулах өгөгдлийг дэлгэцээс олж авна
                console.log('Дэлгэцээс өгөгдөл авах хэсэг');
                // 2рт : Олж авсан өгөгдлүүдээ санхүүгийн controllert дамжуулж тэнд хаднална
        
                // 3рт : Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана
        
                // 4рт : Төсвийг тооцоолно 
        
                // 5рт : Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана
    };

    // Зөв товчийг дархад ажиллах eventlistener
    document.querySelector(".add__btn").addEventListener('click',function(){
        ctrlAddItem();
    });

    // Enter дархад ажиллах eventListener
    document.addEventListener('keypress' , function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

})(uiController , financeController);
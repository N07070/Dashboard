function bananas(){
    var value = 0
    $('#bananas_img').click(function(){
        $(this).animate({rotate: '+=10deg'}, 0);
    });
}

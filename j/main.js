(function($) {

//Init variables
var url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?';
var id = 0, image ='';
var $slideshow = $('.b-slideshow'), $left_arrow = $('.b-left-arrow'), $right_arrow = $('.b-right-arrow');
$slideshow.html('<img class="b-slideshow__image" src="" alt="" />');
var $slideshowImg = $('.b-slideshow__image');

//Yandex API
  $.getJSON(url, function(root) {
     image = root.entries;
  }).done(function() {
    loadImg(id,"XL");
  
    var inner = '';
      $.each(image,function (i, val) {
          inner += '<img src="' + image[i].img.XXS.href + '" alt="" />';
      });
      $('.b-gallery').append(inner);
  });

//Загружаем изображение по id    
function loadImg(id,size) {
    var dfd = $.Deferred();
    var src = image[id].img[size].href;
    var alt = image[id].title;

    $slideshowImg.load(function () {
        dfd.resolve();
        resizeimage();
    }).attr({'src': src, 'data-photo-id': id, 'alt': alt});
    return dfd.promise();
};

//масштабируем под размеры viewport и центруем
function resizeimage() {
        var vpHeight = $(window).height(), vpWidth  = $(window).width();
        var zoomHeight = $slideshowImg.height() > vpHeight? vpHeight : $slideshowImg.height();
        var zoomWidth = $slideshowImg.width() > vpWidth  ? vpWidth  : $slideshowImg.width();
        $slideshowImg.attr({'height':zoomHeight});
        $slideshow.css({'top': (vpHeight - zoomHeight)/2 +'px', 'left': (vpWidth - zoomWidth)/2 +'px'});
}

$('.b-left-arrow').on("click", function() {
      var id = $slideshowImg.attr("data-photo-id");
      loadImg(--id,"XL");
  });

$('.b-right-arrow').on("click", function() {
      var id = $slideshowImg.attr("data-photo-id");
      loadImg(++id,"XL");
  });

$(window).resize(function(){
    resizeimage();
})
.mouseenter(function(){
    var id = $slideshowImg.attr("data-photo-id");
    if(id > 0)  showbutton($left_arrow);
    showbutton($right_arrow);
})
.mouseleave(function(){
    $left_arrow.hide();
    $right_arrow.hide();
});

function showbutton(obj) {
    obj.show();
};

})(jQuery);
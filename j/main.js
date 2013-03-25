(function($) {

//Init variables
var url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?';
var id = 1, image ='';
var $slideshow = $('.b-slideshow'); 
$slideshow.html('<img class="b-slideshow__image" src="" alt="" />');
var $slideshowImg = $('.b-slideshow__image');

$.getJSON(url, function(root){
		  image = root.entries;
  }).done(function() {
    loadImg(id,'XL');

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
    }).attr({'src': src, 'data-photo-id': id, 'alt': alt});
    return dfd.promise();
};

})(jQuery);
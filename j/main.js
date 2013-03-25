(function($) {
var url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?';
var id = 1, image ='';
var $lightbox = $('#lightBox');
$lightbox.html('<img src="" alt="" />');

$.getJSON(url, function(root){
		  image = root.entries;
  }).done(function() {
    loadImg(id,'XL');
});


//Загружаем изображение по id    
function loadImg(id,size) {
    var dfd = $.Deferred();
    var src = image[id].img[size].href;
    var alt = image[id].title;

    $lightbox.find('img').load(function () {
        dfd.resolve();
    }).attr({'src': src, 'data-photo-id': id, 'alt': alt});
    return dfd.promise();
};

})(jQuery);
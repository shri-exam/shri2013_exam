(function($) {
var url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?';
$.getJSON(url, function(root){
		var entries=root.entries; // весь JSON в этой переменной
//		$.each(entries, function(i) {
			var src = entries[3].img.XL.href;
			loadImg(src);
//		});
       function loadImg(src) {
          var dfd = $.Deferred();
          $('#lightBox').html('<img alt="" />');
          $('#lightBox>img').load(function () {
             dfd.resolve();
          }).attr('src', src);
          return dfd.promise();
        }
	});
})(jQuery);
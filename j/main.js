(function($) {

      //Init variables
      var id = 0, image ='';
      var url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?';
      var screen_height = window.screen.availHeight;
      var size_suffix = {'XL': '800', 'L': '500', 'M':'300', 'S':'150', 'XS': '100', 'XXS': '75', 'XXXS': '50'};
      var $slideshow = $('.b-slideshow'), $gallery = $('.b-gallery');
      var $left_arrow = $('.b-left-arrow'), $right_arrow = $('.b-right-arrow');
      $slideshow.html('<img class="b-slideshow__image" src="" alt="" />');
      var $slideshow_image = $('.b-slideshow__image');

      //Yandex API
      $.getJSON(url, function(root) {
            image = root.entries;
            console.log(image);
      }).done(function() {
            loadImg(id,"XL");
      
        var inner = '';
          $.each(image,function (i, val) {
            inner += '<img src="' + image[i].img.XXS.href + '" alt="" />';
          });
            $gallery.append(inner);
      });

      //Загружаем изображение по id    
      function loadImg(id,size) {
            var size = size || 'XL';
            var dfd = $.Deferred();
            var src = image[id].img[size].href;
            var alt = image[id].title;

            $slideshow_image.load(function () {
                dfd.resolve();
                resizeimage();
        }).attr({'src': src, 'data-photo-id': id, 'alt': alt});
                return dfd.promise();
      };

      //масштабируем под размеры viewport и центруем
      function resizeimage() {
            var vp_height = $(window).height(), vp_width  = $(window).width();
            var zoom_height = $slideshow_image.height() > vp_height? vp_height - 100 : $slideshow_image.height();
            var zoom_width = $slideshow_image.width() > vp_width  ? vp_width : $slideshow_image.width();
            $slideshow_image.attr({'height':zoom_height});
            $slideshow.css({'top': (vp_height - zoom_height)/2 +'px', 'left': (vp_width - zoom_width)/2 +'px'});
      }

      //Обработчики событий
      $left_arrow.on("click", function() {
            var id = $slideshow_image.attr("data-photo-id");
            loadImg(--id);
      });

      $right_arrow.on("click", function() {
            var id = $slideshow_image.attr("data-photo-id");
            loadImg(++id);
      });

      $(window).resize(function(){
          resizeimage();
      })
      .mouseenter(function(){
            var id = $slideshow_image.attr("data-photo-id");
            if(id > 0)  showbutton($left_arrow);
            showbutton($right_arrow);
      })
      .mouseleave(function(){
            $left_arrow.hide();
            $right_arrow.hide();
      })
      .mousemove(function(e){
        $bottom = e.pageY;
        if ($bottom > $(window).height() -75 ) $gallery.slideDown(200);
        else  $gallery.slideUp(200);
      });

      function showbutton(obj) {
            obj.show();
      };

})(jQuery);
(function($) {

//Init variables
      var id = 0, image ='', size = '', last_image;
      var url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?';
      var screen_height = window.screen.availHeight;
      var size_suffix = {'XL': '800', 'L': '500', 'M':'300', 'S':'150', 'XS': '100', 'XXS': '75', 'XXXS': '50'};
      var $slideshow = $('.b-slideshow'), $gallery = $('.b-gallery'), $gallery_wrapper = $('.b-gallery__wrapper');
      var $left_arrow = $('.b-left-arrow'), $right_arrow = $('.b-right-arrow');
      var $selected_image = '', $slideshow_image = '';
//
      $.extend($.easing,
      {
            def: 'swing',
            easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            }
      });

//Yandex API
      function loadGallery(url) {
            $.getJSON(url, function(root) {
                  image = root.entries;
            }).done(function() {
              var inner = '';
                $.each(image,function (i, val) {
                  inner += '<a href="#"><img class="b-gallery__image" src="' + image[i].img.XXS.href + '" alt="" /></a>';
                });

                  last_image = image.length - 1;
                  $gallery_wrapper.append(inner).css('width', last_image*96);
                  loadImg(id, size);
            });
      };

//Загружаем изображение по id    
      function loadImg(id,size) {
            var dfd = $.Deferred();
            var src = image[id].img[size].href;
            var alt = image[id].title;
            var container = '<img class="b-slideshow__image" src="' + src + '" alt="' + alt + 'data-photo-id="'+ id + '/>';
            $slideshow.hide().html(container);
            $slideshow_image = $('.b-slideshow__image');

            $slideshow_image.load(function () {
                dfd.resolve();
                $slideshow.fadeIn();
                resizeimage();
            });

                $selected_image = $('.b-gallery__image').eq(id);
                $selected_image.addClass('b-gallery__image_active');
                return dfd.promise();
      };

//масштабируем под размеры viewport и центруем
      function resizeimage() {
            var vp_height = $(window).height(), vp_width  = $(window).width();
            var zoom_height =  vp_height - 250;
            $slideshow_image.attr({'height':zoom_height});
            var zoom_width = $slideshow_image.width() > vp_width  ? vp_width : $slideshow_image.width();
            $slideshow.css({'top': (vp_height - zoom_height)/2 +'px', 'left': (vp_width - zoom_width)/2 +'px'});
      }
//
      function showbutton(obj) {
            obj.css({'top': ($(window).height() - obj.height())/2 +'px'})
            .show();
      };
//
      function calcImageSize(size_suffix, screen_height) {
            var calc_size = $.map(size_suffix, function(value,index){
                return (value > screen_height) ? index : null; 
            });
            size = calc_size != "" ? calc_size : "XL";
      };

//Обработчики событий
      $left_arrow.click(function() {
            $selected_image.removeClass('b-gallery__image_active');
            if (id > 0 ) --id;
            loadImg(id,size);
      });
//
      $right_arrow.click(function() {
            $selected_image.removeClass('b-gallery__image_active');
            if (id < last_image-1) ++id;
            loadImg(id,size);
      });
//
      $(window).resize(function(){
            resizeimage();
      })
      .mouseenter(function(){
            if (id > 0)  showbutton($left_arrow);
            if (id < last_image-1) showbutton($right_arrow);
      })
      .mouseleave(function(){
            $left_arrow.hide();
            $right_arrow.hide();
      })
      .mousemove(function(e){
            $bottom = e.pageY;
            if ($bottom > $(window).height() - 75 ) $gallery.slideDown(200);
            else  $gallery.slideUp(200);
      });
//
      $gallery.delegate('a', 'click', function(obj){
            $selected_image.removeClass('b-gallery__image_active');
            id = $(this).index();
            loadImg(id,size);
            return false;
      });
//
      $gallery.bind('mousewheel', function(event, delta) {
        var visible_offset = $gallery_wrapper.width() - $gallery.width();
            $gallery_wrapper.animate({'left': '+=' + delta * 96}, { duration: 75, easing: 'easeOutCubic', step: function(now, obj){
                if (obj.end > 0) obj.end = '0';
                else if (obj.end  < -visible_offset) obj.end = obj.start;
            }});
      });

//
      calcImageSize(size_suffix, screen_height);
      loadGallery(url);

})(jQuery);
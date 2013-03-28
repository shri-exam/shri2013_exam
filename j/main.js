(function($) {

//Init variables
      var id = 0, image ='', size = '';
      var url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?';
      var screen_height = window.screen.availHeight;
      var size_suffix = {'XL': '800', 'L': '500', 'M':'300', 'S':'150', 'XS': '100', 'XXS': '75', 'XXXS': '50'};
      var $slideshow = $('.b-slideshow'), $gallery = $('.b-gallery'), $gallery_wrapper = $('.b-gallery__wrapper');
      var $left_arrow = $('.b-left-arrow'), $right_arrow = $('.b-right-arrow');
      var $last_image = '';
      var $slideshow_image = $('.b-slideshow__image');

//Yandex API
      function loadGallery(url) {
            $.getJSON(url, function(root) {
                  image = root.entries;
            }).done(function() {
                  loadImg(id,"XL");
            
              var inner = '';
                $.each(image,function (i, val) {
                  inner += '<a href="#"><img class="b-gallery__image" src="' + image[i].img.XXS.href + '" alt="" /></a>';
                });
                  $gallery_wrapper.append(inner);
            });
      };

//Загружаем изображение по id    
      function loadImg(id,size) {
            var size = size || 'XL';
            var dfd = $.Deferred();
            var src = image[id].img[size].href;
            var alt = image[id].title;

            var container = '<img class="b-slideshow__image" src="' + src + '" alt="' + alt + 'data-photo-id="'+ id + '/>';

            container.load(function () {
                dfd.resolve();
                $slideshow.html(container);
                resizeimage();
            });
                $last_image = $('.b-gallery__image').eq(id);
                $last_image.addClass('b-gallery__image_active');
                return dfd.promise();
      };

//масштабируем под размеры viewport и центруем
      function resizeimage() {
            var vp_height = $(window).height(), vp_width  = $(window).width();
            var zoom_height =  vp_height - 300;
            var zoom_width = $slideshow_image.width() > vp_width  ? vp_width : $slideshow_image.width();
            $slideshow_image.attr({'height':zoom_height});
            $slideshow.css({'top': (vp_height - zoom_height)/2 +'px', 'left': (vp_width - zoom_width)/2 +'px'});
      }
//
      function showbutton(obj) {
            obj.show();
      };
//
      function calcImageSize(size_suffix, screen_height) {
            size = $.grep(size_suffix, function(el,idx){
                if(size_suffix[el] < screen_height) return true;
                else return false
            });
            console.log(size);
      };

      $.extend($.easing,
      {
            def: 'swing',
            easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            }

      });

//Обработчики событий
      $left_arrow.click(function() {
            $last_image.removeClass('b-gallery__image_active');
            if (id > 0 ) --id;
            loadImg(id);
      });
//
      $right_arrow.click(function() {
            $last_image.removeClass('b-gallery__image_active');
            ++id;
            loadImg(id);
      });
//
      $(window).resize(function(){
          resizeimage();
      })
      .mouseenter(function(){
            if (id > 0)  showbutton($left_arrow);
            showbutton($right_arrow);
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
            id = $(this).index();
            $('.b-gallery__image').eq(id).removeClass('b-gallery__image_active');
            loadImg(id);
            return false;
      });
//
      $gallery.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            var offset = $gallery_wrapper.css('left').replace('px','');
            var off = (offset == 0 && delta < 0) ?  offset + 'px' : '+=' + delta * 101; 
            //var off = (offset < -5100 && delta < 0) ? offset + 'px' : '+=' + delta * 101;
            console.log(offset);
            console.log(off);
            $('.b-gallery__wrapper').animate({'left': off}, 50, 'easeOutCubic');
      });

//
      loadGallery(url);
      calcImageSize(size_suffix, screen_height);

})(jQuery);
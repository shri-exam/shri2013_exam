(function($) {

//Init variables
      var id,
      image = {},
      collection_image,
      url = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?',
      screen_height = window.screen.availHeight,
      size_suffix = {'XL': '800', 'L': '500', 'M' :'300', 'S' :'150', 'XS' : '100', 'XXS' : '75', 'XXXS' : '50'},
      $slideshow = $('.b-slideshow'),
      $gallery = $('.b-gallery'),
      $gallery_wrapper = $('.b-gallery__wrapper'),
      $left_arrow = $('.b-left-arrow'),
      $right_arrow = $('.b-right-arrow'),
      $selected_image,
      $slideshow_image,
      $bottom;

//добавляем дополнительную easing-функцию
      $.extend($.easing,
      {
            def: 'swing',
            easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            }
      });

//Фукнции для работы с History.API
      function HistoryAPI() {
            var history_support;
// определяем поддержку HTML5 History
// return - true/false - поддержку history, добавляет class history к <html>
            this.featureDetect = function() {
                var html5history = !!(window.history && window.history.pushState);

                if (html5history) {
                    $('html').addClass('history');
                }
                return html5history;
            }
//парсим URL
            this.getURL = function(history_support) {
                    var url = $(location).attr('href'),
                        regex = /[?&]([^=#]+)=([^&#]*)/g,
                        match, params = {};

                while (match = regex.exec(url)) {
                    params[match[1]] = match[2];
                }
                return (params.hasOwnProperty('id')) ? params.id : 0;
            }

//сохраняем путь в history
//если history поддерживается, заменяем url
//если history не поддерживается, пишем в hash
            this.setURL = function(history_support, id) {
                var query = '?id=' + id;
                var url = $(location).attr('href').split("?")[0] + query;

                if (history_support) {
                    var state = {'id' : id};
                    history.pushState(state,'', url);
                }
                else {
                    $(location).attr('hash', query);
                }
            }
//
            this.init = function() {  
                  var history_support = this.featureDetect();
                  id = this.getURL(history_support);                  
                  return history_support;
            }
      }


//Загружаем альбом при помощи API Yandex фотки
// @param: url - string
// return: image - json  - страница коллекции текущего альбома
      function loadAlbum(url) {
            return $.ajax({
                     async : true,
                     dataType : 'jsonp',
                     url : url,
          });
      }

//Загружаем миниаютюры в галерею
// @param: image - object
      function loadGallery(image) {
            var dfd = $.Deferred();
            var inner = '';
            $.each(image,function (i, val) {
                  inner += '<a href="#"><img class="b-gallery__image" src="' + image[i].img.XXS.href + '" alt="" /></a>';
                });
            collection_image = image.length;
            $gallery_wrapper.append(inner)
            .on ('load', function() {
                dfd.resolve(image);
            })
            .css('width', collection_image * 96);

            return dfd.promise();
      }

//Загружаем изображение по id
      function loadImg(image, id, size) {
            var dfd = $.Deferred(),
                src = image[id].img[size].href,
                alt = image[id].title,
                container = '<img class="b-slideshow__image" src="' + src + '" alt="' + alt + '" data-photo-id="'+ id + '" />';
            
            $slideshow.hide().html(container);
            $slideshow_image = $('.b-slideshow__image');
            $slideshow_image.load(function () {
            var his = new HistoryAPI;
                his.setURL(his_support, id);
                dfd.resolve(id);
                $slideshow.fadeIn();
                resizeImage();
            });
                $selected_image = $('.b-gallery__image').eq(id);
                $selected_image.addClass('b-gallery__image_active');
                return dfd.promise();
      }

//масштабируем под размеры viewport и центруем
      function resizeImage() {
            var vp_height = $(window).height(), vp_width  = $(window).width();
            var zoom_height =  vp_height - $gallery.outerHeight() * 2 - 50;
            if (zoom_height < 300) zoom_height = 300;
            $slideshow_image.attr({'height' : zoom_height});
            var zoom_width = $slideshow_image.width() > vp_width  ? vp_width : $slideshow_image.width();
            $slideshow.css({'top': (vp_height - zoom_height)/2 +'px', 'left': (vp_width - zoom_width)/2 +'px'});
      }

//Функции-методы для вывода стрелочек
      function Button() {
//Выводим обе стрелки, с проверкой состояния
            this.checkState = function(id) {
                id > 0 ? this.show($left_arrow) : this.hide ($left_arrow);
                id < collection_image - 1 ? this.show($right_arrow) : this.hide($right_arrow);
            }
//Выводим стрелку
            this.show = function(obj) {
                obj.css({'top': ($(window).height() - obj.height())/2 +'px'})
                .fadeIn(200);
            }
//Прячем стрелку
            this.hide = function(obj) {
                obj.fadeOut(200);
            }
//Прячем обе стрелки
            this.hideAll = function(obj) {
                this.hide($left_arrow);
                this.hide($right_arrow);
            }
      }

//Вычисляем размер фотографии, в зависимости от максимальной высоты экрана
      function calcImageSize(size_suffix, screen_height) {
            var calc_size = $.map(size_suffix, function(value,index) {
                return (value > screen_height) ? index : null;
            });
            return calc_size != '' ? calc_size : "XL";
      }
//
      function slideGallery(delta, offset) {
            offset = offset || 96;
            var visible_offset = $gallery_wrapper.width() - $gallery.width();
                $gallery_wrapper.animate({'left': '+=' + delta * offset}, { duration: 75, easing: 'easeOutCubic', step: function(now, obj) {
                    if (obj.end > 0) obj.end = '0';
                    else if (obj.end  < -visible_offset) obj.end = obj.start;
                }
            });
      }

//Обработчики событий
      $left_arrow.click(function() {
            $selected_image.removeClass('b-gallery__image_active');
            if (id > 0 ) {
                slideGallery(1);
                loadImg(image, --id, size);
                var btn = new Button;
                btn.checkState(id);
            }
      });
//
      $right_arrow.click(function() {
            $selected_image.removeClass('b-gallery__image_active');
            if (id < collection_image - 1) {
                slideGallery(-1);            
                loadImg(image, ++id, size);
                var btn = new Button;
                btn.checkState(id);
            }
      });
//
      $(document).mouseenter(function() {
            var btn = new Button;
            btn.checkState(id);
      })
      .mouseleave(function() {
            var btn = new Button;
            btn.hideAll();
      });
//
      $(window).resize(function(){
            resizeImage();
      })
      .mousemove(function(e) {
            $bottom = e.pageY;
            if ($bottom > $(window).height() - 75 ) {
                $gallery.slideDown(200);
            } 
            else {
                $gallery.slideUp(200);
            }
      });
//
      $gallery.on('click', 'a', function(obj) {
            $selected_image.removeClass('b-gallery__image_active');
            id = $(this).index();
            slideGallery(-1);
            loadImg(image,id, size);
            return false;
      })
      .on('mousewheel', function (event, delta) {
            slideGallery(delta);
     });

//
      var his = new HistoryAPI;
      var his_support = his.init();

      var size = calcImageSize(size_suffix, screen_height);
      loadAlbum(url)
      .pipe(function (data) {
              image = data.entries;
              loadGallery(image);
      })
      .pipe(function () {
              loadImg(image, id, size);
      });

})(jQuery);
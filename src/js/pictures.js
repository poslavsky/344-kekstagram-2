'use strict';
(function() {
  var PICS_LOAD_URL = 'http://localhost:1507/api/pictures';
  var filters = document.querySelector('.filters');
  var container = document.querySelector('.pictures');
  var template = document.querySelector('template');
  filters.classList.add('hidden');
  var templateContainer = 'content' in template ? template.content : template;
  var getPicturesElement = function(pic) {
    var picElement = templateContainer.querySelector('.picture').cloneNode(true);
    picElement.querySelector('.picture-comments').textContent = pic.comments;
    picElement.querySelector('.picture-likes').textContent = pic.likes;
    var backgroundImage = new Image();
    backgroundImage.onload = function() {
      backgroundImage.height = 182;
      backgroundImage.width = 182;
    };
    backgroundImage.onerror = function() {
      picElement.classList.add('picture-load-failure');
    };
    backgroundImage.src = pic.url;
    picElement.replaceChild(backgroundImage, picElement.querySelector('img'));
    return picElement;
  };
  var renderPictures = function(arrayElements) {
    arrayElements.forEach(function(pic) {
      container.appendChild(getPicturesElement(pic));
    });
  };
  // renderPictures(pictures);

  var load = function(url, callback, callbackName) {
    if (!callbackName) {
      callbackName = 'cb' + Date.now();
    }

    window[callbackName] = function(data) {
      callback(data);
    };

    var script = document.createElement('script');
    script.src = url + '?callback=' + callbackName;
    document.body.appendChild(script);
  };

  load(PICS_LOAD_URL, function(data) {
    renderPictures(data);
  }, '__jsonpCallback');

  filters.classList.remove('hidden');
})();

'use strict';

var gallery = require('./gallery');

var Picture = function(data, number) {
  this.data = data;
  this.element = getPicturesElement(data, number);
  var self = this;
  this.element.onclick = function(e) {
    e.preventDefault();
    gallery.show(number);
  };
  this.remove = function() {
    self.element.onclick = null;
  };
};

var getPicturesElement = function(pic, number) {
  var template = document.querySelector('template');
  var templateContainer = 'content' in template ? template.content : template;
  var picElement = templateContainer.querySelector('.picture').cloneNode(true);
  picElement.onclick = function(e) {
    e.preventDefault();
    gallery.show(number);
  };
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

//module.exports = getPicturesElement;
module.exports = Picture;

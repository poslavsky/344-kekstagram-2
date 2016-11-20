'use strict';

var gallery = require('./gallery');

var Picture = function(data, number) {
  this.data = data;
  // this.element = this.getPicturesElement(data, number);
  // var self = this;

  var template = document.querySelector('template');
  var templateContainer = 'content' in template ? template.content : template;
  this.picElement = templateContainer.querySelector('.picture').cloneNode(true);
  this.picElement.querySelector('.picture-comments').textContent = this.data.comments;
  this.picElement.querySelector('.picture-likes').textContent = this.data.likes;

  this.backgroundImage = new Image();

  this.backgroundImage.src = this.data.url;
  this.picElement.replaceChild(this.backgroundImage, this.picElement.querySelector('img'));

  this.onLoad = this.onLoad.bind(this);
  this.backgroundImage.addEventListener('load', this.onLoad);

  this.onError = this.onError.bind(this);
  this.backgroundImage.addEventListener('error', this.onError);

  // this.element.onclick = function(e) {
  //   e.preventDefault();
  //   gallery.show(number);
  // };
  // this.remove = function() {
  //   self.element.onclick = null;
  // };
};

Picture.prototype.onClick = function(e) {
  e.preventDefault();
  gallery.show(number);
};

Picture.prototype.remove = function() {
  this.backgroundImage.removeEventListener('click', this.onClick.bind(this));
  this.backgroundImage.removeEventListener('load', this.onLoad.bind(this));
  this.backgroundImage.removeEventListener('error', this.onError.bind(this));
};

Picture.prototype.onLoad = function() {
  this.backgroundImage.height = 182;
  this.backgroundImage.width = 182;
};

Picture.prototype.onError = function() {
  this.picElement.classList.add('picture-load-failure');
};

Picture.prototype.getPictureElement = function() {
  return this.picElement;
};

// Picture.prototype = {
//   getPicturesElement: function(pic, number) {
//     // var template = document.querySelector('template');
//     // var templateContainer = 'content' in template ? template.content : template;
//     // var picElement = templateContainer.querySelector('.picture').cloneNode(true);
//     // picElement.onclick = function(e) {
//     //   e.preventDefault();
//     //   gallery.show(number);
//     // };
//     // picElement.querySelector('.picture-comments').textContent = pic.comments;
//     // picElement.querySelector('.picture-likes').textContent = pic.likes;
//
//     // var backgroundImage = new Image();
//     // backgroundImage.onload = function() {
//     //   backgroundImage.height = 182;
//     //   backgroundImage.width = 182;
//     // };
//     // backgroundImage.onerror = function() {
//     //   picElement.classList.add('picture-load-failure');
//     // };
//     // backgroundImage.src = pic.url;
//     // picElement.replaceChild(backgroundImage, picElement.querySelector('img'));
//     return picElement;
//   }
// };

module.exports = Picture;

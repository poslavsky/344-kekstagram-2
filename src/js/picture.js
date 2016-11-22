'use strict';

var gallery = require('./gallery');

var Picture = function(data, number) {
  this.number = number;
  this.data = data;

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
};

Picture.prototype.onClick = function(e) {
  e.preventDefault();
  gallery.show(this.number);
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

module.exports = Picture;

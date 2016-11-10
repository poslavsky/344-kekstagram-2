'use strict';

var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.overlay = document.querySelector('.gallery-overlay');
  this.overlayClose = document.querySelector('.gallery-overlay-close');
  this.overlayImage = document.querySelector('.gallery-overlay-image');
};

Gallery.prototype.setPictures = function(arrayData) {
  this.pictures = arrayData;
};

Gallery.prototype.show = function(number) {
  var self = this;
  this.overlayClose.onclick = function() {
    self.hide();
  };
  this.overlayImage.onclick = function() {
    if (number + 1 === self.pictures.length) {
      number = 0;
      self.setActivePicture(number);
    } else {
      self.setActivePicture(++number);
    }
  };
  this.overlay.classList.remove('invisible');
  this.setActivePicture(number);
};

Gallery.prototype.hide = function() {
  this.overlay.classList.add('invisible');
  this.overlayClose.onclick = null;
  this.overlayImage.onclick = null;
};

Gallery.prototype.setActivePicture = function(number) {
  this.pictureLikes = document.querySelector('.likes-count');
  this.pictureComments = document.querySelector('.comments-count');
  this.activePicture = number;
  this.overlayImage.src = this.pictures[number].url;
  this.pictureLikes.textContent = this.pictures[number].likes;
  this.pictureComments.textContent = this.pictures[number].comments;
};

module.exports = new Gallery();

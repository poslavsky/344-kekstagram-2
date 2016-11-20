'use strict';

var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
};

Gallery.prototype.setPictures = function(arrayData) {
  this.pictures = arrayData;
};

Gallery.prototype.overlayClose = function() {
  this.hide();
};

Gallery.prototype.overlayImage = function() {
  if (number + 1 === this.pictures.length) {
    number = 0;
    this.setActivePicture(number);
  } else {
    this.setActivePicture(++number);
  }
};

Gallery.prototype.show = function(number) {
  this.galleryOverlayImage.addEventListener('click', this.overlayImage.bind(this));
  this.galleryOverlayClose.addEventListener('click', this.overlayClose.bind(this));
  this.galleryOverlay.classList.remove('invisible');
  this.setActivePicture(number);
};

Gallery.prototype.hide = function() {
  this.galleryOverlay.classList.add('invisible');
  this.galleryOverlayClose.removeEventListener('click', this.overlayClose.bind(this));
  this.galleryOverlayImage.removeEventListener('click', this.overlayImage.bind(this));
};

Gallery.prototype.setActivePicture = function(number) {
  this.pictureLikes = document.querySelector('.likes-count');
  this.pictureComments = document.querySelector('.comments-count');
  this.activePicture = number;
  this.galleryOverlayImage.src = this.pictures[number].url;
  this.pictureLikes.textContent = this.pictures[number].likes;
  this.pictureComments.textContent = this.pictures[number].comments;
};

module.exports = new Gallery();

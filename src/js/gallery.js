var Gallery = function(data) {
  this.pictures = data;
  this.activePicture = 0;
  this.overlay = document.querySelector('.gallery-overlay');
  this.overlayClose = document.querySelector('.gallery-overlay-close');
  this.overlayImage = document.querySelector('.gallery-overlay-image');
}

Gallery.prototype.setActivePicture = function(numb) {
  this.activePicture = numb;
  this.overlayImage.src = this.pictures[this.activePicture].url;
  if (this.activePicture > this.pictures.lenght - 1) {
    this.activePicture = 0;
  } else {
    this.activePicture++;
  }
}

Gallery.prototype.setPictures = function(arrayData) {
  this.pictures = arrayData;
};
Gallery.prototype.show = function(numb) {
  var self = this;
  this.overlayClose.onclick = function() {
    self.hide();
  }
  this.overlayImage.onclick = function() {
    self.setActivePicture();
  }

  this.overlay.classList.remove('invisible');
}

Gallery.prototype.hide = function() {
  this.overlay.classList.add('invisible');
  this.overlayClose.onclick = null;
  this.overlayImage.onclick = null;
}

module.exports = new Gallery();

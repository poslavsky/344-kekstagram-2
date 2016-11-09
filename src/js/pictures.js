'use strict';

var getPicturesElement = require('./picture');
var load = require('./load');
var gallery = require('./gallery');

var PICS_LOAD_URL = 'http://localhost:1507/api/pictures';
var container = document.querySelector('.pictures');
var filters = document.querySelector('.filters');

filters.classList.add('hidden');

var renderPictures = function(arrayElements) {
  arrayElements.forEach(function(pic, number) {
    container.appendChild(getPicturesElement(pic, number));
  });
  gallery.setPictures(arrayElements);
  filters.classList.remove('hidden');
};

load(PICS_LOAD_URL, renderPictures, '__jsonpCallback');

module.exports = renderPictures;

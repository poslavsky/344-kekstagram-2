'use strict';

var Picture = require('./picture');
var load = require('./load');
var gallery = require('./gallery');

var PICS_LOAD_URL = '/api/pictures';
var container = document.querySelector('.pictures');
var filters = document.querySelector('.filters');
var footer = document.querySelector('.footer');
var DEFAULT_FILTER = 'filter-popular';
var activeFilter = DEFAULT_FILTER;
var PAGE_SIZE = 12;
var GAP = 100;
var pageNumber = 0;

var renderPictures = (function() {
  filters.classList.add('hidden');

  var showPictures = function(arrayElements) {
    arrayElements.forEach(function(pic, number) {
      container.appendChild(new Picture(pic, number).element);
    });
    gallery.setPictures(arrayElements);
    filters.classList.remove('hidden');
  };

  var loadPictures = function(filter, page) {
    load(PICS_LOAD_URL, {
      from: 0,
      to: page * PAGE_SIZE + PAGE_SIZE,
      filter: filter
    },
      showPictures);
  };

  var addPictures = function() {
    if (container.getBoundingClientRect().height - 120 < window.innerHeight - footer.getBoundingClientRect().height) {
      loadPictures(activeFilter, ++pageNumber);
    }
  };

  loadPictures(activeFilter, pageNumber);
  addPictures();

  filters.classList.remove('hidden');

  filters.addEventListener('change', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      changeFilter(evt.target.id);
    }
  });

  var changeFilter = function(filterID) {
    container.innerHTML = '';
    activeFilter = filterID;
    pageNumber = 0;
    loadPictures(filterID, pageNumber);
    addPictures();
  };

  var THROTTLE_DELAY = 100;
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        loadPictures(activeFilter, ++pageNumber);
        addPictures();
      }

      lastCall = Date.now();
    }
  });

})();

module.exports = renderPictures;

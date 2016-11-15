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

  //функция-коллбэк, которая из массива данных делает карточки
  var showPictures = function(arrayElements) {
    container.innerHTML = '';
    arrayElements.forEach(function(pic, number) {
      container.appendChild(new Picture(pic, number).element);
    });
    gallery.setPictures(arrayElements);
    filters.classList.remove('hidden');
  };

  //функция, которая запускает загружку данных с нужными параметрами - страницы и фильтр
  var loadPictures = function(filter, page) {
    load(PICS_LOAD_URL, {
      from: 0,
      to: page * PAGE_SIZE + PAGE_SIZE,
      filter: filter
    },
      showPictures);
  };

  loadPictures(activeFilter, pageNumber);

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
  };

  //THROTTLE - оптимизируем подгрузку изображений
  var THROTTLE_DELAY = 100;
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        loadPictures(activeFilter, ++pageNumber);
      }
      lastCall = Date.now();
    }
  });

})();

module.exports = renderPictures;

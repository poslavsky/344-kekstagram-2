/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

module.exports = (function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  var cleanupResizer = function() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  };

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  var updateBackground = function() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  };

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */


  // Находим элементы формы
  var formElement = document.forms['upload-resize'];
  var resizeX = formElement['resize-x'];
  var resizeY = formElement['resize-y'];
  var resizeSize = formElement['resize-size'];
  var forwardButton = formElement['resize-fwd'];
  var resizeControls = document.querySelector('.upload-resize-controls');
  // Вешаем на интересующие нас три поля обработчик
  // таким образом при каждом изменении будет вызываться
  // resizeFormIsValid и производиться валидация
  resizeX.oninput = resizeFormIsValid;
  resizeY.oninput = resizeFormIsValid;
  resizeSize.oninput = resizeFormIsValid;


  function resizeFormIsValid() {
    var valid = true;
    resizeX.min = 0;
    resizeY.min = 0;
    resizeSize.min = 0;
    resizeX.max = currentResizer._image.naturalWidth - resizeSize.value;
    resizeY.max = currentResizer._image.naturalHeight - resizeSize.value;

    for (var i = 0; i < resizeControls.length; i++) {
      if (!resizeControls[i].validity.valid) {
        valid = false;
        break;
      }
    }
    forwardButton.disabled = !valid;
    return valid;
  }

  window.addEventListener('resizerchange', function() {
    var constraint = currentResizer.getConstraint();

    resizeX.value = parseInt(constraint.x, 10);
    resizeY.value = parseInt(constraint.y, 10);
    resizeSize.value = parseInt(constraint.side, 10);

    resizeFormIsValid();
  });

  resizeControls.addEventListener('input', function() {
    var valueX = parseInt(resizeX.value, 10);
    var valueY = parseInt(resizeY.value, 10);
    var valueSize = parseInt(resizeSize.value, 10);

    currentResizer.setConstraint(valueX, valueY, valueSize);
  }, true);

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  var showMessage = function(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  };

  var hideMessage = function() {
    uploadMessage.classList.add('invisible');
  };

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });


  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  //сохраняем фильтр в localStorage
  function localStorageSave() {
    var checkedFilter = document.querySelector('input[name="upload-filter"]:checked');
    localStorage.setItem('upload-filter', checkedFilter.value);
  }

  function addFilter() {
    var getRadio = localStorage.getItem('upload-filter') || 'filter-none';
    document.getElementById('upload-filter-' + getRadio).checked = true;
    var filterClass = 'filter-' + getRadio;
    filterImage.className = 'filter-image-preview ' + filterClass;
  }

  forwardButton.addEventListener('click', function() {
    addFilter();
  });


  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });


  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */

  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    localStorageSave();
    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];

  });

  cleanupResizer();
  updateBackground();
})();

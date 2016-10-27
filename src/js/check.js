'use strict';
function getMessage(a, b) {
  if (typeof a === 'boolean') {
    if (a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    }
  } else if (typeof a === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' атрибутов';
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    var summArray = 0;
    for (var i = 0; i < a.length; i++) {
      summArray = summArray + a[i];
      //или summArray += a[i];
    }
    return 'Количество красных точек во всех строчках изображения: ' + summArray;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    var artifactsSquare = 0;
    var shorterArray;
    if (a.length > b.length) {
      shorterArray = b;
    } else {
      shorterArray = a;
    }
    for (var j = 0; j < shorterArray.length; j++) {
      artifactsSquare += a[j] * b[j];
    }
    return 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
  } else {
    return 'Переданы некорректные данные';
  }
}
window.getMessage = getMessage;

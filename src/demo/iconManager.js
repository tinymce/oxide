/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

if (!tinymce) {
  var tinymce = {};
}

tinymce.IconManager = (function() {
  var iconPacks = {};

  function add(name, payload) {
    iconPacks[name] = payload.icons;
    if (name === getActiveIconPack()) {
      injectIconPack(payload.icons);
    }
  }

  function getActiveIconPack() {
    return sessionStorage.getItem('active-icon-pack') || 'default';
  }

  function setActiveIconPack(packName) {
    if (iconPacks[packName]) {
      injectIconPack(iconPacks[packName]);
      sessionStorage.setItem('active-icon-pack', packName);
    }
  }

  function injectIconPack(iconPack) {
    $('svg').each(function (name, svg) {
      if (iconPack[svg.getAttribute('data-name')]) {
        const div = document.createElement('div');
        div.innerHTML = iconPack[svg.getAttribute('data-name')];
        div.firstChild.setAttribute('data-name', svg.getAttribute('data-name'));
        svg.parentNode.insertBefore(div.firstChild, svg);
        $(svg).remove();
      }
    });
  }

  var list = function () {
    return iconPacks;
  }

  return {
    add: add,
    setActiveIconPack: setActiveIconPack,
    getActiveIconPack: getActiveIconPack,
    list: list
  }
})();

(function() {
  document.addEventListener('DOMContentLoaded', function () {
    var iconKeys = Object.keys(tinymce.IconManager.list());
    if (iconKeys.length > 1) {
      var iconPacker = document.querySelector('.icon-packer');
      var select = document.createElement('select');
      iconKeys.forEach(function (key) {
        var option = document.createElement('option');
        option.value = key;
        option.innerText = key;
        select.appendChild(option);
      });

      select.value = tinymce.IconManager.getActiveIconPack();
      select.addEventListener('change', function (e) {
        tinymce.IconManager.setActiveIconPack(e.target.value);
      });

      iconPacker.appendChild(select);
    }
  })
})();

var tinymce = {};

tinymce.IconManager = (function() {
  var iconPacks = {};

  function add(name, payload) {
    iconPacks[name] = payload.icons;
    if (name === getActiveIconPack()) {
      injectIconPack(payload.icons);
    }
  }

  function getActiveIconPack() {
    return localStorage.getItem('active-icon-pack') || 'default';
  }

  function setActiveIconPack(packName) {
    if (iconPacks[packName]) {
      injectIconPack(iconPacks[packName]);
      localStorage.setItem('active-icon-pack', packName);
    }
  }

  function injectIconPack(iconPack) {
    document.querySelectorAll('svg').forEach((svg) => {
      if (iconPack[svg.getAttribute('data-name')]) {
        const div = document.createElement('div');
        div.innerHTML = iconPack[svg.getAttribute('data-name')];
        div.firstChild.setAttribute('data-name', svg.getAttribute('data-name'));
        svg.parentElement.insertBefore(div.firstChild, svg);
        svg.remove();
      }
    });
  }

  return {
    add,
    setActiveIconPack,
    getActiveIconPack
  }
})();

(function() {
  document.querySelector('select#icons-selector').value = tinymce.IconManager.getActiveIconPack();
  document.querySelector('select#icons-selector').addEventListener('change', function (e) {
    tinymce.IconManager.setActiveIconPack(e.target.value);
  });
})();
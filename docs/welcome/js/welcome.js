(function() {
  var init, isMobile, setupHero, _Drop;

  _Drop = Drop.createContext({
    classPrefix: 'drop'
  });

  isMobile = $(window).width() < 567;

  init = function() {
    return setupHero();
  };

  setupHero = function() {
    var $target, drop;
    $target = $('.drop-target');
    return drop = new _Drop({
      target: $target[0],
      classes: 'drop-theme-arrows',
      position: 'bottom left',
      constrainToWindow: true,
      openOn: 'click',
      content: '<div style="height: 50px; width: 50px"></div>'
    });
  };

  init();

}).call(this);

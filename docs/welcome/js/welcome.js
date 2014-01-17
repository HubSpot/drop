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
    var $target, drops, position, positions, _i, _len;
    $target = $('.drop-target');
    positions = ['top left', 'left top', 'left middle', 'left bottom', 'bottom left', 'bottom center', 'bottom right', 'right bottom', 'right middle', 'right top', 'top right', 'top center'];
    drops = {};
    for (_i = 0, _len = positions.length; _i < _len; _i++) {
      position = positions[_i];
      drops[position] = new _Drop({
        target: $target[0],
        classes: 'drop-theme-arrows-bounce',
        position: position,
        constrainToWindow: false,
        constrainToScrollParent: false,
        openOn: 'click',
        content: '<div style="height: 50px; width: 50px"></div>'
      });
    }
    return window.drops = drops;
  };

  init();

}).call(this);

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
    var drop1, drop2;
    drop1 = drop2 = void 0;
    drop1 = new _Drop({
      target: $('.drop-demo .drop-target')[0],
      classes: 'drop-theme-arrows-bounce',
      position: 'bottom right',
      constrainToWindow: false,
      constrainToScrollParent: false,
      openOn: 'click',
      content: '<div class="drop-target">Click Me</div>'
    });
    drop1.once('open', function() {
      return drop2 = new _Drop({
        target: $(drop1.dropContent).find('.drop-target')[0],
        classes: 'drop-theme-arrows-bounce',
        position: 'bottom left',
        constrainToWindow: false,
        constrainToScrollParent: false,
        openOn: 'click',
        content: '<div style="height: 100px; width: 100px"></div>'
      });
    });
    return drop1.on('close', function() {
      return typeof drop2.close === "function" ? drop2.close() : void 0;
    });
  };

  init();

}).call(this);

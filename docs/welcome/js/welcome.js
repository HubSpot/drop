(function() {
  var init, isMobile, setupExamples, setupHero, _Drop;

  _Drop = Drop.createContext({
    classPrefix: 'drop'
  });

  isMobile = $(window).width() < 567;

  init = function() {
    setupHero();
    return setupExamples();
  };

  setupHero = function() {
    var drop;
    drop = new _Drop({
      target: $('.hero .drop-target')[0],
      classes: 'drop-theme-arrows-bounce-dark drop-hero',
      position: 'bottom center',
      constrainToWindow: false,
      constrainToScrollParent: false,
      openOn: ' ',
      content: '<h1>Drop</h1>\n<h2>The best dropdown library on<br/>either side of the Mississippi.</h2>\n<p>\n    <a class="button" href="http://github.com/HubSpot/drop">★ On Github</a>\n</p>'
    });
    return $(function() {
      return setTimeout((function() {
        return drop.open();
      }), 500);
    });
  };

  setupExamples = function() {
    return $('.example').each(function() {
      var $example, $target, content, drop, theme;
      $example = $(this);
      theme = $example.data('theme');
      $target = $example.find('.drop-target');
      $target.addClass(theme);
      content = $example.find('.drop-content').html();
      return drop = new _Drop({
        target: $target[0],
        classes: theme,
        position: 'bottom center',
        constrainToWindow: true,
        constrainToScrollParent: false,
        openOn: 'click',
        content: content
      });
    });
  };

  init();

}).call(this);

(function() {
  var Evented, MIRROR_ATTACH, addClass, allDrops, clickEvents, createContext, extend, hasClass, removeClass, sortAttach, touchDevice, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = Tether.Utils, extend = _ref.extend, addClass = _ref.addClass, removeClass = _ref.removeClass, hasClass = _ref.hasClass, Evented = _ref.Evented;

  touchDevice = 'ontouchstart' in document.documentElement;

  clickEvents = ['click'];

  if (touchDevice) {
    clickEvents.push('touchstart');
  }

  sortAttach = function(str) {
    var first, second, _ref1, _ref2;
    _ref1 = str.split(' '), first = _ref1[0], second = _ref1[1];
    if (first === 'left' || first === 'right') {
      _ref2 = [second, first], first = _ref2[0], second = _ref2[1];
    }
    return [first, second].join(' ');
  };

  MIRROR_ATTACH = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
    middle: 'middle',
    center: 'center'
  };

  allDrops = {};

  createContext = function(options) {
    var DropInstance, defaultOptions, drop, _name;
    if (options == null) {
      options = {};
    }
    drop = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(DropInstance, arguments, function(){});
    };
    extend(drop, {
      createContext: createContext,
      drops: [],
      defaults: {}
    });
    defaultOptions = {
      classPrefix: 'drop',
      defaults: {
        position: 'bottom left',
        openOn: 'click',
        constrainToScrollParent: true,
        constrainToWindow: true,
        classes: '',
        tetherOptions: {}
      }
    };
    extend(drop, defaultOptions, options);
    extend(drop.defaults, defaultOptions.defaults, options.defaults);
    if (allDrops[_name = drop.classPrefix] == null) {
      allDrops[_name] = [];
    }
    drop.updateBodyClasses = function() {
      var anyOpen, _drop, _i, _len, _ref1;
      anyOpen = false;
      _ref1 = allDrops[drop.classPrefix];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _drop = _ref1[_i];
        if (!(_drop.isOpened())) {
          continue;
        }
        anyOpen = true;
        break;
      }
      if (anyOpen) {
        return addClass(document.body, "" + drop.classPrefix + "-open");
      } else {
        return removeClass(document.body, "" + drop.classPrefix + "-open");
      }
    };
    DropInstance = (function(_super) {
      __extends(DropInstance, _super);

      function DropInstance(options) {
        this.options = options;
        this.options = extend({}, drop.defaults, this.options);
        this.target = this.options.target;
        if (this.target == null) {
          throw new Error('Drop Error: You must provide a target.');
        }
        if (this.options.classes) {
          addClass(this.target, this.options.classes);
        }
        drop.drops.push(this);
        allDrops[drop.classPrefix].push(this);
        this.setupElements();
        this.setupEvents();
        this.setupTether();
      }

      DropInstance.prototype.setupElements = function() {
        this.drop = document.createElement('div');
        addClass(this.drop, drop.classPrefix);
        if (this.options.classes) {
          addClass(this.drop, this.options.classes);
        }
        this.dropContent = document.createElement('div');
        addClass(this.dropContent, "" + drop.classPrefix + "-content");
        if (typeof this.options.content === 'object') {
          this.dropContent.appendChild(this.options.content);
        } else {
          this.dropContent.innerHTML = this.options.content;
        }
        return this.drop.appendChild(this.dropContent);
      };

      DropInstance.prototype.setupTether = function() {
        var constraints, dropAttach;
        dropAttach = this.options.position.split(' ');
        dropAttach[0] = MIRROR_ATTACH[dropAttach[0]];
        dropAttach = dropAttach.join(' ');
        constraints = [];
        if (this.options.constrainToScrollParent) {
          constraints.push({
            to: 'scrollParent',
            pin: 'top, bottom',
            attachment: 'together none'
          });
        } else {
          constraints.push({
            to: 'scrollParent'
          });
        }
        if (this.options.constrainToWindow !== false) {
          constraints.push({
            to: 'window',
            pin: true,
            attachment: 'together'
          });
        } else {
          constraints.push({
            to: 'window'
          });
        }
        options = {
          element: this.drop,
          target: this.target,
          attachment: sortAttach(dropAttach),
          targetAttachment: sortAttach(this.options.position),
          classPrefix: drop.classPrefix,
          offset: '0 0',
          targetOffset: '0 0',
          enabled: false,
          constraints: constraints
        };
        if (this.options.tether !== false) {
          return this.tether = new Tether(extend({}, options, this.options.tether));
        }
      };

      DropInstance.prototype.setupEvents = function() {
        var clickEvent, events, onUs, out, outTimeout, over, _i, _len,
          _this = this;
        if (!this.options.openOn) {
          return;
        }
        events = this.options.openOn.split(' ');
        if (__indexOf.call(events, 'click') >= 0) {
          for (_i = 0, _len = clickEvents.length; _i < _len; _i++) {
            clickEvent = clickEvents[_i];
            this.target.addEventListener(clickEvent, function(event) {
              _this.toggle();
              return event.preventDefault();
            });
            document.addEventListener(clickEvent, function(event) {
              if (!_this.isOpened()) {
                return;
              }
              if (event.target === _this.drop || _this.drop.contains(event.target)) {
                return;
              }
              if (event.target === _this.target || _this.target.contains(event.target)) {
                return;
              }
              return _this.close();
            });
          }
        }
        if (__indexOf.call(events, 'hover') >= 0) {
          onUs = false;
          over = function() {
            onUs = true;
            return _this.open();
          };
          outTimeout = null;
          out = function() {
            onUs = false;
            if (outTimeout != null) {
              clearTimeout(outTimeout);
            }
            return outTimeout = setTimeout(function() {
              if (!onUs) {
                _this.close();
              }
              return outTimeout = null;
            }, 50);
          };
          this.target.addEventListener('mouseover', over);
          this.drop.addEventListener('mouseover', over);
          this.target.addEventListener('mouseout', out);
          return this.drop.addEventListener('mouseout', out);
        }
      };

      DropInstance.prototype.isOpened = function() {
        return hasClass(this.drop, "" + drop.classPrefix + "-open");
      };

      DropInstance.prototype.toggle = function() {
        if (this.isOpened()) {
          return this.close();
        } else {
          return this.open();
        }
      };

      DropInstance.prototype.open = function() {
        var _ref1,
          _this = this;
        if (!this.drop.parentNode) {
          document.body.appendChild(this.drop);
        }
        if ((_ref1 = this.tether) != null) {
          _ref1.enable();
        }
        addClass(this.drop, "" + drop.classPrefix + "-open");
        addClass(this.drop, "" + drop.classPrefix + "-open-transitionend");
        setTimeout(function() {
          return addClass(_this.drop, "" + drop.classPrefix + "-after-open");
        });
        this.tether.position();
        this.trigger('open');
        return drop.updateBodyClasses();
      };

      DropInstance.prototype.close = function() {
        var _ref1,
          _this = this;
        removeClass(this.drop, "" + drop.classPrefix + "-open");
        removeClass(this.drop, "" + drop.classPrefix + "-after-open");
        this.drop.addEventListener('transitionend', function() {
          if (!hasClass(_this.drop, "" + drop.classPrefix + "-open")) {
            return removeClass(_this.drop, "" + drop.classPrefix + "-open-transitionend");
          }
        });
        this.trigger('close');
        if ((_ref1 = this.tether) != null) {
          _ref1.disable();
        }
        return drop.updateBodyClasses();
      };

      return DropInstance;

    })(Evented);
    return drop;
  };

  window.Drop = createContext();

  document.addEventListener('DOMContentLoaded', function() {
    return Drop.updateBodyClasses();
  });

}).call(this);

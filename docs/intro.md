<link rel="stylesheet" href="/drop/css/drop-theme-basic.css" />
<link rel="stylesheet" href="/drop/css/drop-theme-arrows-bounce.css" />
<link rel="stylesheet" href="/drop/css/drop-theme-arrows-bounce-dark.css" />
<script src="/drop/drop.min.js"></script>
<script>$(function(){ $('.drop-target').each(function(){ var options = $.extend({}, { target: this, classes: 'drop-theme-arrows-bounce-dark', position: 'bottom left', constrainToWindow: true, constrainToScrollParent: true, openOn: 'click' }, $(this).data('options')); $(this).data('drop', new Drop(options); })); });</script>

## Drop

Drop is an extremely powerful javascript and CSS library for creating dropdowns and other floating displays. Drops use [Tether.js](http://github.hubspot.com/tether) to efficiently position themselves.

### Features

Because Drop is built on [Tether](http://github.hubspot.com/tether), you get all of the benefits of its effecient and powerful positioning.

- Automatically repositions on page resizes and scrolls.
- Highly efficicient and precise positioning.
    - Positioning done with `transform: translate` to avoid repaints, always supporting `60fps` scrolling, even with many drops open at the same time.
- Automatic collision detection with the edge of the page means your dropdowns are never cut off by the edge of the page and can even flip up/down or left/right automatically.
- Flexible animation structure supports all possible CSS transitions for opening and closing, or if desired, no animation at all.
- Drops can be opened/closed with click or mouseover/out.
- Drops can be nested within other drops.
- Drops can be attached to any of 12 attachment points on the target.
- Attachment points can be tweaked for perfect alignment using custom offsets.
- Drops look and work great with other Tether libraries, including [Select](http://github.hubspot.com/select/docs/welcome/select), [Tooltip](http://github.hubspot.com/tooltip/docs/welcome/select), and [Shepherd](http://github.hubspot.com/shepherd/docs/welcome/select).

### Dependencies

None!

### Browser Support

IE9+ and all modern browsers

### Initialization

To initialize a drop, simply create a `new Drop`, specifying the target to attach it to.

```coffeescript
drop = new Drop
    target: document.querySelector('.drop-target')
```

### Methods

These can be called on the `drop` instance returned when creating a drop.

#### `open`

Opens the drop. Specifically, this adds `drop-open` and other classes to the drop.

#### `close`

Opens the drop. Specifically, this removes `drop-open` and other classes from the drop. Closed drops will still remain in the DOM.

#### `toggle`

Will close the drop if opened, and open if closed.

#### `isOpened`

Returns true if the drop is openened.

### Options

The default options are:

```coffeescript
defaultOptions =
    attach: 'bottom left'
    openOn: 'click'
    constrainToWindow: true
    constrainToScrollParent: true
    classes: ''
    tetherOptions: {}
```

#### `attach`

Attach specifies the attachment point (on the target) to attach the drop to. Options include:

```coffeescript
'top left'
'left top'
'left middle'
'left bottom'
'bottom left'
'bottom center'
'bottom right'
'right bottom'
'right middle'
'right top'
'top right'
'top center'
```

More information about attachment can be found in the [Tether documentation](http://github.hubspot.com/tether).

#### `openOn`

Specifies what event on the target opens the drop. If you set this to `undefined` or `null` you will need to manually call `.open()`/`.close()` on the `drop` instance.

```coffeescript
'click'
'hover'
```

#### `constrainToWindow`

If set to `true`, uses [Tether's](http://github.hubspot.com/tether) `constraints` list to keep the drop within the visible window, or viewport. This will cause drops with bottom attachments to switch to top when colliding with the bottom of the page and vice-versa. Dropdowns will also pin to the edge of the window if the user scrolls away from the target after opening a drop.

```coffeescript
true
false
```

#### `constrainToScrollParent`

Similar to `constrainToWindow` but for the target element's first scroll parent, that is the first parent which has `overflow: auto` or `overflow: scroll` set, or the body, whichever comes first.

#### `classes`

Additional class names to be added to the drop. These can be set to apply a theme (for example, [`drop-theme-arrows-bounce-dark`](https://github.com/HubSpot/drop/blob/master/css/drop-theme-arrows-bounce-dark.css)) and/or they can be set to apply custom styling to child elements of the drop.

#### `tetherOptions`

Additional options can be passed to customize Drop even further. These will get passed to the underlying Tether instance used to position the drop. See the the [Tether documentation](http://github.hubspot.com/tether) for more information.

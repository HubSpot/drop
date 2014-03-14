{extend, addClass, removeClass, hasClass, Evented} = Tether.Utils

touchDevice = 'ontouchstart' of document.documentElement
clickEvents = ['click']
clickEvents.push('touchstart') if touchDevice

sortAttach = (str) ->
  [first, second] = str.split(' ')

  if first in ['left', 'right']
    [first, second] = [second, first]

  [first, second].join(' ')

MIRROR_ATTACH =
  left: 'right'
  right: 'left'
  top: 'bottom'
  bottom: 'top'
  middle: 'middle'
  center: 'center'

allDrops = {}

removeFromArray = (arr, item) ->
  while (index = arr.indexOf(item)) isnt -1
    arr.splice index, 1

# Drop can be included in external libraries.  Calling createContext gives you a fresh
# copy of drop which won't interact with other copies on the page (beyond calling the document events).
createContext = (options={}) ->
  drop = ->
    new DropInstance arguments...

  extend drop,
    createContext: createContext
    drops: []
    defaults: {}

  defaultOptions =
    classPrefix: 'drop'
    defaults:
      position: 'bottom left'
      openOn: 'click'
      constrainToScrollParent: true
      constrainToWindow: true
      classes: ''
      remove: false
      tetherOptions: {}

  extend drop, defaultOptions, options
  extend drop.defaults, defaultOptions.defaults, options.defaults

  allDrops[drop.classPrefix] ?= []

  drop.updateBodyClasses = ->
    # There is only one body, so despite the context concept, we still iterate through all
    # drops which share our classPrefix.

    anyOpen = false
    for _drop in allDrops[drop.classPrefix] when _drop.isOpened()
      anyOpen = true
      break

    if anyOpen
      addClass document.body, "#{ drop.classPrefix }-open"
    else
      removeClass document.body, "#{ drop.classPrefix }-open"

  class DropInstance extends Evented
    constructor: (@options) ->
      @options = extend {}, drop.defaults, @options

      {@target} = @options

      unless @target?
        throw new Error 'Drop Error: You must provide a target.'

      if @options.classes
        addClass @target, @options.classes

      drop.drops.push @
      allDrops[drop.classPrefix].push @

      @_boundEvents = []

      @setupElements()
      @setupEvents()
      @setupTether()

    _on: (element, event, handler, useCapture) ->
      @_boundEvents.push {element, event, handler, useCapture}

      element.addEventListener event, handler, useCapture

    setupElements: ->
      @drop = document.createElement 'div'
      addClass @drop, drop.classPrefix

      if @options.classes
        addClass @drop, @options.classes

      @content = document.createElement 'div'
      addClass @content, "#{ drop.classPrefix }-content"
      if typeof @options.content is 'object'
        @content.appendChild @options.content
      else
        @content.innerHTML = @options.content

      @drop.appendChild @content

    setupTether: ->
      # Tether expects two attachment points, one in the target element, one in the
      # drop.  We use a single one, and use the order as well, to allow us to put
      # the drop on either side of any of the four corners.  This magic converts between
      # the two:
      dropAttach = @options.position.split(' ')
      dropAttach[0] = MIRROR_ATTACH[dropAttach[0]]
      dropAttach = dropAttach.join(' ')

      constraints = []
      if @options.constrainToScrollParent
        constraints.push
          to: 'scrollParent'
          pin: 'top, bottom'
          attachment: 'together none'
      else
        # To get 'out of bounds' classes
        constraints.push
          to: 'scrollParent'

      if @options.constrainToWindow isnt false
        constraints.push
          to: 'window'
          attachment: 'together'
      else
        # To get 'out of bounds' classes
        constraints.push
          to: 'window'

      options =
        element: @drop
        target: @target
        attachment: sortAttach(dropAttach)
        targetAttachment: sortAttach(@options.position)
        classPrefix: drop.classPrefix
        offset: '0 0'
        targetOffset: '0 0'
        enabled: false
        constraints: constraints

      if @options.tetherOptions isnt false
        @tether = new Tether extend {}, options, @options.tetherOptions

    setupEvents: ->
      return unless @options.openOn
      if @options.openOn is 'always'
        setTimeout @open.bind(@)
        return

      events = @options.openOn.split ' '

      if 'click' in events
        openHandler = (event) =>
          @toggle()
          event.preventDefault()

        closeHandler = (event) =>
          return unless @isOpened()

          # Clicking inside dropdown
          if event.target is @drop or @drop.contains(event.target)
            return

          # Clicking target
          if event.target is @target or @target.contains(event.target)
            return

          for tether in @tether.attachedTethers
            if event.target is tether.element or tether.element.contains(event.target)
              return

          setTimeout(@close.bind @, 0)

        for clickEvent in clickEvents
          @_on @target, clickEvent, openHandler
          @_on document, clickEvent, closeHandler, true

      if 'hover' in events
        onUs = false

        over = =>
          onUs = true

          @open()

        outTimeout = null
        out = =>
          onUs = false

          clearTimeout outTimeout if outTimeout?
          outTimeout = setTimeout =>
            if not onUs
              @close()

            outTimeout = null
          , 50

        @_on @target, 'mouseover', over
        @_on @drop, 'mouseover', over
        @_on @target, 'mouseout', out
        @_on @drop, 'mouseout', out

    isOpened: ->
      hasClass @drop, "#{ drop.classPrefix }-open"

    toggle: ->
      if @isOpened()
        @close()
      else
        @open()

    open: ->
      return if @wasDestroyed or @isOpened()

      unless @drop.parentNode
        document.body.appendChild @drop

      @tether?.enable()

      addClass @drop, "#{ drop.classPrefix }-open"
      addClass @drop, "#{ drop.classPrefix }-open-transitionend"

      setTimeout =>
        addClass @drop, "#{ drop.classPrefix }-after-open"

      @tether?.position()

      @trigger 'open'

      drop.updateBodyClasses()

    close: ->
      return if @wasDestroyed or not @isOpened()

      removeClass @drop, "#{ drop.classPrefix }-open"
      removeClass @drop, "#{ drop.classPrefix }-after-open"

      @drop.addEventListener 'transitionend', handler = =>
        unless hasClass @drop, "#{ drop.classPrefix }-open"
          removeClass @drop, "#{ drop.classPrefix }-open-transitionend"

        @drop.removeEventListener 'transitionend', handler

      @trigger 'close'

      @tether?.disable()

      drop.updateBodyClasses()

      if @options.remove
        @remove()

    remove: ->
      @close()

      @drop.parentNode?.removeChild(@drop)

    position: ->
      if @isOpened()
        @tether?.position()

    destroy: ->
      @remove()

      @tether?.destroy()

      for {element, event, handler, useCapture} in @_boundEvents
        element.removeEventListener event, handler, useCapture

      @_boundEvents = []

      @tether = null
      @drop = null
      @content = null
      @target = null
      @wasDestroyed = true

      removeFromArray allDrops[drop.classPrefix], @
      removeFromArray drop.drops, @

  drop

window.Drop = createContext()

document.addEventListener 'DOMContentLoaded', ->
  Drop.updateBodyClasses()

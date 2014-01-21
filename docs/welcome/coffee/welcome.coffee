_Drop = Drop.createContext classPrefix: 'drop'

isMobile = $(window).width() < 567

init = ->
    setupHero()

setupHero = ->
    drop1 = drop2 = undefined

    drop1 = new _Drop
        target: $('.drop-demo .drop-target')[0]
        classes: 'drop-theme-arrows-bounce'
        position: 'bottom right'
        constrainToWindow: false
        constrainToScrollParent: false
        openOn: 'click'
        content: '<div class="drop-target">Click Me</div>'

    drop1.once 'open', ->
        drop2 = new _Drop
            target: $(drop1.dropContent).find('.drop-target')[0]
            classes: 'drop-theme-arrows-bounce'
            position: 'bottom left'
            constrainToWindow: false
            constrainToScrollParent: false
            openOn: 'click'
            content: '<div style="height: 100px; width: 100px"></div>'

    drop1.on 'close', ->
        drop2.close?()

init()

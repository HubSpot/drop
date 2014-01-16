_Drop = Drop.createContext classPrefix: 'drop'

isMobile = $(window).width() < 567

init = ->
    setupHero()

setupHero = ->
    $target = $('.drop-target')

    drop = new _Drop
        target: $target[0]
        classes: 'drop-theme-arrows' # TEMPORARY
        position: 'bottom left'
        constrainToWindow: true
        openOn: 'click'
        content: '<div style="height: 50px; width: 50px"></div>'

init()
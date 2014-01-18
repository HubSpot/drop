_Drop = Drop.createContext classPrefix: 'drop'

isMobile = $(window).width() < 567

init = ->
    setupHero()

setupHero = ->
    $target = $('.drop-target')

    positions = [
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
    ]

    for position in positions
        new _Drop
            target: $target[0]
            classes: 'drop-theme-arrows-bounce'
            position: position
            constrainToWindow: false
            constrainToScrollParent: false
            openOn: 'click'
            content: '<div style="height: 50px; width: 50px"></div>'

init()

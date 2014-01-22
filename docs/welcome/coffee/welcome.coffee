_Drop = Drop.createContext classPrefix: 'drop'

isMobile = $(window).width() < 567

init = ->
    setupHero()
    setupExamples()

setupHero = ->
    drop = new _Drop
        target: $('.hero .drop-target')[0]
        classes: 'drop-theme-arrows-bounce-dark drop-hero'
        position: 'bottom center'
        constrainToWindow: false
        constrainToScrollParent: false
        openOn: ' '
        content: '''
            <h1>Drop</h1>
            <h2>The best dropdown library on<br/>either side of the Mississippi.</h2>
            <p>
                <a class="button" href="http://github.com/HubSpot/drop">★ On Github</a>
            </p>
        '''

    $ -> setTimeout (-> drop.open()), 500

setupExamples = ->
    $('.example').each ->
        $example = $ @
        theme = $example.data('theme')
        openOn = $example.data('open-on') or 'click'

        $target = $example.find('.drop-target')
        $target.addClass theme

        content = $example.find('.drop-content').html()

        drop = new _Drop
            target: $target[0]
            classes: theme
            position: 'bottom center'
            constrainToWindow: true
            constrainToScrollParent: false
            openOn: openOn
            content: content

init()

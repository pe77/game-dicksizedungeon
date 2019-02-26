var baseUrl = './';

// require config
requirejs.config({
    waitSeconds : 0,
    baseUrl: baseUrl,
    paths: {
        // app principal
        Game: 'dist/build',

        'utils':           'js/utils/generics',
        'js-extends':      'js/utils/extends',
        'jquery':          'node_modules/jquery/dist/jquery.min',
        'Phaser':          'node_modules/phaser/dist/phaser.min',
    },
    packages: [
        { 'name': 'lodash', 'location': 'node_modules/lodash-amd' }
    ],
    shim: {
        'Game' : {
            deps: ['utils', 'js-extends', 'lodash', 'Phaser', 'jquery']
        }
    }
      
});

requirejs(['Game'], function(){ // load script
    require(['game/Game']); // load module
});
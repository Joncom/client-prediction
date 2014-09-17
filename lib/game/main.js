ig.module('game.main')
.requires(
    'game.predict-test',
    'impact.game',
    'impact.font'
)
.defines(function(){

    MyGame = ig.Game.extend({

        // Load a font
        font: new ig.Font( 'media/04b03.font.png' ),
        clearColor: 'WHITE',


        init: function() {

            ig.input.bind(ig.KEY.UP_ARROW, 'UP');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'DOWN');
            ig.input.bind(ig.KEY.LEFT_ARROW, 'LEFT');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'RIGHT');

            /*
            frame = new JFrame(); // JFrame frame = new JFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setBounds(100, 100, 640, 480);
            frame.add(renderer);
            frame.setVisible(true);

            renderer.requestFocusInWindow();
            */
        },

        update: function() {
            this.parent();
            server.gameLoop();
            client.gameLoop(server);
        },

        draw: function() {
            this.parent();
            renderer.prototype.paintComponent();
        }

    });

    // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});

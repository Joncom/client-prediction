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


        init: function() {

            ig.input.bind(ig.KEY.UP_ARROW, 'UP');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'DOWN');
            ig.input.bind(ig.KEY.LEFT_ARROW, 'LEFT');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'RIGHT');

            /*
            renderer.addKeyListener(ig.Class.extend({ // renderer.addKeyListener(new KeyAdapter() {

                //Override: // @Override
                keyPressed: function(e) { // public void keyPressed(KeyEvent e) {
                    keyState[e.getKeyCode()] = true;
                },

                //Override: // @Override
                keyReleased: function(e) { // public void keyReleased(KeyEvent e) {
                    keyState[e.getKeyCode()] = false;
                }
            }));


            frame = new JFrame(); // JFrame frame = new JFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setBounds(100, 100, 640, 480);
            frame.add(renderer);
            frame.setVisible(true);

            renderer.requestFocusInWindow();
            */

            client.gameLoop(server);
        },

        update: function() {
            this.parent();
            server.gameLoop();
        },

        draw: function() {
            this.parent();

            // Add your own drawing code here
            var x = ig.system.width/2,
                y = ig.system.height/2;

            this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
        }

    });

    // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});

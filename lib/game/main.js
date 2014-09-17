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

            // TODO: Bind keys as needed to replace keyState.

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
            */

            frame = new JFrame(); // JFrame frame = new JFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setBounds(100, 100, 640, 480);
            frame.add(renderer);
            frame.setVisible(true);

            renderer.requestFocusInWindow();

            new Thread(ig.Class.extend({ // new Thread(new Runnable() {

                run: function() { // public void run() {
                    server.gameLoop();
                }
            })).start();

            client.gameLoop(server);
        },

        update: function() {
            // Update all entities and backgroundMaps
            this.parent();

            // Add your own, additional update code here
        },

        draw: function() {
            // Draw all entities and backgroundMaps
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

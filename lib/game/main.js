ig.module('game.main')
.requires(
    'game.predict-test',
    'impact.debug.debug',
    'impact.game'
)
.defines(function(){

    TRESHOLD = 0.2; // static final float TRESHOLD = 0.2f;
    keyState = new Array(0xffff); // static final boolean[] keyState = new boolean[0xffff];
    server = new Server(); // static Server server = new Server();
    client = new Client(); // static Client client = new Client();

    MyGame = ig.Game.extend({

        clearColor: 'WHITE',

        init: function() {
            ig.input.bind(ig.KEY.UP_ARROW, 'UP');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'DOWN');
            ig.input.bind(ig.KEY.LEFT_ARROW, 'LEFT');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'RIGHT');
        },

        update: function() {
            this.parent();
            server.update();
            client.update(server);
        },

        draw: function() {
            this.parent();

            this.drawPlayer(server.currentState.state, 'BLUE');
            this.drawPlayer(client.interpolatedState.newestState.state, 'RED');
            this.drawPlayer(client.interpolatedState.currentState.state, 'GREEN');
            this.drawPlayer(client.predictedState.currentState.state, 'BLACK');
        },

        drawPlayer: function(state, color) {
            var context = ig.system.context;
            context.fillStyle = color;
            context.fillRect(parseInt(state.x, 10) - 10, parseInt(state.y, 10) - 10, 20, 20); // g.fillOval((int) state.x - 10, (int) state.y - 10, 20, 20);
        }

    });

    // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});

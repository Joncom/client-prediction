ig.module('game.main')
.requires(
    'game.client',
    'game.server',
    'impact.debug.debug',
    'impact.game'
)
.defines(function(){

    // http://www.java-gaming.org/topics/client-side-prediction-and-delayed-interpolation/25446/view.html

    TRESHOLD = 0.2; // static final float TRESHOLD = 0.2f;
    server = new Server(); // static Server server = new Server();
    client = new Client(); // static Client client = new Client();

    /** Updates state using input to the specified time */
    updateState = function(state, timedInput, doCollisions) { // static TimedState updateState(TimedState state, TimedInput timedInput, boolean doCollisions) {
        var timeDeltaMillis = timedInput.time - state.time; // long timeDeltaMillis = timedInput.time - state.time;
        var x = state.state.x + timedInput.input.vx * timeDeltaMillis / 1000; // float x = state.state.x + timedInput.input.vx * timeDeltaMillis / 1000f;
        var y = state.state.y + timedInput.input.vy * timeDeltaMillis / 1000; // float y = state.state.y + timedInput.input.vy * timeDeltaMillis / 1000f;
        // do only on server
        if (doCollisions) {
            x = Math.min(400, x);
        }
        var newState = new TimedState(timedInput.time, new State(x, y)); // TimedState newState = new TimedState(timedInput.time, new State(x, y));
        return newState;
    };

    /**
     * Tests client side prediction by emulating client/server with delayed packages.
     */

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

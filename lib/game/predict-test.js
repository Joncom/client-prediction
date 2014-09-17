ig.module('game.predict-test')
.requires(
    'game.client',
    'game.server'
)
.defines(function(){

    // http://www.java-gaming.org/topics/client-side-prediction-and-delayed-interpolation/25446/view.html

    /*
    import java.awt.Color;
    import java.awt.Graphics;
    import java.awt.event.KeyAdapter;
    import java.awt.event.KeyEvent;
    import java.util.ArrayList;
    import java.util.Collections;
    import java.util.List;
    import javax.swing.JComponent;
    import javax.swing.JFrame;
    */

    /**
     * Tests client side prediction by emulating client/server with delayed packages.
     */

    TRESHOLD = 0.2; // static final float TRESHOLD = 0.2f;
    keyState = new Array(0xffff); // static final boolean[] keyState = new boolean[0xffff];
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

});

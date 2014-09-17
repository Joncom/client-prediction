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

    renderer = ig.Class.extend({ // static JComponent renderer = new JComponent() {

        //Override: // @Override
        paintComponent: function(g) { // public void paintComponent(Graphics g) {
            // g.setColor(Color.WHITE);
            // g.fillRect(0, 0, getWidth(), getHeight());
            this.drawPlayer(g, server.currentState.state, Color.BLUE.darker()); // drawPlayer(g, server.currentState.state, Color.BLUE.darker());
            this.drawPlayer(g, client.interpolatedState.newestState.state, Color.RED.darker()); // drawPlayer(g, client.interpolatedState.newestState.state, Color.RED.darker());
            this.drawPlayer(g, client.interpolatedState.currentState.state, Color.GREEN.darker()); // drawPlayer(g, client.interpolatedState.currentState.state, Color.GREEN.darker());
            this.drawPlayer(g, client.predictedState.currentState.state, Color.BLACK); // drawPlayer(g, client.predictedState.currentState.state, Color.BLACK);
            //g.drawLine(400, 0, 400, getHeight()); // g.drawLine(400, 0, 400, getHeight());
        },

        drawPlayer: function(g, state, color) { // void drawPlayer(Graphics g, State state, Color color) {
            g.setColor(color);
            g.fillOval(parseInt(state.x, 10) - 10, parseInt(state.y, 10) - 10, 20, 20); // g.fillOval((int) state.x - 10, (int) state.y - 10, 20, 20);
        }
    });

    sleep = function(millis) { // static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (ex) { // } catch (Exception ex) {
            ex.printStackTrace();
        }
    };

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

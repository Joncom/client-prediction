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
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, getWidth(), getHeight());
            drawPlayer(g, server.currentState.state, Color.BLUE.darker());
            drawPlayer(g, client.interpolatedState.newestState.state, Color.RED.darker());
            drawPlayer(g, client.interpolatedState.currentState.state, Color.GREEN.darker());
            drawPlayer(g, client.predictedState.currentState.state, Color.BLACK);
            g.drawLine(400, 0, 400, getHeight());
        },

        drawPlayer: function(g, state, color) { // void drawPlayer(Graphics g, State state, Color color) {
            g.setColor(color);
            g.fillOval(parseInt(state.x, 10) - 10, parseInt(state.y, 10) - 10, 20, 20); // g.fillOval((int) state.x - 10, (int) state.y - 10, 20, 20);
        }
    });

    main = function(args) { // public static void main(String[] args) {
        renderer.addKeyListener(new ig.Class.extend({ // renderer.addKeyListener(new KeyAdapter() {

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

        new Thread(ig.Class.extend({ // new Thread(new Runnable() {

            run: function() { // public void run() {
                server.gameLoop();
            }
        })).start();

        client.gameLoop(server);
    };

    sleep = function(millis) { // static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (ex) { // } catch (Exception ex) {
            ex.printStackTrace();
        }
    };

    /** Updates state using input to the specified time */
    updateState = function(state, timedInput, doCollisions) { // static TimedState updateState(TimedState state, TimedInput timedInput, boolean doCollisions) {
        timeDeltaMillis = timedInput.time - state.time; // long timeDeltaMillis = timedInput.time - state.time;
        x = state.state.x + timedInput.input.vx * timeDeltaMillis / 1000; // float x = state.state.x + timedInput.input.vx * timeDeltaMillis / 1000f;
        y = state.state.y + timedInput.input.vy * timeDeltaMillis / 1000; // float y = state.state.y + timedInput.input.vy * timeDeltaMillis / 1000f;
        // do only on server
        if (doCollisions) {
            x = Math.min(400, x);
        }
        newState = new TimedState(timedInput.time, new State(x, y)); // TimedState newState = new TimedState(timedInput.time, new State(x, y));
        return newState;
    };


    Input = ig.Class.extend({ // static class Input {
        vx: null, // final float vx;
        vy: null, // final float vy;

        init: function(vx, vy) { // public Input(float vx, float vy) {
            this.vx = vx;
            this.vy = vy;
        }
    });


    TimedInput = ig.Class.extend({ // static class TimedInput {

        time: null, // final long time;
        input: null, // final Input input;

        init: function(time, input) { // public TimedInput(long time, Input input) {
            this.time = time;
            this.input = input;
        }
    });


    InputAndState = ig.Class.extend({ // static class InputAndState {
        input: null, // final Input input;
        timedState: null, // final TimedState timedState;

        init: function(input, timedState) { // public InputAndState(Input input, TimedState timedState) {
            this.input = input;
            this.timedState = timedState;
        },

        getTimedInput: function() { // TimedInput getTimedInput() {
            return new TimedInput(timedState.time, input);
        }
    });

});

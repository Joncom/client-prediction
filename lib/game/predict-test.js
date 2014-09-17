ig.module('game.predict-test')
.requires()
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
    PredictTest = ig.Class.extend({ // public class PredictTest extends JComponent {

        TRESHOLD: 0.2, // static final float TRESHOLD = 0.2f;
        keyState: new Array(0xffff), // static final boolean[] keyState = new boolean[0xffff];
        server: new Server(), // static Server server = new Server();
        client: new Client(), // static Client client = new Client();
        renderer: new ig.Class.extend({ // static JComponent renderer = new JComponent() {

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
        }),

        main: function(args) { // public static void main(String[] args) {
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
        },

        sleep: function(millis) { // static void sleep(long millis) {
            try {
                Thread.sleep(millis);
            } catch (ex) { // } catch (Exception ex) {
                ex.printStackTrace();
            }
        },

        /** Updates state using input to the specified time */
        updateState: function(state, timedInput, doCollisions) { // static TimedState updateState(TimedState state, TimedInput timedInput, boolean doCollisions) {
            timeDeltaMillis = timedInput.time - state.time; // long timeDeltaMillis = timedInput.time - state.time;
            x = state.state.x + timedInput.input.vx * timeDeltaMillis / 1000; // float x = state.state.x + timedInput.input.vx * timeDeltaMillis / 1000f;
            y = state.state.y + timedInput.input.vy * timeDeltaMillis / 1000; // float y = state.state.y + timedInput.input.vy * timeDeltaMillis / 1000f;
            // do only on server
            if (doCollisions) {
                x = Math.min(400, x);
            }
            newState = new TimedState(timedInput.time, new State(x, y)); // TimedState newState = new TimedState(timedInput.time, new State(x, y));
            return newState;
        },


        Client: ig.Class.extend({ // static class Client {
            predictedState: new PredictedState(new TimedState(0, new State(0, 0))), // PredictedState predictedState = new PredictedState(new TimedState(0, new State(0, 0)));
            interpolatedState: new InterpolatedState(), // InterpolatedState interpolatedState = new InterpolatedState();

            gameLoop: function(server) { // void gameLoop(Server server) {
                predictedState = new PredictedState(new TimedState(System.currentTimeMillis(), server.currentState.state));
                while (true) {
                    dx = (keyState[KeyEvent.VK_LEFT] ? -150 : 0) + (keyState[KeyEvent.VK_RIGHT] ? 150 : 0); // float dx = (keyState[KeyEvent.VK_LEFT] ? -150 : 0) + (keyState[KeyEvent.VK_RIGHT] ? 150 : 0);
                    dy = (keyState[KeyEvent.VK_UP] ? -150 : 0) + (keyState[KeyEvent.VK_DOWN] ? 150 : 0); // float dy = (keyState[KeyEvent.VK_UP] ? -150 : 0) + (keyState[KeyEvent.VK_DOWN] ? 150 : 0);
                    now = System.currentTimeMillis(); // long now = System.currentTimeMillis();
                    timedInput = new TimedInput(now, new Input(dx, dy)); // TimedInput timedInput = new TimedInput(now, new Input(dx, dy));
                    server.in.add(timedInput);
                    timedStateFromServer = server.out.remove(); // TimedState timedStateFromServer = server.out.remove();
                    predictedState.update(timedInput, timedStateFromServer);
                    interpolatedState.update(now, timedStateFromServer);
                    renderer.repaint();
                    sleep(16);
                }
            }
        }),


        Server: ig.Class.extend({ // static class Server {

            "in": new DelayedFifo(), // DelayedFifo<TimedInput> in = new DelayedFifo();
            "out": new DelayedFifo(), // DelayedFifo<TimedState> out = new DelayedFifo();

            currentState: null, // TimedState currentState;

            init: function() { // Server() {
                currentState = new TimedState(0, new State(100, 100));
            },

            gameLoop: function() { // void gameLoop() {
                while (true) {
                    tick();
                    renderer.repaint();
                    // run server at 10hz
                    sleep(100);
                }
            },

            tick: function() { // private void tick() {
                while (true) {
                    timedInput = this.in.remove(); // TimedInput timedInput = in.remove();
                    if (timedInput === null) { // if (timedInput == null) {
                        break;
                    }
                    currentState = updateState(currentState, timedInput, true);
                }

                this.out.add(currentState);
            }
        }),


        DelayedFifo: ig.Class.extend({ // static class DelayedFifo<T> {

            list: Collections.synchronizedList(new ArrayList()), // List<TimedEntry> list = Collections.synchronizedList(new ArrayList());

            add: function(object) { // void add(final T object) {
                this.list.add(new TimedEntry(System.currentTimeMillis() + getDelay(), object));
            },

            remove: function() { // T remove() {
                if (this.list.isEmpty()) {
                    return null;
                }

                entry = this.list.get(0); // TimedEntry entry = list.get(0);
                if (System.currentTimeMillis() > entry.time) {
                    return list.remove(0).object; // return (T) list.remove(0).object;
                }
                return null;
            },

            getDelay: function() { // private long getDelay() {
                return 300 + Math.parseInt((Math.random() * 100), 10); // return 300 + (int) (Math.random() * 100);
            },

            TimedEntry: new ig.Class.extend({ // class TimedEntry {

                time: null, // long time;
                object: null, // Object object;

                init: function(time, object) { // TimedEntry(long time, Object object) {
                    this.time = time;
                    this.object = object;
                }
            })
        }),


        Input: ig.Class.extend({ // static class Input {
            vx: null, // final float vx;
            vy: null, // final float vy;

            init: function(vx, vy) { // public Input(float vx, float vy) {
                this.vx = vx;
                this.vy = vy;
            }
        }),


        State: ig.Class.extend({ // static class State {
            x: null, // final float x;
            y: null, // final float y;

            init: function(x, y) { // public State(float x, float y) {
                this.x = x;
                this.y = y;
            },

            distance: function(s) { // public float distance(State s) {
                dx = s.x - x; // float dx = s.x - x;
                dy = s.y - y; // float dy = s.y - y;
                return Math.parseFloat(Math.sqrt(dx * dx + dy * dy)); // return (float) Math.sqrt(dx*dx + dy*dy);
            },

            //Override: //@Override
            toString: function() { // public String toString() {
                return "State("+x+","+y+")";
            }
        }),


        TimedState: ig.Class.extend({ // static class TimedState {
            time: null, // final long time;
            state: null, // final State state;

            init: function(time, state) { // public TimedState(long time, State state) {
                this.time = time;
                this.state = state;
            },

            //Override // @Override
            toString: function() { // public String toString() {
                return "TimedState(" + time + "," + state.toString() + ")";
            }
        }),


        TimedInput: ig.Class.extend({ // static class TimedInput {

            time: null, // final long time;
            input: null, // final Input input;

            init: function(time, input) { // public TimedInput(long time, Input input) {
                this.time = time;
                this.input = input;
            }
        }),


        PredictedState: ig.Class.extend({ // static class PredictedState {
            moveList: new InputAndStateList(), // InputAndStateList moveList = new InputAndStateList();
            currentState: null, // TimedState currentState;

            init: function(startState) { // PredictedState(TimedState startState) {
                this.currentState = startState;
            },

            update: function(timedInput, correctState) { // void update(TimedInput timedInput, TimedState correctState) {
                currentState = updateState(currentState, timedInput, false);
                move = new InputAndState(timedInput.input, currentState); // InputAndState move = new InputAndState(timedInput.input, currentState);
                moveList.add(move);
                currentState = moveList.correct(currentState, correctState);
            }
        }),


        InputAndState: ig.Class.extend({ // static class InputAndState {
            input: null, // final Input input;
            timedState: null, // final TimedState timedState;

            init: function(input, timedState) { // public InputAndState(Input input, TimedState timedState) {
                this.input = input;
                this.timedState = timedState;
            },

            getTimedInput: function() { // TimedInput getTimedInput() {
                return new TimedInput(timedState.time, input);
            }
        }),


        InputAndStateList: ig.Class.extend({ // static class InputAndStateList {
            list: new ArrayList(), // List<InputAndState> list = new ArrayList();

            add: function(move) { // void add(InputAndState move) {
                list.add(move);
            },

            correct: function(currentState, serverState) { // TimedState correct(TimedState currentState, TimedState serverState) {
                if (serverState !== null) { // if (serverState != null) {
                    removeBefore(serverState.time);
                    if (!isOldestWithinThresholdTo(serverState.state)) {
                        System.out.println("perform correction " + list.get(0).timedState + " != " + serverState);
                        return update(serverState);
                    }
                }
                return currentState;
            },

            removeBefore: function(time) { // private void removeBefore(long time) {
                while (list.size() > 0 && list.get(0).timedState.time < time) {
                    list.remove(0);
                }
            },

            isOldestWithinThresholdTo: function(state) { // private boolean isOldestWithinThresholdTo(State state) {
                return (list.size() > 0 && list.get(0).timedState.state.distance(state) <= TRESHOLD);
            },

            update: function(currentState) { // private TimedState update(TimedState currentState) {
                // FIXME: Prob. not the right way to traverse list.
                for (var oldMove in list) { // for (InputAndState oldMove : list) {
                    currentState = updateState(currentState, oldMove.getTimedInput(), false);
                }
                return currentState;
            }
        }),


        InterpolatedState: ig.Class.extend({ // static class InterpolatedState {
            timedStateList: new ArrayList(), // List<TimedState> timedStateList = new ArrayList();
            prevStateTime: 0, // long prevStateTime = 0;
            prevState: new TimedState(0, new State(0, 0)), // TimedState prevState = new TimedState(0, new State(0, 0));
            newestStateTime: 0, // long newestStateTime = 0;
            newestState: new TimedState(0, new State(0, 0)), // TimedState newestState = new TimedState(0, new State(0, 0));
            currentState: new TimedState(0, new State(0, 0)), // TimedState currentState = new TimedState(0, new State(0, 0));
            currentTime: 0, // long currentTime = 0;
            prevTime: 0, // long prevTime = 0;
            averageTimeBetweenPackets: 150, // float averageTimeBetweenPackets = 150;
            timeCorrection: 0, // long timeCorrection = 0;
            averageJitter: 50, // float averageJitter = 50;

            update: function(now, timedState) { // void update(long now, TimedState timedState) {
                delta = now - prevTime; // long delta = now - prevTime;
                prevTime = now;

                if (timedState !== null) { // if (timedState != null) {
                    timedStateList.add(timedState);
                    prevState = newestState;
                    prevStateTime = newestStateTime;
                    newestState = timedState;
                    newestStateTime = now;

                    if (prevState.time !== 0 && newestState.time !== 0) { // if (prevState.time != 0 && newestState.time != 0) {
                        if (currentTime === 0) { // if (currentTime == 0) {
                            currentTime = newestState.time;
                        }
                        if (Math.abs(newestState.time - prevState.time) < 1000) {
                            timeBetweenPackets = newestState.time - prevState.time; // float timeBetweenPackets = newestState.time - prevState.time;
                            averageTimeBetweenPackets += (timeBetweenPackets - averageTimeBetweenPackets) * 0.1;

                            recieveDelta = newestStateTime - prevStateTime; // long recieveDelta = newestStateTime - prevStateTime;
                            sendDelta = newestState.time - prevState.time; // long sendDelta = newestState.time - prevState.time;
                            jitter = recieveDelta - sendDelta; // long jitter = recieveDelta - sendDelta;
                            averageJitter += (jitter - averageJitter) * 0.1; // averageJitter += (jitter - averageJitter) * 0.1f;

                            currentTimeBehindNewestState = newestState.time - currentTime; // long currentTimeBehindNewestState = newestState.time - currentTime;
                            targetTimeBehindNewestState = Math.parseInt((averageTimeBetweenPackets + averageJitter * 2), 10); // long targetTimeBehindNewestState = (long) (averageTimeBetweenPackets + averageJitter * 2);
                            timeCorrection = targetTimeBehindNewestState - currentTimeBehindNewestState;
                        }
                    }
                }

                correction = 0; // long correction = 0;
                if (Math.abs(timeCorrection) > 0) {
                    correction = timeCorrection / Math.abs(timeCorrection);
                }
                timeCorrection -= correction;
                currentTime += (delta - correction);
                if (timedStateList.size() >= 2) {
                    currentTime = Math.min(timedStateList.get(timedStateList.size() - 1).time, currentTime);
                    currentTime = Math.max(timedStateList.get(timedStateList.size() - 1).time - 500, currentTime);

                    while (timedStateList.size() >= 2 && timedStateList.get(1).time < currentTime) {
                        timedStateList.remove(0);
                    }
                    s1 = timedStateList.get(0); // TimedState s1 = timedStateList.get(0);
                    s2 = timedStateList.get(1); // TimedState s2 = timedStateList.get(1);
                    t = (currentTime - s1.time) / Math.parseFloat(s2.time - s1.time); // float t = (currentTime - s1.time) / (float) (s2.time - s1.time);
                    currentState = new TimedState(currentTime, new State(
                            s1.state.x + t * (s2.state.x - s1.state.x),
                            s1.state.y + t * (s2.state.y - s1.state.y)
                            ));
                }
            }
        })
    });

});

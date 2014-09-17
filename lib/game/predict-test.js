ig.module('game.predict-test')
.requires()
.defines(function(){

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
        static Server server = new Server();
        static Client client = new Client();
        static JComponent renderer = new JComponent() {

            @Override
            public void paintComponent(Graphics g) {
                g.setColor(Color.WHITE);
                g.fillRect(0, 0, getWidth(), getHeight());
                drawPlayer(g, server.currentState.state, Color.BLUE.darker());
                drawPlayer(g, client.interpolatedState.newestState.state, Color.RED.darker());
                drawPlayer(g, client.interpolatedState.currentState.state, Color.GREEN.darker());
                drawPlayer(g, client.predictedState.currentState.state, Color.BLACK);
                g.drawLine(400, 0, 400, getHeight());
            }

            void drawPlayer(Graphics g, State state, Color color) {
                g.setColor(color);
                g.fillOval((int) state.x - 10, (int) state.y - 10, 20, 20);
            }
        };

        public static void main(String[] args) {
            renderer.addKeyListener(new KeyAdapter() {

                @Override
                public void keyPressed(KeyEvent e) {
                    keyState[e.getKeyCode()] = true;
                }

                @Override
                public void keyReleased(KeyEvent e) {
                    keyState[e.getKeyCode()] = false;
                }
            });

            JFrame frame = new JFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setBounds(100, 100, 640, 480);
            frame.add(renderer);
            frame.setVisible(true);

            renderer.requestFocusInWindow();

            new Thread(new Runnable() {

                public void run() {
                    server.gameLoop();
                }
            }).start();
            client.gameLoop(server);
        }

        static void sleep(long millis) {
            try {
                Thread.sleep(millis);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        /** Updates state using input to the specified time */
        static TimedState updateState(TimedState state, TimedInput timedInput, boolean doCollisions) {
            long timeDeltaMillis = timedInput.time - state.time;
            float x = state.state.x + timedInput.input.vx * timeDeltaMillis / 1000f;
            float y = state.state.y + timedInput.input.vy * timeDeltaMillis / 1000f;
            // do only on server
            if (doCollisions) {
                x = Math.min(400, x);
            }
            TimedState newState = new TimedState(timedInput.time, new State(x, y));
            return newState;
        }


        static class Client {
            PredictedState predictedState = new PredictedState(new TimedState(0, new State(0, 0)));
            InterpolatedState interpolatedState = new InterpolatedState();

            void gameLoop(Server server) {
                predictedState = new PredictedState(new TimedState(System.currentTimeMillis(), server.currentState.state));
                while (true) {
                    float dx = (keyState[KeyEvent.VK_LEFT] ? -150 : 0) + (keyState[KeyEvent.VK_RIGHT] ? 150 : 0);
                    float dy = (keyState[KeyEvent.VK_UP] ? -150 : 0) + (keyState[KeyEvent.VK_DOWN] ? 150 : 0);
                    long now = System.currentTimeMillis();
                    TimedInput timedInput = new TimedInput(now, new Input(dx, dy));
                    server.in.add(timedInput);
                    TimedState timedStateFromServer = server.out.remove();
                    predictedState.update(timedInput, timedStateFromServer);
                    interpolatedState.update(now, timedStateFromServer);
                    renderer.repaint();
                    sleep(16);
                }
            }
        }


        static class Server {
            DelayedFifo<TimedInput> in = new DelayedFifo();
            DelayedFifo<TimedState> out = new DelayedFifo();

            TimedState currentState;

            Server() {
                currentState = new TimedState(0, new State(100, 100));
            }

            void gameLoop() {
                while (true) {
                    tick();
                    renderer.repaint();
                    // run server at 10hz
                    sleep(100);
                }
            }

            private void tick() {
                while (true) {
                    TimedInput timedInput = in.remove();
                    if (timedInput == null) {
                        break;
                    }
                    currentState = updateState(currentState, timedInput, true);
                }

                out.add(currentState);
            }
        }


        static class DelayedFifo<T> {
            List<TimedEntry> list = Collections.synchronizedList(new ArrayList());

            void add(final T object) {
                list.add(new TimedEntry(System.currentTimeMillis() + getDelay(), object));
            }

            T remove() {
                if (list.isEmpty()) {
                    return null;
                }

                TimedEntry entry = list.get(0);
                if (System.currentTimeMillis() > entry.time) {
                    return (T) list.remove(0).object;
                }
                return null;
            }

            private long getDelay() {
                return 300 + (int) (Math.random() * 100);
            }

            class TimedEntry {

                long time;
                Object object;

                TimedEntry(long time, Object object) {
                    this.time = time;
                    this.object = object;
                }
            }
        }


        static class Input {
            final float vx;
            final float vy;

            public Input(float vx, float vy) {
                this.vx = vx;
                this.vy = vy;
            }
        }


        static class State {
            final float x;
            final float y;

            public State(float x, float y) {
                this.x = x;
                this.y = y;
            }

            public float distance(State s) {
                float dx = s.x - x;
                float dy = s.y - y;
                return (float) Math.sqrt(dx*dx + dy*dy);
            }

            @Override
            public String toString() {
                return "State("+x+","+y+")";
            }
        }


        static class TimedState {
            final long time;
            final State state;

            public TimedState(long time, State state) {
                this.time = time;
                this.state = state;
            }

            @Override
            public String toString() {
                return "TimedState(" + time + "," + state.toString() + ")";
            }
        }


        static class TimedInput {

            final long time;
            final Input input;

            public TimedInput(long time, Input input) {
                this.time = time;
                this.input = input;
            }
        }


        static class PredictedState {
            InputAndStateList moveList = new InputAndStateList();
            TimedState currentState;

            PredictedState(TimedState startState) {
                this.currentState = startState;
            }

            void update(TimedInput timedInput, TimedState correctState) {
                currentState = updateState(currentState, timedInput, false);
                InputAndState move = new InputAndState(timedInput.input, currentState);
                moveList.add(move);
                currentState = moveList.correct(currentState, correctState);
            }
        }


        static class InputAndState {
            final Input input;
            final TimedState timedState;

            public InputAndState(Input input, TimedState timedState) {
                this.input = input;
                this.timedState = timedState;
            }

            TimedInput getTimedInput() {
                return new TimedInput(timedState.time, input);
            }
        }


        static class InputAndStateList {
            List<InputAndState> list = new ArrayList();

            void add(InputAndState move) {
                list.add(move);
            }

            TimedState correct(TimedState currentState, TimedState serverState) {
                if (serverState != null) {
                    removeBefore(serverState.time);
                    if (!isOldestWithinThresholdTo(serverState.state)) {
                        System.out.println("perform correction " + list.get(0).timedState + " != " + serverState);
                        return update(serverState);
                    }
                }
                return currentState;
            }

            private void removeBefore(long time) {
                while (list.size() > 0 && list.get(0).timedState.time < time) {
                    list.remove(0);
                }
            }

            private boolean isOldestWithinThresholdTo(State state) {
                return (list.size() > 0 && list.get(0).timedState.state.distance(state) <= TRESHOLD);
            }

            private TimedState update(TimedState currentState) {
                for (InputAndState oldMove : list) {
                    currentState = updateState(currentState, oldMove.getTimedInput(), false);
                }
                return currentState;
            }
        }


        static class InterpolatedState {
            List<TimedState> timedStateList = new ArrayList();
            long prevStateTime = 0;
            TimedState prevState = new TimedState(0, new State(0, 0));
            long newestStateTime = 0;
            TimedState newestState = new TimedState(0, new State(0, 0));
            TimedState currentState = new TimedState(0, new State(0, 0));
            long currentTime = 0;
            long prevTime = 0;
            float averageTimeBetweenPackets = 150;
            long timeCorrection = 0;
            float averageJitter = 50;

            void update(long now, TimedState timedState) {
                long delta = now - prevTime;
                prevTime = now;

                if (timedState != null) {
                    timedStateList.add(timedState);
                    prevState = newestState;
                    prevStateTime = newestStateTime;
                    newestState = timedState;
                    newestStateTime = now;

                    if (prevState.time != 0 && newestState.time != 0) {
                        if (currentTime == 0) {
                            currentTime = newestState.time;
                        }
                        if (Math.abs(newestState.time - prevState.time) < 1000) {
                            float timeBetweenPackets = newestState.time - prevState.time;
                            averageTimeBetweenPackets += (timeBetweenPackets - averageTimeBetweenPackets) * 0.1f;

                            long recieveDelta = newestStateTime - prevStateTime;
                            long sendDelta = newestState.time - prevState.time;
                            long jitter = recieveDelta - sendDelta;
                            averageJitter += (jitter - averageJitter) * 0.1f;

                            long currentTimeBehindNewestState = newestState.time - currentTime;
                            long targetTimeBehindNewestState = (long) (averageTimeBetweenPackets + averageJitter * 2);
                            timeCorrection = targetTimeBehindNewestState - currentTimeBehindNewestState;
                        }
                    }
                }

                long correction = 0;
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
                    TimedState s1 = timedStateList.get(0);
                    TimedState s2 = timedStateList.get(1);
                    float t = (currentTime - s1.time) / (float) (s2.time - s1.time);
                    currentState = new TimedState(currentTime, new State(
                            s1.state.x + t * (s2.state.x - s1.state.x),
                            s1.state.y + t * (s2.state.y - s1.state.y)
                            ));
                }
            }
        }
    }

});

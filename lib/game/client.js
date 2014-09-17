ig.module('game.client')
.requires(
    'game.predicted-state',
    'game.timed-state'
)
.defines(function(){

    Client = ig.Class.extend({ // static class Client {
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
    });

});

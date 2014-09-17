ig.module('game.client')
.requires(
    'game.predicted-state',
    'game.timed-state',
    'game.state',
    'game.interpolated-state',
    'game.timed-input',
    'game.input'
)
.defines(function(){

    Client = ig.Class.extend({ // static class Client {
        predictedState: new PredictedState(new TimedState(0, new State(0, 0))), // PredictedState predictedState = new PredictedState(new TimedState(0, new State(0, 0)));
        interpolatedState: new InterpolatedState(), // InterpolatedState interpolatedState = new InterpolatedState();

        gameLoop: function(server) { // void gameLoop(Server server) {
            this.predictedState = new PredictedState(new TimedState(new Date().getTime(), server.currentState.state)); // predictedState = new PredictedState(new TimedState(System.currentTimeMillis(), server.currentState.state));
            var dx = (ig.input.state('LEFT') ? -150 : 0) + (ig.input.state('RIGHT') ? 150 : 0); // float dx = (keyState[KeyEvent.VK_LEFT] ? -150 : 0) + (keyState[KeyEvent.VK_RIGHT] ? 150 : 0);
            var dy = (ig.input.state('UP') ? -150 : 0) + (ig.input.state('DOWN') ? 150 : 0); // float dy = (keyState[KeyEvent.VK_UP] ? -150 : 0) + (keyState[KeyEvent.VK_DOWN] ? 150 : 0);
            var now = new Date().getTime(); // long now = System.currentTimeMillis();
            var timedInput = new TimedInput(now, new Input(dx, dy)); // TimedInput timedInput = new TimedInput(now, new Input(dx, dy));
            server.in.add(timedInput);
            var timedStateFromServer = server.out.remove(); // TimedState timedStateFromServer = server.out.remove();
            this.predictedState.update(timedInput, timedStateFromServer);
            this.interpolatedState.update(now, timedStateFromServer); // interpolatedState.update(now, timedStateFromServer);
            // renderer.repaint();
            // sleep(16);
        }
    });

});

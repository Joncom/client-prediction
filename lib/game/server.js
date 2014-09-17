ig.module('game.server')
.requires('game.delayed-fifo')
.defines(function(){

    Server = ig.Class.extend({ // static class Server {

        "in": new DelayedFifo(), // DelayedFifo<TimedInput> in = new DelayedFifo();
        "out": new DelayedFifo(), // DelayedFifo<TimedState> out = new DelayedFifo();

        currentState: null, // TimedState currentState;

        init: function() { // Server() {
            this.currentState = new TimedState(0, new State(100, 100));
        },

        update: function() { // void gameLoop() {
            this.tick();
            //renderer.repaint();
            // run server at 10hz
            //sleep(100);
        },

        tick: function() { // private void tick() {
            while (true) {
                var timedInput = this.in.remove(); // TimedInput timedInput = in.remove();
                if (timedInput === null) { // if (timedInput == null) {
                    break;
                }
                this.currentState = updateState(this.currentState, timedInput, true);
            }

            this.out.add(this.currentState);
        }
    });

});

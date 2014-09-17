ig.module('game.timed-state')
.requires()
.defines(function(){

    TimedState = ig.Class.extend({ // static class TimedState {
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
    });

});

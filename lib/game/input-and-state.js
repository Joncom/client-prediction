ig.module('game.input-and-state')
.requires()
.defines(function(){

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

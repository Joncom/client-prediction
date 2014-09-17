ig.module('game.timed-input')
.requires()
.defines(function(){

    TimedInput = ig.Class.extend({ // static class TimedInput {

        time: null, // final long time;
        input: null, // final Input input;

        init: function(time, input) { // public TimedInput(long time, Input input) {
            this.time = time;
            this.input = input;
        }
    });

});

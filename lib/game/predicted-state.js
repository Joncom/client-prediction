ig.module('game.predicted-state')
.requires(
    'game.input-and-state-list',
    'game.input-and-state'
)
.defines(function(){

    PredictedState = ig.Class.extend({ // static class PredictedState {
        moveList: new InputAndStateList(), // InputAndStateList moveList = new InputAndStateList();
        currentState: null, // TimedState currentState;

        init: function(startState) { // PredictedState(TimedState startState) {
            this.currentState = startState;
        },

        update: function(timedInput, correctState) { // void update(TimedInput timedInput, TimedState correctState) {
            currentState = updateState(this.currentState, timedInput, false);
            move = new InputAndState(timedInput.input, currentState); // InputAndState move = new InputAndState(timedInput.input, currentState);
            moveList.add(move);
            currentState = moveList.correct(currentState, correctState);
        }
    });

});

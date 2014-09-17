ig.module('game.input-and-state-list')
.requires()
.defines(function(){

    InputAndStateList = ig.Class.extend({ // static class InputAndStateList {
        list: [], // List<InputAndState> list = new ArrayList();

        add: function(move) { // void add(InputAndState move) {
            this.list.push(move); // list.add(move);
        },

        correct: function(currentState, serverState) { // TimedState correct(TimedState currentState, TimedState serverState) {
            if (serverState !== null) { // if (serverState != null) {
                this.removeBefore(serverState.time);
                if (!this.isOldestWithinThresholdTo(serverState.state)) { // if (!isOldestWithinThresholdTo(serverState.state)) {
                    console.log("perform correction " + this.list[0].timedState + " != " + serverState); // System.out.println("perform correction " + list.get(0).timedState + " != " + serverState);
                    return this.update(serverState);
                }
            }
            return currentState;
        },

        removeBefore: function(time) { // private void removeBefore(long time) {
            while (this.list.length > 0 && this.list[0].timedState.time < time) { // while (list.size() > 0 && list.get(0).timedState.time < time) {
                this.list.shift(); // list.remove(0);
            }
        },

        isOldestWithinThresholdTo: function(state) { // private boolean isOldestWithinThresholdTo(State state) {
            return (this.list.length > 0 && this.list[0].timedState.state.distance(state) <= TRESHOLD); // return (list.size() > 0 && list.get(0).timedState.state.distance(state) <= TRESHOLD);
        },

        update: function(currentState) { // private TimedState update(TimedState currentState) {
            for(var i=0; i<this.list.length; i++) { // for (InputAndState oldMove : list) {
                var oldMove = this.list[i];
                currentState = updateState(currentState, oldMove.getTimedInput(), false);
            }
            return currentState;
        }
    });

});

ig.module('game.input-and-state-list')
.requires()
.defines(function(){

    InputAndStateList = ig.Class.extend({ // static class InputAndStateList {
        list: [], // List<InputAndState> list = new ArrayList();

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
    });

});

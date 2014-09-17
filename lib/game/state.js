ig.module('game.state')
.requires()
.defines(function(){

    State = ig.Class.extend({ // static class State {
        x: null, // final float x;
        y: null, // final float y;

        init: function(x, y) { // public State(float x, float y) {
            this.x = x;
            this.y = y;
        },

        distance: function(s) { // public float distance(State s) {
            var dx = s.x - this.x; // float dx = s.x - x;
            var dy = s.y - this.y; // float dy = s.y - y;
            return Math.parseFloat(Math.sqrt(dx * dx + dy * dy)); // return (float) Math.sqrt(dx*dx + dy*dy);
        },

        //Override: //@Override
        toString: function() { // public String toString() {
            return "State("+x+","+y+")";
        }
    });

});

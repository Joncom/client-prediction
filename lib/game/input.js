ig.module('game.input')
.requires()
.defines(function(){

    Input = ig.Class.extend({ // static class Input {
        vx: null, // final float vx;
        vy: null, // final float vy;

        init: function(vx, vy) { // public Input(float vx, float vy) {
            this.vx = vx;
            this.vy = vy;
        }
    });

});

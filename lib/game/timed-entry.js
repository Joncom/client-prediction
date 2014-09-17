ig.module('game.timed-entry')
.requires()
.defines(function(){

    TimedEntry = ig.Class.extend({ // class TimedEntry {

        time: null, // long time;
        object: null, // Object object;

        init: function(time, object) { // TimedEntry(long time, Object object) {
            this.time = time;
            this.object = object;
        }
    });

});

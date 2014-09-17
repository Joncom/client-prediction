ig.module('game.delayed-fifo')
.requires()
.defines(function(){

    DelayedFifo = ig.Class.extend({ // static class DelayedFifo<T> {

        list: [], // List<TimedEntry> list = Collections.synchronizedList(new ArrayList());

        add: function(object) { // void add(final T object) {
            this.list.add(new TimedEntry(System.currentTimeMillis() + getDelay(), object));
        },

        remove: function() { // T remove() {
            if (this.list.isEmpty()) {
                return null;
            }

            entry = this.list[0]; // TimedEntry entry = list.get(0);
            if (System.currentTimeMillis() > entry.time) {
                return list.remove(0).object; // return (T) list.remove(0).object;
            }
            return null;
        },

        getDelay: function() { // private long getDelay() {
            return 300 + Math.parseInt((Math.random() * 100), 10); // return 300 + (int) (Math.random() * 100);
        },

        TimedEntry: ig.Class.extend({ // class TimedEntry {

            time: null, // long time;
            object: null, // Object object;

            init: function(time, object) { // TimedEntry(long time, Object object) {
                this.time = time;
                this.object = object;
            }
        })
    });

});

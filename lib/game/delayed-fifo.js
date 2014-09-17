ig.module('game.delayed-fifo')
.requires('game.timed-entry')
.defines(function(){

    DelayedFifo = ig.Class.extend({ // static class DelayedFifo<T> {

        list: [], // List<TimedEntry> list = Collections.synchronizedList(new ArrayList());

        add: function(object) { // void add(final T object) {
            this.list.push(new TimedEntry(new Date().getTime() + this.getDelay(), object)); // this.list.add(new TimedEntry(System.currentTimeMillis() + getDelay(), object));
        },

        remove: function() { // T remove() {
            if (this.list.length === 0) { // if (this.list.isEmpty()) {
                return null;
            }

            var entry = this.list[0]; // TimedEntry entry = list.get(0);
            if (new Date().getTime() > entry.time) { // if (System.currentTimeMillis() > entry.time) {
                return this.list.splice(0, 1).object; // return (T) list.remove(0).object;
            }
            return null;
        },

        getDelay: function() { // private long getDelay() {
            return 300 + parseInt((Math.random() * 100), 10); // return 300 + (int) (Math.random() * 100);
        }
    });

});

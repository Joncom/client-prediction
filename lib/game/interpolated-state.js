ig.module('game.interpolated-state')
.requires(
    'game.state',
    'game.timed-state'
)
.defines(function(){

    InterpolatedState = ig.Class.extend({ // static class InterpolatedState {
        timedStateList: [], // List<TimedState> timedStateList = new ArrayList();
        prevStateTime: 0, // long prevStateTime = 0;
        prevState: new TimedState(0, new State(0, 0)), // TimedState prevState = new TimedState(0, new State(0, 0));
        newestStateTime: 0, // long newestStateTime = 0;
        newestState: new TimedState(0, new State(0, 0)), // TimedState newestState = new TimedState(0, new State(0, 0));
        currentState: new TimedState(0, new State(0, 0)), // TimedState currentState = new TimedState(0, new State(0, 0));
        currentTime: 0, // long currentTime = 0;
        prevTime: 0, // long prevTime = 0;
        averageTimeBetweenPackets: 150, // float averageTimeBetweenPackets = 150;
        timeCorrection: 0, // long timeCorrection = 0;
        averageJitter: 50, // float averageJitter = 50;

        update: function(now, timedState) { // void update(long now, TimedState timedState) {
            var delta = now - this.prevTime; // long delta = now - prevTime;
            this.prevTime = now;

            if (timedState !== null) { // if (timedState != null) {
                this.timedStateList.push(timedState); // timedStateList.add(timedState);
                this.prevState = this.newestState;
                this.prevStateTime = this.newestStateTime;
                this.newestState = timedState;
                this.newestStateTime = now;

                if (this.prevState.time !== 0 && this.newestState.time !== 0) { // if (prevState.time != 0 && newestState.time != 0) {
                    if (this.currentTime === 0) { // if (currentTime == 0) {
                        this.currentTime = this.newestState.time; // currentTime = newestState.time;
                    }
                    if (Math.abs(this.newestState.time - this.prevState.time) < 1000) { // if (Math.abs(newestState.time - prevState.time) < 1000) {
                        var timeBetweenPackets = this.newestState.time - this.prevState.time; // float timeBetweenPackets = newestState.time - prevState.time;
                        this.averageTimeBetweenPackets += (timeBetweenPackets - this.averageTimeBetweenPackets) * 0.1; // averageTimeBetweenPackets += (timeBetweenPackets - averageTimeBetweenPackets) * 0.1;

                        var recieveDelta = this.newestStateTime - this.prevStateTime; // long recieveDelta = newestStateTime - prevStateTime;
                        sendDelta = this.newestState.time - this.prevState.time; // long sendDelta = newestState.time - prevState.time;
                        jitter = recieveDelta - sendDelta; // long jitter = recieveDelta - sendDelta;
                        this.averageJitter += (jitter - this.averageJitter) * 0.1; // averageJitter += (jitter - averageJitter) * 0.1f;

                        currentTimeBehindNewestState = this.newestState.time - this.currentTime; // long currentTimeBehindNewestState = newestState.time - currentTime;
                        targetTimeBehindNewestState = parseInt((this.averageTimeBetweenPackets + this.averageJitter * 2), 10); // long targetTimeBehindNewestState = (long) (averageTimeBetweenPackets + averageJitter * 2);
                        timeCorrection = targetTimeBehindNewestState - currentTimeBehindNewestState;
                    }
                }
            }

            correction = 0; // long correction = 0;
            if (Math.abs(this.timeCorrection) > 0) { // if (Math.abs(timeCorrection) > 0) {
                correction = this.timeCorrection / Math.abs(this.timeCorrection); // correction = timeCorrection / Math.abs(timeCorrection);
            }
            this.timeCorrection -= correction; // timeCorrection -= correction;
            this.currentTime += (delta - correction); // currentTime += (delta - correction);
            if (this.timedStateList.length >= 2) { // if (timedStateList.size() >= 2) {
                this.currentTime = Math.min(this.timedStateList[this.timedStateList.length - 1].time, this.currentTime); // currentTime = Math.min(timedStateList.get(timedStateList.size() - 1).time, currentTime);
                this.currentTime = Math.max(this.timedStateList[this.timedStateList.length - 1].time - 500, this.currentTime); // currentTime = Math.max(timedStateList.get(timedStateList.size() - 1).time - 500, currentTime);

                while (this.timedStateList.length >= 2 && this.timedStateList[1].time < this.currentTime) { // while (timedStateList.size() >= 2 && timedStateList.get(1).time < currentTime) {
                    this.timedStateList.shift(); // timedStateList.remove(0);
                }
                s1 = this.timedStateList[0]; // TimedState s1 = timedStateList.get(0);
                s2 = this.timedStateList[1]; // TimedState s2 = timedStateList.get(1);
                t = (this.currentTime - s1.time) / parseFloat(s2.time - s1.time); // float t = (currentTime - s1.time) / (float) (s2.time - s1.time);
                currentState = new TimedState(this.currentTime, new State( // currentState = new TimedState(currentTime, new State(
                        s1.state.x + t * (s2.state.x - s1.state.x),
                        s1.state.y + t * (s2.state.y - s1.state.y)
                        ));
            }
        }
    });

});

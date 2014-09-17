ig.module('game.interpolated-state')
.requires()
.defines(function(){

    InterpolatedState = ig.Class.extend({ // static class InterpolatedState {
        timedStateList: new ArrayList(), // List<TimedState> timedStateList = new ArrayList();
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
            delta = now - prevTime; // long delta = now - prevTime;
            prevTime = now;

            if (timedState !== null) { // if (timedState != null) {
                timedStateList.add(timedState);
                prevState = newestState;
                prevStateTime = newestStateTime;
                newestState = timedState;
                newestStateTime = now;

                if (prevState.time !== 0 && newestState.time !== 0) { // if (prevState.time != 0 && newestState.time != 0) {
                    if (currentTime === 0) { // if (currentTime == 0) {
                        currentTime = newestState.time;
                    }
                    if (Math.abs(newestState.time - prevState.time) < 1000) {
                        timeBetweenPackets = newestState.time - prevState.time; // float timeBetweenPackets = newestState.time - prevState.time;
                        averageTimeBetweenPackets += (timeBetweenPackets - averageTimeBetweenPackets) * 0.1;

                        recieveDelta = newestStateTime - prevStateTime; // long recieveDelta = newestStateTime - prevStateTime;
                        sendDelta = newestState.time - prevState.time; // long sendDelta = newestState.time - prevState.time;
                        jitter = recieveDelta - sendDelta; // long jitter = recieveDelta - sendDelta;
                        averageJitter += (jitter - averageJitter) * 0.1; // averageJitter += (jitter - averageJitter) * 0.1f;

                        currentTimeBehindNewestState = newestState.time - currentTime; // long currentTimeBehindNewestState = newestState.time - currentTime;
                        targetTimeBehindNewestState = Math.parseInt((averageTimeBetweenPackets + averageJitter * 2), 10); // long targetTimeBehindNewestState = (long) (averageTimeBetweenPackets + averageJitter * 2);
                        timeCorrection = targetTimeBehindNewestState - currentTimeBehindNewestState;
                    }
                }
            }

            correction = 0; // long correction = 0;
            if (Math.abs(timeCorrection) > 0) {
                correction = timeCorrection / Math.abs(timeCorrection);
            }
            timeCorrection -= correction;
            currentTime += (delta - correction);
            if (timedStateList.size() >= 2) {
                currentTime = Math.min(timedStateList.get(timedStateList.size() - 1).time, currentTime);
                currentTime = Math.max(timedStateList.get(timedStateList.size() - 1).time - 500, currentTime);

                while (timedStateList.size() >= 2 && timedStateList.get(1).time < currentTime) {
                    timedStateList.remove(0);
                }
                s1 = timedStateList.get(0); // TimedState s1 = timedStateList.get(0);
                s2 = timedStateList.get(1); // TimedState s2 = timedStateList.get(1);
                t = (currentTime - s1.time) / Math.parseFloat(s2.time - s1.time); // float t = (currentTime - s1.time) / (float) (s2.time - s1.time);
                currentState = new TimedState(currentTime, new State(
                        s1.state.x + t * (s2.state.x - s1.state.x),
                        s1.state.y + t * (s2.state.y - s1.state.y)
                        ));
            }
        }
    });

});

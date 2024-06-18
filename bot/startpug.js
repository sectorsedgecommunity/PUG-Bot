const state = require("../lib/state.js");

module.exports = {
    scheduleCronJob() {
        let timestamp = state.get("startTimestamp");
        let now = Date.now();
        let timeout = (timestamp * 1000) - now;
        if (timeout > 0) {
            setTimeout(startPug, timeout);
        }
        else {
            startPug();
        }
    }
}

async function startPug() {
    state.set("pugStatus", "starting");

    let registered = state.get("registered");
    let counter = state.get("counterMessage");
    let announceChannel = state.get("announceChannel");

    counter.delete();
    announceChannel.send(`Registration has closed. Players registered: \`${registered.length}\`. The PUG will start soon.`);
}
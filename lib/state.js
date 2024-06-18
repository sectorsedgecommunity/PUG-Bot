state = {
    pugStatus: "none",
    pugName: "",
    startTimestamp: "",
    announceChannel: null,
    counterMessage: null,
    adminChannel: null,
    format: "",
    teamSize: 0,
    registered: [],
    regions: []
}

module.exports = {
    get: (key) => {
        return state[key]
    },
    set: (key, value) => {
        state[key] = value
    }
}
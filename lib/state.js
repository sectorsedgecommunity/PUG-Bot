state = {
    pugCreated: false,
    pugName: "",
    startTimestamp: "",
    announceChannel: "",
    counterMessage: null,
    adminChannel: "",
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
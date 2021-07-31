export const state = () => ({
    secrets: []
});

const MUTATIONS = {
    ADD_SECRET: "add_secret"
}

export const getters = {
    secrets: state => state.secrets
}

export const actions = {
    addSecret({ commit }, secret) {
        commit(MUTATIONS.ADD_SECRET, secret);
    }
}

export const mutations = {
    [MUTATIONS.ADD_SECRET](state, value) {
        state.secrets.push(value);
    }
}
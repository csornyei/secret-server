export const state = () => ({
    secrets: [],
    initialised: false
});

const MUTATIONS = {
    INITIALISE_STORE: "initialiseStore",
    ADD_SECRET: "add_secret",
    UPDATE_SECRET: "update_secret",
    UPDATE_LOCAL_STORAGE: "update_local_storage"
}

export const getters = {
    secrets: state => state.secrets,
    initialised: state => state.initialised
}

export const actions = {
    addSecret({ commit, state }, secret) {
        const secretIdx = state.secrets.findIndex(({ hash }) => hash === secret.hash);
        if (secretIdx === -1) {
            commit(MUTATIONS.ADD_SECRET, secret);
        } else {
            commit(MUTATIONS.UPDATE_SECRET, { idx: secretIdx, secret });
        }
        commit(MUTATIONS.UPDATE_LOCAL_STORAGE);
    }
}

export const mutations = {
    [MUTATIONS.INITIALISE_STORE](state) {
        state.initalised = true;
        const localSecrets = localStorage.getItem("secrets")
        if (localSecrets) {
            state.secrets = [...JSON.parse(localSecrets)].map(secret => {
                return {
                    ...secret,
                    expired: secret.remainingViews === 0 || secret.expiresAt < Date.now()
                }
            });
        }
    },
    [MUTATIONS.ADD_SECRET](state, value) {
        state.secrets.push(value);
    },
    [MUTATIONS.UPDATE_SECRET](state, { idx, secret }) {
        const oldSecrets = [...state.secrets];
        if (secret.remainingViews === 0 || secret.expiresAt < Date.now()) {
            secret.expired = true;
        } else {
            secret.expired = false;
        }
        oldSecrets[idx] = secret;
        state.secrets = oldSecrets;
    },
    [MUTATIONS.UPDATE_LOCAL_STORAGE](state) {
        localStorage.setItem("secrets", JSON.stringify(state.secrets));
    }
}
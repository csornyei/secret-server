export default ({ store }, inject) => {
    inject("initialiseStore", () => {
        const initialised = store.getters["secrets/initialised"];
        if (!initialised) {
            store.commit("secrets/initialiseStore");
        }
    });
}
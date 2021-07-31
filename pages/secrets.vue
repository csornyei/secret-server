<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col-sm-1"></div>
      <div class="col-sm-4">
        <ul class="list-group">
          <li
            class="list-group-item position-relative"
            v-for="(s, index) in secrets"
            v-bind:key="index"
          >
            <span class="turncate">
              {{ s.hash }}
            </span>
            <span
              class="
                badge
                position-absolute
                top-0
                start-100
                translate-middle
                rounded-pill
                bg-danger
              "
            >
              {{ s.remainingViews }}
            </span>
          </li>
        </ul>
      </div>
      <div class="col-sm-1"></div>
      <div class="col-sm-5">
        <h1>Saved secrets</h1>
        <div>
          <div class="mb-3">
            <label for="secret-hash" class="form-label">Secret Hash</label>
            <input
              id="secret-hash"
              type="text"
              class="form-control"
              v-model="hash"
            />
          </div>
          <button
            class="btn btn-success"
            :disabled="hash.length === 0"
            @click="getSecret"
          >
            Get secret
          </button>
          <div v-if="error" class="alert alert-danger mt-4">
            {{ error }}
          </div>
          <div v-if="secret" class="card mt-5">
            <div class="card-body">
              <h5 class="card-title">
                {{ secret.secretText }}
                <span class="badge bg-danger">
                  {{ secret.remainingViews }}
                </span>
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ secret.hash }}</h6>
              <p v-if="secret.expiresAt !== 0" class="card-text">
                {{ expireRemaining() }}
              </p>
              <p class="card-text">{{ secret.createdAt }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-1"></div>
    </div>
  </div>
</template>

<style>
.turncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  mounted() {
    this.$initialiseStore();
  },
  data() {
    return {
      hash: "",
      secret: null,
      error: null,
    };
  },
  computed: {
    ...mapGetters("secrets", ["secrets"]),
    expireRemaining() {
      if (secret && secret.expiresAt !== 0) {
        return secret.expiresAt - Date.now();
      }
      return 0;
    },
  },
  methods: {
    ...mapActions("secrets", ["addSecret"]),
    getSecret() {
      this.error = null;
      this.$axios
        .get(`/api/secret/${this.hash}`)
        .then(({ data }) => {
          this.secret = data;
          this.addSecret(data);
        })
        .catch((err) => {
          console.log(err.toJSON());
          if (err.request.status === 404) {
            this.error = "There are no secret with this hash";
          } else {
            console.error(err);
          }
        });
    },
  },
};
</script>
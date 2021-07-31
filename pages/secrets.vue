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
            v-bind:class="{ 'bg-secondary': s.expired }"
          >
            <span
              class="turncate pointer user-select-none"
              v-bind:class="{ expired: s.expired }"
              @click="
                () => {
                  if (!s.expired) {
                    getSecretFromList(s.hash);
                  }
                }
              "
            >
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
                {{ expireRemaining }}
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
.pointer {
  cursor: pointer;
}
.expired {
  cursor: not-allowed;
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";
import { formattedRemainingTime } from "../utils/utils";

export default {
  mounted() {
    this.$initialiseStore();
  },
  data() {
    return {
      hash: "",
      secret: null,
      error: null,
      secretExpire: 0,
      countdown: null,
    };
  },
  computed: {
    ...mapGetters("secrets", ["secrets"]),
    expireRemaining() {
      if (this.secretExpire !== 0) {
        return formattedRemainingTime(this.secretExpire);
      }
      return 0;
    },
  },
  watch: {
    secretExpire: {
      handler(value) {
        if (value > 0) {
          clearTimeout(this.countdown);
          this.countdown = setTimeout(() => {
            this.secretExpire = this.secretExpire - 1000;
          }, 1000);
        }
      },
    },
  },
  methods: {
    ...mapActions("secrets", ["addSecret"]),
    getSecretFromList(clickedHash) {
      this.hash = clickedHash;
      this.getSecret();
    },
    getSecret() {
      this.error = null;
      this.$axios
        .get(`/api/secret/${this.hash}`)
        .then(({ data }) => {
          this.secret = data;
          this.secretExpire =
            new Date(this.secret.expiresAt).getTime() - Date.now();
          this.addSecret(this.secret);
        })
        .catch((err) => {
          const {
            response: {
              data: { errors },
            },
          } = err;
          if (errors && errors.length > 0) {
            if (errors[0].message === "Page not found") {
              this.error = "There are no secret with this hash!";
              return;
            } else if (errors[0].message === "Secret no longer available!") {
              this.error = errors[0].message;
              return;
            }
          }

          this.error = "Can't get the secret right now!";
        });
    },
  },
};
</script>
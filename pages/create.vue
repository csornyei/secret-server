<template>
  <div class="container">
    <div v-if="alert.show" class="alert mb-4" v-bind:class="alert.class">
      {{ alert.text }}
    </div>
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8 mt-3">
        <h1>Create new secret</h1>
        <div>
          <div class="mb-3">
            <label for="secret-text" class="form-label">Secret Text</label>
            <input
              id="secret-text"
              type="text"
              class="form-control"
              v-model="secretText"
            />
          </div>
          <div class="mb-3">
            <label for="ttl" class="form-label">Time to live (seconds)</label>
            <input
              id="ttl"
              type="number"
              min="0"
              step="10"
              class="form-control"
              v-model="timeToLive"
            />
          </div>
          <div class="mb-3">
            <label for="allowed-views" class="form-label">Allowed views</label>
            <input
              id="allowed-views"
              type="number"
              min="1"
              class="form-control"
              v-model="allowedViews"
            />
          </div>
          <button class="btn btn-primary" @click="submitForm">
            Save Secret
          </button>
          <a href="/secrets" class="btn btn-success">See the saved secrets</a>
          <ul v-if="errors.length > 0" class="list-group mt-4">
            <li
              v-for="err in errors"
              v-bind:key="err"
              class="list-group-item text-danger"
            >
              {{ err }}
            </li>
          </ul>
        </div>
      </div>
      <div class="col-sm-2"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  mounted() {
    this.$initialiseStore();
  },
  data() {
    return {
      secret: {
        text: "",
        ttl: 0,
        allowedView: 10,
      },
      errors: [],
      alert: {
        text: "No info here",
        show: false,
        class: "alert-secondary",
      },
    };
  },
  computed: {
    secretText: {
      get() {
        return this.secret.text;
      },
      set(value) {
        this.alert.show = false;
        this.secret.text = value;
      },
    },
    timeToLive: {
      get() {
        return this.secret.ttl;
      },
      set(value) {
        this.alert.show = false;
        let parsedTtl = parseInt(value);
        if (isNaN(parsedTtl)) {
          this.secret.ttl = 0;
        } else {
          this.secret.ttl = parseInt(value);
        }
      },
    },
    allowedViews: {
      get() {
        return this.secret.allowedView;
      },
      set(value) {
        this.alert.show = false;
        let parsedValue = parseInt(value);
        if (!isNaN(parsedValue)) {
          this.secret.allowedView = parseInt(value);
        }
      },
    },
  },
  methods: {
    ...mapActions("secrets", ["addSecret"]),
    submitForm() {
      this.verifyFormData();
      if (this.errors.length === 0) {
        const body = {
          secret: this.secret.text,
          expireAfterViews: this.secret.allowedView,
          expireAfter: this.secret.ttl,
        };

        this.$axios
          .post("/api/secret", body)
          .then(({ data }) => {
            this.addSecret(data);
            this.alert = {
              show: true,
              text: `Secret saved! It's hash is ${data.hash}`,
              class: "alert-success",
            };
          })
          .catch((err) => {
            console.error(err);
            this.alert = {
              show: true,
              text: `Secret was not saved! There was an error!`,
              class: "alert-danger",
            };
          });
      }
    },
    verifyFormData() {
      this.errors = [];
      if (this.secret.text.length === 0) {
        this.errors.push("You must provide text for the secret!");
      }
      if (!this.secret.ttl && this.secret.ttl !== 0) {
        this.errors.push(
          "You must provide a time to live value, if you not want the secret to expire set it to 0!"
        );
      }
      if (this.secret.ttl < 0) {
        this.errors.push("Time to live must be positive value or 0!");
      }
      if (!this.secret.allowedView) {
        this.errors.push(
          "You must provide how many times a secret should be shown!"
        );
      }
      if (this.secret.allowedView < 1) {
        this.errors.push("Allowed views must be a positive number!");
      }
    },
  },
};
</script>

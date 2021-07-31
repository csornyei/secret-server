<template>
  <div class="container">
    <div class="row full-height w-100">
      <div class="col-10 my-auto w-100">
        <h1 class="text-center">Secret Server</h1>
        <div
          class="
            row
            my-auto
            flex-row
            justify-content-around
            align-items-stretch
          "
        >
          <div class="card w-25">
            <div class="card-body">
              <h5 class="card-title">Create new secret</h5>
              <p class="card-text">Here you can create new secrets</p>
              <a href="/create" class="btn btn-primary">Create new secret</a>
            </div>
          </div>
          <div class="card w-25">
            <div class="card-body">
              <h5 class="card-title">Get saved secrets</h5>
              <p class="card-text">
                Here you can see the saved secrets if you have the hash for it
              </p>
              <a href="/secrets" class="btn btn-success">Saved secrets</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media screen and (min-width: 768px) {
  .full-height {
    height: 100vh;
  }
}
</style>

<script>
export default {};
</script>

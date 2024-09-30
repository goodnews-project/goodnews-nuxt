<template>
  <div class="right-plane">
    <SearchLayout />
    <StartPolymerizationPanel />
    <!-- <AboutInstructions /> -->
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.right-plane {
  max-height: 100vh;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

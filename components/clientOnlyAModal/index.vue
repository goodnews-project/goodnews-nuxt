<template>
  <client-only>
    <a-modal v-bind="attrs">
      <template v-slot:[key] v-for="(item, key) in slots">
        <slot :name="key"></slot>
      </template>
    </a-modal>
  </client-only>
</template>

<script setup>
const attrs = useAttrs();
const slots = useSlots();
</script>

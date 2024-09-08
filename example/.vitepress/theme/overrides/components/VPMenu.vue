<!-- Only VPMenu's script setup and templates should be overriden. -->
<script lang="ts" setup>
import VPMenuLink from '~theme/components/VPMenuLink.vue';
import VPMenuGroup from '~theme/components/VPMenuGroup.vue';

defineProps<{
  items?: any[];
  prefix?: string;
}>();
</script>

<template>
  <div class="VPMenu customized">
    <div
      v-if="items"
      class="items"
    >
      <span> {{ prefix ?? 'menu' }}: </span>
      <template
        v-for="item in items"
        :key="item.text"
      >
        <VPMenuLink
          v-if="'link' in item"
          :item="item"
        />
        <VPMenuGroup
          v-else
          :text="item.text"
          :items="item.items"
        />
      </template>
    </div>

    <slot />
  </div>
</template>

<template>
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.route-enter-active,
.route-leave-active {
  transition: opacity 1s ease;
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
}
</style>

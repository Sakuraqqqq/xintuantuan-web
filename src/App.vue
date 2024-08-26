<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
    <div class="app">
        <RouterView />
        <div class="bottom">
          <a href="https://beian.miit.gov.cn">粤ICP备2024279258号</a> |
          <a href="https://beian.mps.gov.cn">粤公网安备44030002004238号</a>
        </div>
    </div>
</template>

<style scoped>
.app {
    position: relative;
    height: 100%;
}
.bottom {
    width: 100%;
    bottom: 0;
    color: #ccc;
    position: absolute;
    text-align: center;
}
a {
    color: #ccc;
    text-decoration: auto;
    display: inline-block;
    margin:0 10px;
}
</style>

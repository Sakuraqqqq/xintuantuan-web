<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const value = ref("");
const router = useRouter();

const onSearch = () => {
    const search = value.value;
    if(checkType.value == "a") {
        // router.push({ path: "/CheckParameters", query: { search: search } });
        window.open(`/CheckParameters?search= ${search}`);

    } else {
        // router.push({ path: "/PriceComparison", query: { search: search } });
        window.open(`/PriceComparison?search= ${search}`);
    }
};
const typeChange = (e: any) => {
    console.log(e)
    const search = value.value
    if(e.target.value === 'a') {
        window.open(`/CheckParameters?search= ${search}`);
    } else {
        window.open(`/PriceComparison?search= ${search}`);
    }
    checkType.value = ''
}
const checkType = ref("");
</script>

<template>
    <div class="home">
        <div class="menu">
            <a-radio-group class="radio" v-model:value="checkType" size="large" @change="typeChange">
                <a-radio-button value="a">查参数</a-radio-button>
                <a-radio-button value="b">查货源</a-radio-button>
            </a-radio-group>
        </div>
        <div class="search">
            <div class="logo"></div>
            <a-input-search
                class="input"
                v-model:value="value"
                placeholder="请输入型号..."
                style="width: 200px"
                @search="onSearch"
                @enter="onSearch"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "./style.scss";
</style>

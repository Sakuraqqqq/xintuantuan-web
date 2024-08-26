<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
import { getSkuInfo } from "@/api";
import { computed, onMounted, reactive, ref } from "vue";
interface dataType {
    sku_details: any[];
}
const data: dataType = reactive({
    sku_details: [],
})

const selectedCars = ref<any>([]);

const compareCars = computed(() => {
    return selectedCars.value.filter((car: any) => {
        car.sku = route.query.sku;
        Object.keys(car.sku_attributes).forEach((key: string) => {
            car[key] = car.sku_attributes[key];
        })
        return car;
    });
});

const parameters = ref<any>([]);

onMounted(() => {
    if (route.query.sku) {
    getSkuInfo({ sku: route.query.sku, manu: route.query.manu }).then((res: any) => {
        console.log(res);
        data.sku_details = res.sku_details;
        const search: any = route.query.search;
        search.split(',').forEach((item: any) => { selectedCars.value.push(data.sku_details[item]); });
        parameters.value = Object.keys(data.sku_details[0]).splice(0,2);
        parameters.value.push(...Object.keys(data.sku_details[0].sku_attributes))
    });
}
})
</script>

<template>
    <div style="text-align: center;">
        <div style="margin: 20px; font-size: 20px;font-weight: bold; text-align: left;">参数对比</div>
        <table border="1" style="margin: 20px;">
            <thead>
                <tr>
                    <th>参数</th>
                    <th v-for="car in compareCars" :key="car.sku">
                        {{ car.sku }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="param  in parameters" :key="param">
                    <td>{{ param }}</td>
                    <td v-for="car in compareCars" :key="car.id" style="padding: 10px;width: 300px;">
                        {{ car[param]? car[param]: '-' }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
@import "./style.scss";
</style>

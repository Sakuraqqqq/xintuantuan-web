<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
import { getInventoryInfo } from "@/api";
import { computed, onMounted, reactive, ref } from "vue";
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '32px',
  },
  spin: true,
});
const loading = ref(false);
interface dataType {
    inventory_list: any[];
    distributor_name_filters: any[];
    manufacturer_filters: any[];
}
const data: dataType = reactive({
    inventory_list: [],
    distributor_name_filters: [],
    manufacturer_filters: [],
});

const columns = reactive([
    {
        title: "供应商",
        dataIndex: "distributor_name",
        key: "distributor_name",
        sorter: (a: any, b: any) =>
            a.distributor_name.localeCompare(b.distributor_name),
        filters: data.distributor_name_filters,
        onFilter: (value: string, record: any) =>
            record.distributor_name.indexOf(value) === 0,
            width: 130,
    },
    {
        title: "型号",
        dataIndex: "sku",
        key: "sku",
        width: 150,
    },
    {
        title: "品牌",
        dataIndex: "manufacturer",
        key: "manufacturer",
        sorter: (a: any, b: any) =>
            a.manufacturer.localeCompare(b.manufacturer),
        filters: data.manufacturer_filters,
        onFilter: (value: string, record: any) =>
            record.manufacturer.indexOf(value) === 0,
            width: 400
    },
    {
        title: "市场价",
        dataIndex: "price_range",
        key: "price_range",
        width: 200
    },
    // {
    //     title: "交易参数",
    //     dataIndex: "desc_add_list",
    //     key: "desc_add_list",
    // },
    {
        title: "库存",
        dataIndex: "stock",
        key: "stock",
        width: 120
    },
    {
        title: "阶梯价对比",
        key: "price_list",
        children: [
            { title: "1+", dataIndex: "price_1", key: "price_1" },
            { title: "100+", dataIndex: "price_100", key: "price_100" },
            { title: "500+", dataIndex: "price_500", key: "price_500" },
            { title: "1000+", dataIndex: "price_1000", key: "price_1000" },
            { title: "2000+", dataIndex: "price_2000", key: "price_2000" },
            { title: "5000+", dataIndex: "price_5000", key: "price_5000" },
        ],
    },
    {
        title: "比价数量",
        dataIndex: "price_number",
        key: "price_number",
        width: 180,
    },
    {
        title: "操作",
        key: "action",
    },
]);

function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log("params", pagination, filters, sorter, extra);
}
const goBuy = (val: any) => {
    window.open("https:" + val);
};
const number = ref<any>(null);
const num = ref(0);
const priceComparison = () => {
    console.log(number.value);

    if (Number(number.value) >= 5000) {
        num.value = 5000;
    } else if (Number(number.value) >= 2000) {
        num.value = 2000;
    } else if (Number(number.value) >= 1000) {
        num.value = 1000;
    } else if (Number(number.value) >= 500) {
        num.value = 500;
    } else if (Number(number.value) >= 100) {
        num.value = 100;
    } else if (Number(number.value) >= 1) {
        num.value = 1;
    } else {
        num.value = 0;
        data.inventory_list.forEach((item: any) => {
            item.price_number = "";
            return;
        });
    }
    data.inventory_list.forEach((item: any) => {
        item.price_number = item["price_" + num.value];
    });
};
function getPriceForSpecificLevels(priceList: any, levelsToCheck: any) {
    // 首先，将价格阶梯按照级别升序排序
    const sortedPriceList = priceList
        .slice()
        .sort((a: any, b: any) => parseInt(a.level) - parseInt(b.level));

    // 遍历排序后的价格阶梯
    for (const priceItem of sortedPriceList) {
        // 检查当前级别是否满足或超过请求的级别
        if (parseInt(priceItem.level) >= levelsToCheck) {
            return priceItem.value;
        }
    }

    // 如果没有找到合适的级别，返回列表中最高级别的价格
    return sortedPriceList[sortedPriceList.length - 1].value;
}

onMounted(() => {
    loading.value = true;
    if (route.query.sku) {
        getInventoryInfo({ sku: route.query.sku }).then((res: any) => {
            const search: any = route.query.search;
            search.split(",").forEach((item: any) => {
                res.inventory_list.forEach((ele: any) => {
                    if (item == ele.id) {
                        data.inventory_list.push(ele);
                    }
                });
            });
            let distributor_name_list: any = [];
            let manufacturer_list: any = [];
            data.inventory_list.forEach((item: any) => {
                item.price_number = "";
                distributor_name_list.push(item.distributor_name);
                manufacturer_list.push(item.manufacturer);
                item.price_list.sort(function (a: any, b: any) {
                    return a.level - b.level;
                });
                const priceList = item.price_list;
                const levelsToCheck = [1, 100, 500, 1000, 2000, 5000];

                // 获取并打印每个级别的价格
                levelsToCheck.forEach((level) => {
                    item["price_" + level] = getPriceForSpecificLevels(
                        priceList,
                        level
                    );
                    console.log(
                        `Price for level ${level}:`,
                        getPriceForSpecificLevels(priceList, level)
                    );
                });
            });

            distributor_name_list = [...new Set(distributor_name_list)];
            manufacturer_list = [...new Set(manufacturer_list)];
            distributor_name_list.forEach((item: any) => {
                data.distributor_name_filters.push({ text: item, value: item });
            });
            manufacturer_list.forEach((item: any) => {
                data.manufacturer_filters.push({ text: item, value: item });
            });
            columns[0].filters = data.distributor_name_filters;
            columns[2].filters = data.manufacturer_filters;
            loading.value = false;
        });
    }
});
</script>

<template>
    <div style="text-align: center;">
        <a-spin v-if="loading" :indicator="indicator" style="margin-top: 450px;" />
        <div v-if="!loading" >
            <div style="margin: 20px; font-size: 20px; font-weight: bold; text-align: left;">
                参数对比
            </div>
            <a-table
                @change="onChange"
                :dataSource="data.inventory_list"
                :columns="columns"
                rowKey="id"
                style="font-family: Arial, sans-serif"
                :scroll="{ x: 1800 }"
            >
                <template #headerCell="{ column }">
                    <template v-if="column.key === 'price_number'">
                        <span style="font-weight: bold;">
                            比价数量
                            <a-input
                                style="display: inline-block;width: 80px;"
                                v-model:value="number"
                                @change="priceComparison"
                            ></a-input>
                        </span>
                    </template>
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'price_list'">
                        <div v-for="item in record.price_list">
                            <span style="width: 80px; display: inline-block"
                                >{{ item.level }}+</span
                            >
                            <span>{{ item.value }}</span>
                        </div>
                    </template>
                    <template v-if="column.key === 'manufacturer'">
                        <div>{{ record.manufacturer }}</div>
                        <div>描述：{{ record.description }}</div>
                    </template>
                    <template v-if="column.key === 'desc_add_list'">
                        <div>
                            {{
                                record.desc_add_list.forEach((element: any) => {
                                    if (element.key === "Min Qty") {
                                        return "最小起订量：" + element.value;
                                    }
                                })
                            }}
                        </div>
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-button type="link" @click="goBuy(record.link)"
                            >前往购买</a-button
                        >
                    </template>
                </template>
            </a-table>
        </div>

    </div>
</template>

<style lang="scss" scoped>
@import "./style.scss";
</style>

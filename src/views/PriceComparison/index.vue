<script setup lang="ts">
import { getInventoryInfo } from "@/api";
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PlusOutlined } from "@ant-design/icons-vue";
const route = useRoute();
const router = useRouter();
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
    associated_sku_list: any[];
    manufacturer_list: any[];
    distributor_name_list: any[];
    skuData: any;
    distributor_name_filters: any[];
    manufacturer_filters: any[];
}
const data: dataType = reactive({
    inventory_list: [],
    associated_sku_list: [],
    manufacturer_list: [],
    distributor_name_list: [],
    skuData: {},
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
            width:130
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
        width: 150,
    },
    {
        title: "说明",
        dataIndex: "description",
        key: "description",
        width:300
    },
    {
        title: "附加说明",
        key: "desc_add_list",
        width:200
    },
    {
        title: "库存",
        dataIndex: "stock",
        key: "stock",
        width: 100
    },
    {
        title: "价格范围",
        dataIndex: "price_range",
        key: "price_range",
        width:150
    },
    {
        title: "价格阶梯",
        key: "price_list",
        width: 170
    },
        {
            title: "购买",
        key: "action",
    },
]);
const goToCheckParameters = () => {
    const search = value.value;
    router.push({ path: "/CheckParameters", query: { search: search } });
};
const goToPriceComparison = () => {
    const search = value.value;
    router.push({ path: "/PriceComparison", query: { search: search } });
};
const onSearch = (value: string) => {
    inventoryInfo(value);
};
const value = ref("");
const tableRetry = ref(true);
const inventoryInfo = (sku: string) => {
    loading.value = true;
    tableRetry.value = false;
    const distributor_name_list: any = [];
    const manufacturer_list: any = [];
    data.distributor_name_filters = [];
    data.manufacturer_filters = [];
    getInventoryInfo({ sku: sku })
        .then((res: any) => {
            console.log(res);
            data.associated_sku_list = res.associated_sku_list;
            data.inventory_list = res.inventory_list;
            data.inventory_list.forEach((item: any) => {
                distributor_name_list.push(item.distributor_name);
                manufacturer_list.push(item.manufacturer);
                item.price_list.sort(function (a: any, b: any) {
                    return a.level - b.level;
                });
            });

            data.distributor_name_list = [...new Set(distributor_name_list)];
            data.manufacturer_list = [...new Set(manufacturer_list)];
            data.distributor_name_list.forEach((item) => {
                data.distributor_name_filters.push({ text: item, value: item });
            });
            data.manufacturer_list.forEach((item) => {
                data.manufacturer_filters.push({ text: item, value: item });
            });
            data.skuData = res.inventory_list[0];
            columns[0].filters = data.distributor_name_filters;
            columns[2].filters = data.manufacturer_filters;
            loading.value = false
        })
        .finally(() => {
            tableRetry.value = true;
            loading.value = false
        });
};
const brand = ref<any>(null);
const brand1 = ref<any>(null);
const brandShow = ref<any>(false);
const brandShow1 = ref<any>(false);
const getAll = () => {
    if (!brandShow.value) {
        brandShow.value = !brandShow.value;
        brand.value.style.flexWrap = "wrap";
    } else {
        brandShow.value = !brandShow.value;
        brand.value.style.flexWrap = "nowrap";
    }
};
const getAll1 = () => {
    if (!brandShow1.value) {
        brandShow1.value = !brandShow1.value;
        brand1.value.style.flexWrap = "wrap";
    } else {
        brandShow1.value = !brandShow1.value;
        brand1.value.style.flexWrap = "nowrap";
    }
};
const activeType = ref("");

const updateSearch = (val: any, type: any) => {
    if (type === "manu") {
        activeType.value = val;
    } else {
        value.value = val;
        inventoryInfo(value.value);
    }
};
onMounted(() => {
    console.log(route.query.search)
    loading.value = true;
    if (route.query.search) {
        value.value = route.query.search as string;
        inventoryInfo(value.value);
    } else {
        inventoryInfo(value.value);
    }
});
const highlightedString = (val: any) => {
    // 假设我们要将 "示例" 这个词变成红色
    const wordToHighlight = value.value.split("");
    const regex = new RegExp(`(${wordToHighlight})`, "g");
    wordToHighlight.forEach((char: any) => {
        const regex = new RegExp(char, "g"); // 创建全局匹配的正则表达式
        val = val.replace(regex, `<span style="color:red">${char}</span>`);
    });
    return val;
};
function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log("params", pagination, filters, sorter, extra);
}
const goBuy = (val: any) => {
    window.open("https:" + val);
};
const checkList = ref<string[]>([]);
const open = ref<boolean>(false);

const showModal = () => {
    open.value = true;
};
const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
    window.open(`/PriceView?sku=${value.value}&manu=${activeType.value}&search=` + checkList.value.join(","));
};
</script>

<template>
    <div style="text-align: center;">
        <a-spin v-if="loading" :indicator="indicator" style="margin-top: 450px;" />
        <div v-if="!loading" class="checkParameters">
            <div class="menu">
                <a-button
                    type="text"
                    style="color: #666"
                    @click="goToCheckParameters"
                    >查参数</a-button
                >
                <a-button
                    type="text"
                    style="font-weight: bolder"
                    @click="goToPriceComparison"
                    >查货源</a-button
                >
            </div>
            <div class="search">
                <div class="logo" @click="router.push('/')"></div>
                <a-input-search
                    class="input"
                    v-model:value="value"
                    placeholder="请输入型号..."
                    @search="onSearch"
                />
                <span v-if="data.inventory_list.length" class="resultNum"
                    >约{{ data.inventory_list.length }}条结果</span
                >
            </div>
            <div>
                <a-breadcrumb>
                    <a-breadcrumb-item
                        ><span class="breadcrumb">首页</span></a-breadcrumb-item
                    >
                    <a-breadcrumb-item
                        ><span class="breadcrumb"
                            >库存&价格</span
                        ></a-breadcrumb-item
                    >
                    <a-breadcrumb-item
                        ><span class="breadcrumb">{{
                            value
                        }}</span></a-breadcrumb-item
                    >
                </a-breadcrumb>
            </div>
            <div>
                <div>
                    <span>品牌：</span>
                    <div style="display: inline-block">
                        <div class="brand" ref="brand">
                            <span
                                style="padding: 0 10px; display: inline-block"
                                v-for="(item, index) in data.manufacturer_list"
                                :key="index"
                                :class="{ active: item == activeType }"
                            >
                                <span
                                    style="cursor: pointer"
                                    @click="updateSearch(item, 'manu')"
                                    >{{ item }}</span
                                >
                            </span>
                        </div>
                    </div>
                    <a-button
                        v-if="data.manufacturer_list.length > 4"
                        @click="getAll"
                        type="link"
                        style="margin-left: 10px"
                    >
                        <template #icon> <PlusOutlined /> </template>更多</a-button
                    >
                </div>
                <div>
                    <span>型号：</span>
                    <div style="display: inline-block">
                        <div class="brand" ref="brand1">
                            <span
                                style="margin: 0 10px; display: inline-block"
                                v-for="(item, index) in data.associated_sku_list"
                                :key="index"
                            >
                                <span
                                    style="color: blue; cursor: pointer"
                                    v-html="highlightedString(item)"
                                    @click="updateSearch(item, 'sku')"
                                ></span>
                            </span>
                        </div>
                    </div>
                    <a-button
                        v-if="data.associated_sku_list.length > 4"
                        type="link"
                        @click="getAll1"
                        style="margin-left: 10px"
                    >
                        <template #icon> <PlusOutlined /> </template>更多</a-button
                    >
                </div>
                <div style="margin: 20px 0">
                    <a-button @click="showModal"
                        >一键比价<template #icon> <PlusOutlined /> </template
                    ></a-button>
                </div>
            </div>
            <div>
                <a-table
                    style="font-family: Arial, sans-serif"
                    v-if="tableRetry"
                    @change="onChange"
                    :dataSource="data.inventory_list"
                    :columns="columns"
                    rowKey="id"
                    :scroll="{ x: 1800 }"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'price_list'">
                        <div v-for="item in record.price_list">
                            <span style="width: 49%; display: inline-block"
                                >{{ item.level }}+</span
                            >
                            <span style="width: 49%; display: inline-block;text-align: right;">{{ item.value }}</span>
                        </div>
                    </template>
                    <template v-if="column.key === 'desc_add_list'">
                        <div v-for="item in record.desc_add_list">
                            <span style="color: blue;">{{ item.key }}：</span>
                            <span style="color: red;">{{ item.value }}</span>
                        </div>
                    </template>
                        <template v-if="column.key === 'action'">
                            <a-button style="padding-left: 0;" type="link" @click="goBuy(record.link)"
                                >前往购买</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <a-modal
                width="80%"
                v-model:open="open"
                title="参数对比"
                @ok="handleOk"
            >
                <a-checkbox-group
                    v-model:value="checkList"
                    style="width: 100%; margin: 20px"
                >
                    <a-checkbox
                        style="width: 450px"
                        v-for="(item, index) in data.inventory_list"
                        :key="index"
                        :value="item.id"
                        >{{ item.distributor_name +': '+ item.sku +"【" + item.manufacturer + "】" }}</a-checkbox
                    >
                </a-checkbox-group>
            </a-modal>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "./style.scss";
</style>

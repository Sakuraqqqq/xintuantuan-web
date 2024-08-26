<script setup lang="ts">
import { getInventoryInfo, getSkuAddInfo, getSkuInfo } from "@/api";
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PlusOutlined } from "@ant-design/icons-vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import * as echarts from "echarts";
import { h } from "vue";
const indicator = h(LoadingOutlined, {
    style: {
        fontSize: "32px",
    },
    spin: true,
});
const loading = ref(false);
const route = useRoute();
const router = useRouter();
interface dataType {
    inventory_list: any[];
    associated_sku_list: any[];
    manufacturer_list: any[];
    skuData: any;
    sku_details: any;
    status: any;
}
const data: dataType = reactive({
    inventory_list: [],
    associated_sku_list: [],
    manufacturer_list: [],
    skuData: {
        sku_attributes: {},
    },
    sku_details: [],
    status: {},
});
const goToCheckParameters = () => {
    const search = value.value;
    router.push({ path: "/CheckParameters", query: { search: search } });
};
const goToPriceComparison = () => {
    const search = value.value;
    router.push({ path: "/PriceComparison", query: { search: search } });
};
const onSearch = (value: string) => {
    // inventoryInfo(value);
    skuInfo(value, "");
};
const value = ref("");
const skuInfo = (sku: string, manu: string) => {
    loading.value = true;
    const manufacturer_list: any = [];
    getSkuInfo({ sku: sku, manu: manu })
        .then((res: any) => {
            console.log(res);
            data.associated_sku_list = [value.value];
            data.sku_details = res.sku_info_list;
            data.skuData = data.sku_details[0];
            data.sku_details.forEach((item: any) => {
                manufacturer_list.push(item.manufacturer);
            });
            getSkuAddInfo({
                sku: value.value,
                manufacturer: data.sku_details[0].manufacturer,
            }).then((res: any) => {
                console.log(res);
                data.status = res;
                // init()
                loading.value = false;
            });
            data.manufacturer_list = [...new Set(manufacturer_list)];
        })
        .finally(() => {
            loading.value = false;
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
        loading.value = true;
        activeType.value = val;
        data.sku_details.forEach((item: any) => {
            if (item.manufacturer === val) {
                data.skuData = item;
                getSkuAddInfo({
                    sku: value.value,
                    manufacturer: val,
                }).then((res: any) => {
                    console.log(res);
                    data.status = res;
                    loading.value = false;
                });
            }
        });
    } else {
        value.value = val;
        skuInfo(value.value, activeType.value);
        // inventoryInfo(value.value);
    }
};

const open = ref<boolean>(false);

const showModal = () => {
    open.value = true;
};

const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
    // router.push({ path: "/CheckView", query: { search: checkList.value.join(","), target: '_blank' } });
    window.open(
        `/CheckView?sku=${value.value}&manu=${activeType.value}&search=` +
            checkList.value.join(",")
    );
};
const checkList = ref<string[]>([]);
onMounted(() => {
    loading.value = true;
    if (route.query.search) {
        value.value = route.query.search as string;
        // inventoryInfo(value.value);
        skuInfo(value.value, "");
    } else {
        loading.value = false;
    }
    if (value.value) {
        // inventoryInfo(value.value);
        skuInfo(value.value, "");
    } else {
        loading.value = false
    }
});
const myChart = ref<any>(null);
const options: any = {
    textStyle: {
        fontSize: 8
    },
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
        {
            name: "Pressure",
            type: "gauge",
            progress: {
                show: true,
            },
            detail: {
                valueAnimation: true,
                formatter: "{value}",
            },
            data: [
                {
                    value: 1.04
                }
            ],
        },
    ],
};
// const init = () => {
//     myChart.value = echarts.init(document.getElementById("chart"));
//     myChart.value.setOption(options)
// };
const downloadPDF = (val: any) => {
    window.open(val);
};
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
function uniqueByThreeParams(arr: any, param1: any, param2: any, param3: any) {
    const seen: any = {};
    const result: any = [];

    for (const item of arr) {
        const key = JSON.stringify({
            [param1]: item[param1],
            [param2]: item[param2],
            [param3]: item[param3],
        });

        if (!seen[key]) {
            seen[key] = true;
            result.push(item);
        }
    }

    return result;
}
</script>

<template>
    <div style="text-align: center">
        <a-spin
            v-if="loading"
            :indicator="indicator"
            style="height: 946px; padding-top: 450px"
        />
        <div v-if="!loading" class="checkParameters">
            <!-- <div class="menu">
                <a-button
                    type="text"
                    style="font-weight: bolder"
                    @click="goToCheckParameters"
                    >查参数</a-button
                >
                <a-button
                    type="text"
                    style="color: #666"
                    @click="goToPriceComparison"
                    >查货源</a-button
                >
            </div> -->
            <div class="search">
                <div class="logo" @click="router.push('/')"></div>
                <a-input-search
                    class="input"
                    v-model:value="value"
                    placeholder="请输入型号..."
                    @search="onSearch"
                    style="display: inline-block; vertical-align: super"
                />
                <span v-if="data.inventory_list.length" class="resultNum"
                    >约{{ data.inventory_list.length }}条结果</span
                >
            </div>
            <div v-if="data.sku_details.length">
                <div style="margin-left: 20px">
                    <a-breadcrumb>
                        <a-breadcrumb-item
                            ><span class="breadcrumb">首页</span></a-breadcrumb-item
                        >
                        <a-breadcrumb-item
                            ><span class="breadcrumb"
                                >查参数</span
                            ></a-breadcrumb-item
                        >
                        <a-breadcrumb-item
                            ><span class="breadcrumb">{{
                                value
                            }}</span></a-breadcrumb-item
                        >
                    </a-breadcrumb>
                </div>
                <div style="margin-left: 20px">
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
                            v-if="data.manufacturer_list.length >= 4"
                            @click="getAll"
                            type="link"
                            style="margin-left: 10px"
                        >
                            <template #icon> <PlusOutlined /> </template
                            >更多</a-button
                        >
                    </div>
                    <div>
                        <span>型号：</span>
                        <div style="display: inline-block">
                            <div class="brand" ref="brand1">
                                <span
                                    style="margin: 0 10px; display: inline-block"
                                    v-for="(
                                        item, index
                                    ) in data.associated_sku_list"
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
                            <template #icon> <PlusOutlined /> </template
                            >更多</a-button
                        >
                    </div>
                    <div style="margin-top: 10px; margin-left: 18px">
                        <a-button @click="showModal"
                            >参数对比<template #icon> <PlusOutlined /> </template
                        ></a-button>
                    </div>
                </div>
                <div class="skuInfo">
                    <div class="skuImgBox">
                        <img
                            class="skuImg"
                            src="../../assets/images/sku.png"
                            alt=""
                        />
                        <img
                            class="pdfImg"
                            @click="downloadPDF(data.skuData.datasheet_url)"
                            src="../../assets/images/pdf.png"
                            alt=""
                        />
                    </div>
                    <div class="skuData">
                        <div class="sku">{{ value }}</div>
                        <div class="distributor">
                            制造商：{{ data.skuData?.manufacturer }}
                        </div>
                        <div class="description">
                            描述：{{ data.skuData?.description }}
                        </div>
                    </div>
                    <div>
                        <div class="price">
                            <div class="priceTitle">市场均价</div>
                            <div class="priceNum">
                                {{ data.status.sku_add_info?.market_avg_price }}
                            </div>
                        </div>
                        <div>
                            <div class="priceTitle">市场库存</div>
                            <div class="priceNum">
                                {{ data.status.sku_add_info?.market_total_stock }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="price">
                            <div class="priceTitle">生命周期</div>
                            <div class="priceNum">
                                {{ data.status.sku_add_info?.lifecycle }}
                            </div>
                        </div>
                        <div>
                            <div class="priceTitle">风险等级</div>
                            <!-- <div id="chart" style="width: 80px; height: 80px"></div> -->
                            <div class="priceNum">
                                {{ data.status.sku_add_info?.risk_index_overall }}
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-left: 20px">
                    <div>
                        <div>
                            <div
                                v-for="(item, index) in data.skuData.sku_attributes"
                                :key="index"
                            >
                                <div style="font-weight: bold; margin: 10px">
                                    {{ item.type }}
                                </div>
                                <div class="sku_attributes">
                                    <div
                                        class="parameter"
                                        v-for="ele in Object.keys(item.attributes)"
                                    >
                                        <div class="parameterTitle">
                                            {{ ele }}
                                        </div>
                                        <div class="parameterValue">
                                            {{ item.attributes[ele] }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a-modal
                    width="60%"
                    v-model:open="open"
                    title="参数对比"
                    @ok="handleOk"
                >
                    <a-checkbox-group
                        v-model:value="checkList"
                        style="width: 100%; margin: 20px"
                    >
                        <a-checkbox
                            style="width: 350px"
                            v-for="(item, index) in data.sku_details"
                            :key="index"
                            :value="index"
                            >{{
                                value + "【" + item.manufacturer + "】"
                            }}</a-checkbox
                        >
                    </a-checkbox-group>
                </a-modal>
            </div>
            <div v-else>
                111
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "./style.scss";
</style>

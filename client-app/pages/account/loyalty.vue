<template>
  <div class="bg-gray-100 flex-grow pt-6 pb-16 shadow-inner">
    <div class="max-w-screen-2xl md:px-12 mx-auto">
      <div class="flex lg:space-x-5">
        <!-- First column-->
        <div class="hidden lg:flex flex-col lg:w-1/5 space-y-5">
          <AccountNavigation></AccountNavigation>
        </div>

        <!-- Second column-->
        <div class="flex flex-col w-full lg:w-4/5 space-y-5">
          <div class="flex justify-between items-center mx-5 lg:mx-0">
            <h2 class="text-gray-800 text-3xl font-bold uppercase">Loyalty</h2>
          </div>
          <div class="bg-white shadow-sm rounded border px-7 py-7 md:px-9 md:py-8">
            <div class="flex justify-between items-center">
              <div class="text-gray-800 text-3xl font-bold">User Balance: {{ userBalance?.amount }}</div>
              <VcButton class="float-right uppercase px-5" @click="addOperation"> Add operation </VcButton>
            </div>
          </div>
          <div class="bg-white shadow-sm rounded border px-7 py-7 md:px-9 md:py-8">
            <div class="flex justify-between items-center pb-5">
              <div class="flex flex-col gap-5">
                <VcRadioButton id="pagination" v-model="scrollMode" value="pagination" :label="'Pagination view'" />
                <VcRadioButton id="scroll" v-model="scrollMode" value="scroll" :label="'Infinity scroll view'" />
              </div>
              <div>
                <VcSelect
                  v-model="itemsPerPageStr"
                  :items="_.range(5, 26)"
                  :label="'Items per page'"
                  :is-required="true"
                  :is-disabled="isInfinityScrollEnable"
                  class="w-full"
                  size="lg"
                >
                  <template #first>{{ $t("pages.account.checkout_defaults.not_selected_placeholder") }}</template>
                </VcSelect>
              </div>
            </div>

            <div class="flex flex-col bg-white">
              <VcTable
                :loading="true"
                :columns="columns"
                :items="userBalance?.pointsOperations"
                :pages="!isInfinityScrollEnable ? pages : 0"
                :page="page"
                @pageChanged="onPageChange"
              >
                >
                <template #desktop-skeleton>
                  <tr v-for="i of itemsPerPage" :key="i" class="even:bg-gray-50">
                    <td class="p-5">
                      <div class="h-6 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td class="p-5">
                      <div class="h-6 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td class="p-5">
                      <div class="h-6 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td class="p-5">
                      <div class="h-6 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td class="p-5">
                      <div class="h-6 bg-gray-200 animate-pulse"></div>
                    </td>
                  </tr>
                </template>
                <template #desktop-body>
                  <tr
                    v-for="operation in userBalance?.pointsOperations"
                    :key="operation.id"
                    class="even:bg-gray-50 hover:bg-gray-200 cursor-pointer"
                  >
                    <td class="p-5 overflow-hidden overflow-ellipsis">
                      {{ moment(operation.createdDate).format("YYYY-MM-DD") }}
                    </td>
                    <td class="p-5 overflow-hidden overflow-ellipsis">
                      {{ operation.reason }}
                    </td>
                    <td class="p-5 overflow-hidden overflow-ellipsis">{{ operation.isDeposit }}</td>
                    <td class="p-5 overflow-hidden overflow-ellipsis">{{ operation.amount }}</td>
                    <td class="p-5 overflow-hidden overflow-ellipsis">
                      {{ operation.balance }}
                    </td>
                  </tr>
                </template>
                <template #desktop-empty>
                  <!-- Workaround for using colspan -->
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="5" class="polygons-bg">
                      <div class="flex items-center pl-56 space-x-10 h-80">
                        <img src="/static/images/account/icons/no-addresses.svg" alt="No operations" />
                        <div class="flex flex-col space-y-2">
                          <span class="text-base">There are no operation yet</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </VcTable>
              <VcInfinityScrollLoader
                v-if="isInfinityScrollEnable"
                :loading="loading"
                distance="100"
                class="mt-9"
                @visible="loadMoreOperations()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VcRadioButton, VcButton, VcSelect, ITableColumn, VcTable, VcInfinityScrollLoader } from "@/components";
import { useLoyalty, AddPointOperationDialog, AccountNavigation } from "@/shared/account";
import { onMounted, ref, watch } from "vue";
import moment from "moment";
import { usePopup } from "@/shared/popup";
import _ from "lodash";

const { loading, userBalance, loadUserBalance, loadPointsOperations, pages, itemsPerPage, page } = useLoyalty();
const { openPopup } = usePopup();

const isInfinityScrollEnable = ref(false);
const scrollMode = ref("pagination");
const itemsPerPageStr = ref("10");

const columns = ref<ITableColumn[]>([
  {
    id: "createdDate",
    title: "CreatedDate",
    sortable: true,
  },
  {
    id: "reason",
    title: "Reason",
  },
  {
    id: "isDeposit",
    title: "IsDeposit",
  },
  {
    id: "amount",
    title: "Amount",
  },
  {
    id: "balance",
    title: "Balance",
  },
]);

const onPageChange = async (newPage: number) => {
  page.value = newPage;
  await loadPointsOperations();
};

async function loadMoreOperations() {
  const operations = userBalance.value?.pointsOperations;
  page.value++;
  await loadPointsOperations();
  userBalance.value!.pointsOperations = operations!.concat(userBalance.value!.pointsOperations);
}

const addOperation = () => {
  openPopup({
    component: AddPointOperationDialog,
  });
};

watch(itemsPerPageStr, async () => {
  itemsPerPage.value = +itemsPerPageStr.value;
  page.value = 1;
  await loadPointsOperations();
});

watch(scrollMode, async () => {
  isInfinityScrollEnable.value = scrollMode.value === "scroll";
  page.value = 1;
  await loadPointsOperations();
});

onMounted(async () => {
  itemsPerPageStr.value = itemsPerPage.value.toString();
  loadUserBalance();
  loadPointsOperations();
});
</script>

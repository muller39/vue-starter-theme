import { computed, readonly, ref, Ref } from "vue";
import { PointsOperationType, SearchPointsOperationsResultType, UserBalanceType } from "@core/api/graphql/types";
import { registerPointsOperation } from "@core/api/graphql/account";
import { Logger } from "@core/utilities";
import { currentUserId, storeId } from "@core/constants";
import getUserBalance from "@/core/api/graphql/account/queries/getUserBalance";
import getPointsOperations from "@/core/api/graphql/account/queries/getPointsOperations";

const userBalance: Ref<UserBalanceType | null> = ref(null);

export default () => {
  const loading: Ref<boolean> = ref(false);
  const itemsPerPage: Ref<number> = ref(10);
  const pages: Ref<number> = ref(0);
  const page: Ref<number> = ref(1);

  async function loadUserBalance() {
    loading.value = true;

    try {
      userBalance.value = await getUserBalance({
        includeOperations: false,
        storeId,
        userId: currentUserId,
      });
    } catch (e) {
      Logger.error("useLoyalty.loadUserBalance", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function loadPointsOperations() {
    loading.value = true;

    try {
      const response: SearchPointsOperationsResultType = await getPointsOperations({
        skip: (page.value - 1) * itemsPerPage.value,
        take: itemsPerPage.value,
        storeId,
        userId: currentUserId,
      });

      userBalance.value!.pointsOperations = response.results ?? [];
      pages.value = Math.ceil((response.totalCount ?? 0) / itemsPerPage.value);
    } catch (e) {
      Logger.error("useLoyalty.loadPointsOperations", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function registerOperation(amount: number, reason: string) {
    loading.value = true;

    try {
      await registerPointsOperation({
        command: {
          amount,
          reason,
          userId: currentUserId,
          storeId,
        },
      });
    } catch (e) {
      Logger.error("useLoyalty.registerOperation", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    loadUserBalance,
    loadPointsOperations,
    registerOperation,
    loading: readonly(loading),
    itemsPerPage,
    pages,
    page,
    userBalance: computed(() => userBalance.value),
  };
};

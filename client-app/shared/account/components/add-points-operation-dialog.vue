<template>
  <VcPopup title="Add Operation">
    <div class="px-10 py-10">
      <form class="flex flex-col gap-5">
        <VcInput v-model="reason" label="Reason" is-required></VcInput>
        <VcInput v-model="amount" label="Amount" type="number" is-required></VcInput>
      </form>
    </div>
    <template #actions="{ close }">
      <VcButton is-submit class="uppercase px-5 py-5" @click="addPointsOperation()"> Add operation </VcButton>
      <VcButton class="uppercase px-5 py-5" @click="close"> Close modal </VcButton>
    </template>
  </VcPopup>
</template>

<script setup lang="ts">
import { useLoyalty } from "@/shared/account";
import { VcPopup, VcInput, VcButton } from "@/components";
import { ref } from "vue";
import { usePopup } from "@/shared/popup";

const { registerOperation, loadPointsOperations, loadUserBalance } = useLoyalty();
const { closePopup } = usePopup();

const reason = ref("");
const amount = ref(0);

async function addPointsOperation() {
  await registerOperation(+amount.value, reason.value);
  await loadUserBalance();
  await loadPointsOperations();
  closePopup();
}
</script>

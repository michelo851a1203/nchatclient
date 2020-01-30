<template>
  <div class="order-2 sm:order-3 px-3 py-3 bg-gray-bgsearchbar">
    <div class="relative bg-gray-searchbar rounded-lg">
      <svg
        class="w-6 absolute ml-1 mt-1 fill-current text-gray-searchplaceholder"
        viewBox="0 0 1792 1792"
      >
        <path
          d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"
        />
      </svg>
      <!-- TODO:這裡長度在縮小至平板和太小時要調整 -->
      <input v-model="search"
        class="max-w-searchbar focus:outline-none bg-gray-searchbar text-gray-listmiddle rounded-lg placeholder-gray-searchplaceholder pl-8 w-full h-8"
        placeholder="输入关键词查找下级用户"
        type="text"
        name
        id
      />
    </div>
  </div>
</template>

<script>
import { createHelpers } from "vuex-map-fields";

const { mapFields } = createHelpers({
  getterType: "getField",
  mutationType: "updateField"
});
export default {
  computed: {
    ...mapFields(["search"])
  }
};
</script>

<style scoped lang="postcss">
</style>
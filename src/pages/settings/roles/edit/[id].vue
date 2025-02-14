<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import defaultImage from "@images/default-image.png";
import { useI18n } from "vue-i18n";
import { useRoleStore } from "@/stores/role";
import {
  alphaDashValidator,
  alphaValidator,
  betweenValidator,
  confirmedValidator,
  emailValidator,
  integerValidator,
  lengthValidator,
  passwordValidator,
  regexValidator,
  requiredValidator,
  urlValidator,
} from "@validators";
import i18n from "@/plugins/i18n";

const { t } = useI18n(); //
const store = useRoleStore();
const router = useRouter();
const route = useRoute();
const refVForm = ref();

const formData = ref({
  id: route.params.id,
  name: "",
  permissions: [],
});

watch(store.getRolesDetails, () => {
  formData.value.name = store.getRolesDetails.name;
  formData.value.permissions = store.getRolesDetails.permissions;
});

onMounted(() => {
  store.loadPermissions().then(() => {
    store.loadRoleDetails(route.params.id).then(() => {
      formData.value.name = store.getRolesDetails.name;
      for (
        let index = 0;
        index < store.getRolesDetails.permissions.length;
        index++
      ) {
        const element = store.getRolesDetails.permissions[index];
        formData.value.permissions.push(
          element.id);
      }
    });
  });
});

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.updateRoles(formData.value).then((res) => {
        router.push({
          name: "settings-roles",
        });
      });
    }
  });
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <div class="d-flex align-center pt-5 px-6">
          <VBtn
            :class="i18n.global.locale.value == 'en' ? 'mr-3' : 'ml-3'"
            variant="outlined"
            :icon="
              i18n.global.locale.value == 'en'
                ? 'tabler-arrow-left'
                : 'tabler-arrow-right'
            "
            onclick="window.history.back()"
            size="small"
          >
          </VBtn>
          <h4 class="text-h6 font-weight-bold">
            {{ $t("common.edit_role") }}
          </h4>
        </div>
        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.name"
                  :label="$t('common.name')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VRow>
                  <VCol
                    md="3"
                    cols="6"
                    v-for="(item, index) in store.getPermissions"
                    :key="index"
                  >
                    <v-checkbox
                      v-model="formData.permissions"
                      :label="$t(`permissions.${item.name}`)"
                      :value="item.id"
                      hide-details
                    ></v-checkbox>
                  </VCol>
                </VRow>
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn
                  type="submit"
                  :disabled="formData.permissions.length < 1"
                  >{{ $t("common.save_changes") }}</VBtn
                >

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'settings-roles' }"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

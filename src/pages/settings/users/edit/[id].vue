<!-- eslint-disable semi -->
<script setup>
import i18n from "@/plugins/i18n";
import { useRoleStore } from "@/stores/role";
import { useUserStore } from "@/stores/user";
import defaultImage from "@images/default-image.png";
import {
  emailValidator,
  integerValidator,
  requiredValidator,
} from "@validators";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n(); //
const store = useUserStore();
const roleStore = useRoleStore();
const isWorkingTimesDialogVisible = ref(false);
const isMapDialogVisible = ref(false);
const profileImage = ref(null);
const router = useRouter();
const route = useRoute();
const { getUserDetails } = storeToRefs(store);
const refInputEl = ref();
const refVForm = ref();

const formData = ref({
  id: route.params.id,
  name: "",
  email: "",
  phone: "",
  image: null,
  role_id: null,
});

watch(getUserDetails, () => {
  formData.value.image = getUserDetails.value.image
    ? getUserDetails.value.image
    : null;
  profileImage.value = getUserDetails.value.image
    ? getUserDetails.value.image
    : null;
  formData.value.name = getUserDetails.value.name;
  formData.value.email = getUserDetails.value.email;
  formData.value.phone = getUserDetails.value.phone;
  formData.value.role_id = getUserDetails.value.role
    ? getUserDetails.value.role.id
    : null;
});

onMounted(() => {
  const roleData = ref({
    search: "",
    page: 1,
    perPage: 10000,
  });
  roleStore.loadRoles(roleData).then(() => {
    store.loadUserDetails(route.params.id).then(() => {
      formData.value.image = getUserDetails.value.image
        ? getUserDetails.value.image
        : null;
      profileImage.value = getUserDetails.value.image
        ? getUserDetails.value.image
        : null;
      formData.value.name = getUserDetails.value.name;
      formData.value.email = getUserDetails.value.email;
      formData.value.phone = getUserDetails.value.phone;
      formData.value.role_id = getUserDetails.value.role_id ?? null;
    });
  });
});

const changeAvatar = (file) => {
  const fileReader = new FileReader();
  const { files } = file.target;
  if (files && files.length) {
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        formData.value.image = files[0];
        profileImage.value = fileReader.result;
      }
    };
  }
};

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.updateUser(formData.value).then((res) => {
        router.push({
          name: "settings-users",
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
            {{ $t("common.edit_user") }}
          </h4>
        </div>
        <VCardText class="d-flex align-end">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="profileImage ? profileImage : defaultImage"
          />

          <!-- 👉 Upload Photo -->
          <VForm class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" @click="refInputEl?.click()">
                <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                <span class="d-none d-sm-block">{{
                  $t("common.upload_photo")
                }}</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              />
            </div>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.name"
                  :label="$t('common.user_name')"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.email"
                  :label="$t('common.email')"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.phone"
                  :label="$t('common.phone')"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>

              <VCol md="6" cols="12">
                <VSelect
                  v-if="roleStore.getRoles && roleStore.getRoles.length > 0"
                  v-model="formData.role_id"
                  :label="$t('common.select_role')"
                  :items="roleStore.getRoles"
                  item-text="name"
                  item-value="id"
                  clearable
                  clear-icon="tabler-x"
                >
                  <template #chip="{ props, item }">
                    {{ item.raw.name }}
                  </template>

                  <template #item="{ props, item }">
                    <VListItem v-bind="props" :title="item?.raw?.name" />
                  </template>
                </VSelect>
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">{{ $t("common.save_changes") }}</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'settings-users' }"
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

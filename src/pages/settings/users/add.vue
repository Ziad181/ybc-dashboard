<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import defaultImage from "@images/default-image.webp";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
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
const store = useUserStore();
const roleStore = useRoleStore();
const isWorkingTimesDialogVisible = ref(false);
const isMapDialogVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const profileImage = ref(null);
const router = useRouter();

onMounted(() => {
  const roleData = ref({
    search: "",
    page: 1,
    perPage: 10000,
  });
  roleStore.loadRoles(roleData);
});

const formData = ref({
  name: "",
  email: "",
  phone: "",
  image: null,
  role_id: null,
  password: "",
  password_confirmation: "",
});

const refInputEl = ref();
const refVForm = ref();

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
      store.storeUser(formData.value).then((res) => {
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
            {{ $t("common.add_user") }}
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
                  :label="$t('common.phone_number')"
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

              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <VTextField
                  v-model="formData.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :label="$t('common.password')"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                  :rules="[requiredValidator, passwordValidator]"
                />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="formData.password_confirmation"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :label="$t('common.confirm_password')"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                  :rules="[requiredValidator, passwordValidator]"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">{{ $t("common.save") }}</VBtn>

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

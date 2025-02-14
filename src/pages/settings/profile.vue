<script setup>
import { useProfileStore } from "@/stores/profile";
import defaultImage from "@images/default-image.png";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
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
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const store = useProfileStore();
const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const uploadNewImage = ref(false);
const profileImage = ref(null);
const router = useRouter();

const accountData = ref({
  image: null,
  name: "",
  email: "",
  phone: "",
});

const passwordData = ref({
  old_password: "",
  password: "",
  password_confirmation: "",
});

const refInputEl = ref();

// reset avatar image
const resetAvatar = () => {
  accountData.value.image = null;
  profileImage.value = null;
};

const refVForm = ref();
const refVForm2 = ref();

const { getUserInfo } = storeToRefs(store);

watch(getUserInfo, () => {
  profileImage.value = getUserInfo.value.image ? getUserInfo.value.image : null;
  accountData.value.image = getUserInfo.value.image;
  accountData.value.name = getUserInfo.value.name;
  accountData.value.email = getUserInfo.value.email;
  accountData.value.phone = getUserInfo.value.phone;
});

onMounted(() => {
  setTimeout(() => {
    profileImage.value = getUserInfo.value.image
      ? getUserInfo.value.image
      : null;
    accountData.value.image = getUserInfo.value.image;
    accountData.value.name = getUserInfo.value.name;
    accountData.value.email = getUserInfo.value.email;
    accountData.value.phone = getUserInfo.value.phone;
  }, 1000);
});

const changeAvatar = (file) => {
  const fileReader = new FileReader();
  const { files } = file.target;
  if (files && files.length) {
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        accountData.value.image = files[0];
        profileImage.value = fileReader.result;
        uploadNewImage.value = true;
      }
    };
  }
};

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.updateProfile(accountData.value).then((res) => {
        
        store.loadUserInfo().then((res) => {
          uploadNewImage.value = false;
        });
      });
    }
  });
};

const onChangePasswordForm = () => {
  refVForm2.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.changePassword(passwordData.value).then((res) => {
        passwordData.value.old_password = "";
        passwordData.value.password = "";
        passwordData.value.password_confirmation = "";
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
            {{ $t("common.edit_account") }}
          </h4>
        </div>
        <VCardText class="d-flex align-end">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="
              profileImage
                ? uploadNewImage
                  ? profileImage
                  : getAssetUploadedFilesPath(profileImage)
                : defaultImage
            "
          />

          <!-- 👉 Upload Photo -->
          <form ref="refForm" class="d-flex flex-column justify-center gap-4">
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
              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">{{ $t("common.reset") }}</span>
                <VIcon icon="tabler-refresh" class="d-sm-none" />
              </VBtn>
            </div>
          </form>
        </VCardText>

        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm ref="refVForm" class="mt-6" @submit.prevent="onSubmitForm">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="accountData.name"
                  :label="$t('common.user_name')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="accountData.email"
                  :label="$t('common.email')"
                  :rules="[requiredValidator, emailValidator]"
                  type="email"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="accountData.phone"
                  :label="$t('common.phone_number')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">
                  {{ $t("common.save_changes") }}
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'settings' }"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard :title="$t('common.change_password')">
        <VForm ref="refVForm2" @submit.prevent="onChangePasswordForm">
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <VRow class="mb-3">
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <VTextField
                  v-model="passwordData.old_password"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :label="$t('common.current_password')"
                  @click:append-inner="
                    isCurrentPasswordVisible = !isCurrentPasswordVisible
                  "
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <VTextField
                  v-model="passwordData.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :label="$t('common.new_password')"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                  :rules="[requiredValidator, passwordValidator]"
                />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="passwordData.password_confirmation"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :label="$t('common.confirm_new_password')"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                  :rules="[requiredValidator, passwordValidator]"
                />
              </VCol>
            </VRow>
          </VCardText>
          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn type="submit">{{ $t("common.save_changes") }}</VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              type="reset"
              :to="{ name: 'settings' }"
            >
              {{ $t("common.cancel") }}
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>

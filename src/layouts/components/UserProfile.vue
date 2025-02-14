<script setup>
import { useRouter } from "vue-router";
import { useAppAbility } from "@/plugins/casl/useAppAbility";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const store = useProfileStore();
const storeAuth = useAuthStore();
const router = useRouter();
const ability = useAppAbility();
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
   
    <!-- <div class="d-flex"> -->
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg
        v-if="store.getUserInfo && store.getUserInfo.image"
        :src="getAssetUploadedFilesPath(store.getUserInfo.image)"
      />
      <VIcon v-else icon="tabler-user" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg
                      v-if="
                        store.getUserInfo && store.getUserInfo.image
                      "
                      :src="store.getUserInfo.image"
                    />
                    <VIcon v-else icon="tabler-user" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ store.getUserInfo.name }}
            </VListItemTitle>
            <!-- <VListItemSubtitle>{{
              store.getUserInfo.role ?? "-----"
            }}</VListItemSubtitle> -->
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem :to="{ name: 'settings-profile' }">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>{{ $t("common.profile") }}</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem :to="{ name: 'settings' }">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>{{ $t("common.settings") }}</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem link @click="storeAuth.logout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>{{ $t("common.logout") }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
    <!-- 👉 Plan name -->
    <!-- </div> -->
  </VBadge>
</template>

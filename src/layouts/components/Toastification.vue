<template>
  <div class="toastification h-100">
    <div
      class="d-flex flex-grow-1 justify-space-between align-center h-100"
    >
      <span v-if="title" class="text-med-18 text-white mb-0" v-text="title" />

      <span v-if="!hideClose" class="cursor-pointer toastification-close-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
        >
          <g
            id="Group_133755"
            data-name="Group 133755"
            transform="translate(0)"
          >
            <rect
              id="Rectangle_110483"
              data-name="Rectangle 110483"
              width="26"
              height="26"
              transform="translate(0)"
              fill="#fff"
              opacity="0"
            />
            <path
              id="close-icon"
              d="M-.339-3.137a1.031,1.031,0,0,1,0,1.458,1.031,1.031,0,0,1-1.458,0L-6.875-6.793-11.988-1.68a1.031,1.031,0,0,1-1.458,0,1.031,1.031,0,0,1,0-1.458L-8.332-8.25-13.448-13.4a1.031,1.031,0,0,1,0-1.458,1.031,1.031,0,0,1,1.458,0l5.115,5.154,5.113-5.113a1.031,1.031,0,0,1,1.458,0,1.031,1.031,0,0,1,0,1.458L-5.418-8.25Z"
              transform="translate(20.986 21)"
              fill="#fff"
            />
          </g>
        </svg>
      </span>
    </div>
  </div>
</template>
  
  <script setup>
defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  hideClose: {
    type: Boolean,
    default: false,
  },
});
</script>
  
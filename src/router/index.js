import {
  canNavigate
} from '@layouts/plugins/casl'
import {
  setupLayouts
} from 'virtual:generated-layouts'
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import routes from '~pages'
import {
  isUserLoggedIn
} from './utils'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: `/dashboard`,
    },
    {
      path: `/`,
      redirect: to => {
        const userData = JSON.parse(localStorage.getItem('albakriLoginData') || '{}')
        if (userData)
          return {
            name: 'dashboard'
          }

        return {
          name: 'login',
          query: to.query
        }
      },
    },
    ...setupLayouts(routes),
  ],
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach(to => {
  const isLoggedIn = isUserLoggedIn();
  if (canNavigate(to)) {
    if (to.meta.redirectIfLoggedIn && isLoggedIn)
      return '/'
  } else {
    if (isLoggedIn)
      return {
        name: 'not-authorized'
      }
    else
      return {
        name: 'login',
        query: {
          to: to.name !== 'index' ? to.fullPath : undefined
        }
      }
  }
})
export default router

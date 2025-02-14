import { Ability } from '@casl/ability'
import { useCookies } from "vue3-cookies"

const { cookies } = useCookies()
export const initialAbility = [
  {
    action: 'read',
    subject: 'Auth',
  },
]

//  Read ability from localStorage
// 👉 Handles auto fetching previous abilities if already logged in user
// ℹ️ You can update this if you store user abilities to more secure place
// ❗ Anyone can update localStorage so be careful and please update this
const stringifiedUserAbilities = cookies.get('yBCAbilities')
const existingAbility = stringifiedUserAbilities ? JSON.parse(stringifiedUserAbilities) : null
export default new Ability(existingAbility || initialAbility)

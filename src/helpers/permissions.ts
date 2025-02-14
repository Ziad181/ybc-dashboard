import { useProfileStore } from "@/stores/profile";

function checkPermission(el, binding) {
    const accountStore = useProfileStore();
    const { value } = binding; // the permission

    const roles = accountStore.getUserPermissions;

    if (value && value instanceof Array) {
        if (roles && value.length > 0) {
            const permissionRoles = value;            
            const hasPermission = roles.some((role) => {
                return permissionRoles.includes(role);
            });
            
            if (!hasPermission) {
                setTimeout(() => {
                    el.parentNode && el.parentNode.removeChild(el);
                }, 50);
            }
        }
    } else {
        throw new Error(`need roles! Like v-permission="['admin','editor']"`);
    }
}

export default {
    created(el, binding) {
        checkPermission(el, binding);
    },
    update(el, binding) {
        checkPermission(el, binding);
    },
};

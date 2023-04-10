/**
 * v-clickOutside
 * 点击绑定元素外的地方 此元素隐藏
 
 */
import { useAuthStore } from "@/store/auth";
import type { Directive, DirectiveBinding } from "vue";

const clickOutside: Directive = {
  mounted(elementRef: any, binding: DirectiveBinding) {
    const handler = (e: MouseEvent) => {
      // debugger
      if (elementRef.value) {
        if (elementRef.value.contains(e.target as HTMLElement)) {

          isClickOutside.value = false
        } else {

          isClickOutside.value = true
        }
      }
    }
    document.addEventListener('click', handler);
    elementRef.clickOutsidehandler = handler;
  },
  unmounted(elementRef: any) {
    document.removeEventListener('click', elementRef.clickOutsidehandler)
  }
};

export default clickOutside;

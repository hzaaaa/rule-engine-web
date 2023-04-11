/**
 * v-clickOutside
 * 点击绑定元素外的地方 此元素隐藏
 
 */
import { useAuthStore } from "@/store/auth";
import type { Directive, DirectiveBinding } from "vue";

const clickOutside: Directive = {
  mounted(el: any, binding: DirectiveBinding) {
    const handler = (e: MouseEvent) => {
      // debugger
      if (el) {
        if (el.contains(e.target as HTMLElement)) {
          return false
          // isClickOutside = false
        } else {
          // 如果绑定的参数是函数，正常情况也应该是函数，执行
          if (binding.value && typeof binding.value === 'function') {
            binding.value(e)
          }
        }
      }
    }
    document.addEventListener('click', handler);

    el.__clickOutsidehandler__ = handler;
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.__clickOutsidehandler__)

    delete el.__clickOutsidehandler__;
  }
};

export default clickOutside;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", {
    mounted(el: HTMLElement, binding) {
      const delay = binding.value?.delay ?? 0;

      el.style.opacity = "0";
      el.style.transform = "translateY(1.5rem)";
      el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(el);
    },
  });
});

<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";

const isMobileMenuOpen = ref(false);
const { y: scrollY } = useWindowScroll();
const isScrolled = computed(() => scrollY.value > 0);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const { count } = useCart();
const { loggedIn } = useUserSession();
</script>

<template>
  <div class="navigation" :class="{ scrolled: isScrolled }">
    <div class="navigation-inner">
      <button
        class="burger-menu"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div class="logo-container"><logo @click="navigateTo('/')" /></div>

      <div class="nav-buttons" :class="{ 'mobile-open': isMobileMenuOpen }">
        <orio-nav-button variant="subdued" @click="navigateTo('/')">
          Products
        </orio-nav-button>
        <orio-nav-button variant="subdued" @click="navigateTo('/print-guide')">
          Print guide
        </orio-nav-button>
        <div class="mobile-auth-buttons">
          <orio-view-separator />
          <orio-button v-if="loggedIn" @click="navigateTo('/profile')">
            Profile
          </orio-button>
          <orio-button v-else @click="navigateTo('/profile')">
            Login / Sign up
          </orio-button>
        </div>
      </div>

      <div class="icon-buttons">
        <orio-nav-button variant="subdued" icon="search" aria-label="Search" />
        <orio-nav-button
          variant="subdued"
          icon="user"
          class="desktop-only"
          aria-label="Profile"
          @click="navigateTo('/profile')"
        />
        <orio-badge type="pill">
          {{ count }}
          <template #wrapping>
            <orio-nav-button
              variant="subdued"
              icon="shopping-cart"
              aria-label="Cart"
              @click="navigateTo('/cart')"
            />
          </template>
        </orio-badge>
      </div>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="overlay"
      @click="toggleMobileMenu"
    ></div>
  </div>
</template>

<style scoped>
.navigation {
  width: 100%;
  height: var(--nav-height);
  background-color: var(--color-bg-1);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px transparent;
  transition: box-shadow 0.2s ease;
}

.navigation.scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navigation-inner {
  margin: auto;
  max-width: 60rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  gap: 1rem;
}

.burger-menu {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-text-1);
  order: 1;
}

.logo-container {
  order: 2;
  cursor: pointer;
}

.logo-container :deep(svg) {
  max-width: 230px;
  height: 100%;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  order: 3;
  text-wrap: nowrap;
}

.mobile-auth-buttons {
  display: none;
}

.icon-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  order: 4;
}

.overlay {
  display: none;
}

@media (max-width: 768px) {
  .burger-menu {
    display: block;
  }

  .logo {
    top: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-buttons {
    position: fixed;
    top: 0;
    left: -100%;
    bottom: 0;
    width: 80%;
    max-width: 500px;
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--color-bg-1);
    padding: 2rem 1rem;
    gap: 0.75rem;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    transition: left 0.3s ease-in-out;
  }

  .nav-buttons.mobile-open {
    left: 0;
  }

  .mobile-auth-buttons {
    display: flex;
    justify-content: stretch;
    flex-direction: column;
    width: 100%;
  }

  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }

  .desktop-only {
    display: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

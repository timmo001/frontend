export const applyThemePreload = () => {
  if (window.ShadyCSS) {
    window.ShadyCSS.styleSubtree(
      /** @type {!HTMLElement} */ document.documentElement,
      {
        "--primary-background-color": localStorage.getItem(
          "theme-primary-background-color"
        ),
        "--primary-text-color": localStorage.getItem(
          "theme-primary-text-color"
        ),
      }
    );
  }
};

// Starting from @types/chrome 0.3.x, a global declaration `declare var browser: typeof chrome` was added,
// which conflicts with the `declare namespace browser.*` namespace in @types/firefox-webext-browser:
// `browser` is preferentially resolved as `typeof chrome`, but there’s no `menus` property on the chrome type (the correct one being contextMenus),
// resulting in an error: "Property 'menus' does not exist on type 'typeof chrome'" when accessing `browser.menus`.
// Here, we re-export Firefox’s menus namespace onto browser to restore its original type definition.
declare namespace browser {
  export { menus };
}

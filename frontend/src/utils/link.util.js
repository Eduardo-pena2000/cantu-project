export function isLinkActive(href, path) {
  return path === href || path.startsWith(href + "/");
}

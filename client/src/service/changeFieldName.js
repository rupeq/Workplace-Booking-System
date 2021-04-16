export function changeFieldName(name) {
  let capitalName = name.charAt(0).toUpperCase() + name.slice(1);
  return capitalName.replaceAll("_", " ");
}
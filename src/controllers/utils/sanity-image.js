export const getImageUrl = (photo) => {
  if (!photo || !photo.asset || !photo.asset._ref) return null;

  const ref = photo.asset._ref;
  const [, id, dimension, format] = ref.split("-"); // e.g., image-913b6...-474x316-webp
  return `https://cdn.sanity.io/images/xmjwnf86/production/${id}-${dimension}.${format}`;
};

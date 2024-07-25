import _ from 'lodash';

const _blobToDataUrl = (blob: Blob) => new Promise<string>((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result as string);
  reader.readAsDataURL(blob);
});

const cached = new WeakMap<Blob, string>();

export const blobToDataUrl = async (blob: Blob) => {
  if (!cached.has(blob)) cached.set(blob, await _blobToDataUrl(blob));
  return cached.get(blob)!;
}
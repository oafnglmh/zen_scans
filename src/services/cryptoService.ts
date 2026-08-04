/**
 * Generates SHA-256 hash for a File or ArrayBuffer using browser Web Crypto API
 */
export async function calculateFileHash(file: File | ArrayBuffer): Promise<string> {
  const buffer = file instanceof File ? await file.arrayBuffer() : file;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// map a number from a range to another range
export function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export async function sha1(username: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(username);

  // Compute the SHA-1 hash of the data
  const buffer = await window.crypto.subtle.digest('SHA-1', data);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(buffer));
  const hexString = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hexString;
}

// map a hexgroup of 5 characters to a number between 0 and 255
export function hexgroupToNumber(hexgroup: string) {
  return map(parseInt(hexgroup, 16), 0, 1048576, 0, 255);
}

export function hexToBinary(hex: string): string {
  let binary = '';
  for (let i = 0; i < hex.length; i++) {
    const bits = parseInt(hex[i], 16).toString(2).padStart(4, '0');
    binary += bits;
  }
  return binary;
}

export function chunk(string: string, size: number) {
  const chunks = [];
  for (let i = 0; i < string.length; i += size) {
    chunks.push(string.slice(i, i + size));
  }
  return chunks;
}

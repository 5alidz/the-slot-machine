import { useEffect, useState } from 'react';

async function sha1(username: string): Promise<string> {
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

const mem: Record<string, string> = {
  '': 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
};

export function useSha(username: string) {
  const [hash, setHash] = useState(() => (!username ? mem[''] : ''));

  useEffect(() => {
    if (mem[username]) {
      setHash(mem[username]);
    } else {
      sha1(username).then((digest) => {
        setHash(digest);
        mem[username] = digest;
      });
    }
  }, [username]);

  return hash;
}

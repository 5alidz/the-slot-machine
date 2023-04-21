import { useEffect, useState } from 'react';
import { sha1 } from './utils';

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

/**
 * Encode ydid using 6 iterations of Base64.
 * Matches 95306 frontend JS: for (var i = 0; i < 6; i++) e = Base64.encode(e);
 */
export function encodeYdid6x(ydid: string): string {
  let encoded = ydid;
  for (let i = 0; i < 6; i++) {
    encoded = Buffer.from(encoded, 'utf-8').toString('base64');
  }
  return encoded;
}

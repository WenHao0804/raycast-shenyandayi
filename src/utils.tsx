
function get_sid() {
  const RB = (tokenId: string, stamp: string, nonce: string) => {
    var r = nonce.substring(1, 5) + nonce.substring(3, 7),
      o = stamp.substring(stamp.length - 4, stamp.length),
      a = tokenId.substring(1, 2) + stamp.substring(6, 9),
      i = tokenId.substring(9, 11) + nonce.substring(nonce.length - 2, nonce.length),
      u = nonce.substring(4, 6) + stamp.substring(0, 2) + nonce.substring(9, 11) + stamp.substring(2, 4) + nonce.substring(0, 2) + stamp.substring(4, 6);
    return "".concat(r, "-").concat(o, "-").concat(a, "-").concat(i, "-").concat(u)
  }

  const tokenId = '650c4469ddd56a8d495eb4f0';
  const nonce = '21V8xXG4LiPzu';
  const stamp = String(Date.now());

  const ans = RB(tokenId, stamp, nonce);
  return ans;
}

export default get_sid;
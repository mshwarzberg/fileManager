export function bitRateToInt(str) {
  if (!str) {
    return "";
  }
  str = str.toLowerCase();
  let value = 0;
  if (str.endsWith("mbps")) {
    value = parseInt(str) * 1000000;
  } else if (str.endsWith("kbps")) {
    value = parseInt(str) * 1000;
  } else {
    value = parseInt(str);
  }
  return value;
}

export function intToBitRateStr(int) {
  if (int < 1000) {
    return int + "bps";
  }
  if (int < 1000000) {
    return int / 1000 + "kbps";
  } else {
    return int / 1000000 + "mbps";
  }
}

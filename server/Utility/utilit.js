function maskText(text, allowedRegex) {
  if (allowedRegex.test(text)) {
    return false;
  } else {
    return true;
  }
}
export default maskText;

// This module checks if device is a mobile device through the user agent 
const isMobile = process.client 
  ? /iPhone|iPad|iPod|Android|Mobi/i.test(navigator.userAgent) 
  : false;

export default isMobile;
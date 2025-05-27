export default defineNuxtPlugin(() => {
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
const token = import.meta.env.VITE_TAUK_TOKEN
s1.src=`https://embed.tawk.to/${token}/1iou8f1gm`;
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
setTimeout(() => s0.parentNode.insertBefore(s1,s0), 12 * 1000);
})();
})
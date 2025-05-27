<template>
  <div class="authbg table w-full h-screen">
    
    <div class="table-cell align-middle bg-gradient-to-tl from-[rgba(56,189,248,0.5)] to-[rgba(3,105,161,0.5)] to-[rgba(12,74,110,0.5)] text-center xsm:p-5">
      
      <div class="flex flex-col md:flex-row w-full h-full sm:h-fit max-w-4xl mx-auto xsm:rounded-2xl overflow-hidden">
        
        <div class="radial shrink-0 flex flex-col justify-center items-center md:w-[50%] h-auto p-4 xsm:p-8">

            <div class="shrink-0 w-[20%] xsm:w-[22%] md:w-[65%] mx-auto inline-block mb-2">
              <img alt="DreamsTorchlight logo" class="w-full" src="/assets/torchlogo.png" />
            </div>
            
            <div class="w-full text-white text-base font-round mb-2">
              <p class="font-semibold">Welcome to DreamsTorchlight Forum</p>
              This forum is for the discussion and interpretation of dreams. Connect, Discuss, and Grow.
            </div>
            
            <div class="flex justify-center">
              <NuxtLink to="/" class="text-xs text-[#01153e] font-semibold">Home Page</NuxtLink>
            </div>

        </div>


        <div class="grow w-full h-auto bg-white xsm:bg-white/95 dark:bg-slate-950/95 p-4 text-start">
          <slot />
        </div>
      </div>
      
    </div>
    
  </div>
</template>

<style>
.authsep {
  @apply grow border-b border-slate-300 dark:border-slate-700
}

.authbg {
  background-image: url('/assets/bg/serene1.jpg');
  background-size: cover;
  background-position: center;
  animation: bgChange 18s infinite;
}

.radial {
  background: rgba(12, 74, 110, 0.7); /* Fallback solid color with transparency */
  background: -moz-radial-gradient(circle at 50% 20%, rgba(56,189,248,0.7), rgba(3,105,161,0.7), rgba(12,74,110,0.7)); /* Firefox */
  background: -webkit-radial-gradient(circle at 50% 20%, rgba(56,189,248,0.7), rgba(3,105,161,0.7), rgba(12,74,110,0.7)); /* Safari, Chrome */
  background: -o-radial-gradient(circle at 50% 20%, rgba(56,189,248,0.7), rgba(3,105,161,0.7), rgba(12,74,110,0.7)); /* Opera */
  background: -ms-radial-gradient(circle at 50% 20%, rgba(56,189,248,0.7), rgba(3,105,161,0.7), rgba(12,74,110,0.7)); /* IE 10+ */
  background: radial-gradient(circle at 50% 20%, rgba(56,189,248,0.7), rgba(3,105,161,0.7), rgba(12,74,110,0.7)); /* Standard syntax */
}

@media (min-width: 641px) {
  @keyframes bgChange {
    0% { background-image: url('/assets/bg/serene1.jpg'); }
    33.33% { background-image: url('/assets/bg/serene2.jpg'); }
    66.66% { background-image: url('/assets/bg/serene3.jpg'); }
    100% { background-image: url('/assets/bg/serene1.jpg'); } /* Loop back to the first image */
  }
}
</style>
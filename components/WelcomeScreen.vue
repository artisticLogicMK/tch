<script setup>
import { useAuthStore } from '~/store/auth'
import { vanishIn, zoomInBottom, skewInLeft, skewInRight, vanishOut, zoomOutBottom, skewOutLeft, skewOutRight } from 'animate4vue'
import Button from '@/components/ui/button/Button.vue'

const auth = useAuthStore()

const appear = ref(false)

onMounted(() => {
  appear.value = true
})
</script>

<template>
<div class="fixed top-0 left-0 z-[9999] h-full w-full h-full overflow-y-auto">

  <div id="welcome" class="radial table w-full h-full px-4 py-5 overflow-hidden">
  
    <div class="table-cell align-middle text-center">
      
      <div class="w-full max-w-xs md:max-w-sm inline-block mb-5">
        <Transition @enter="vanishIn" @leave="vanishOut" @after-leave="$emit('close')" data-av-duration="2">
          <img v-if="appear" alt="DreamsTorchlight logo" class="w-full" src="/assets/torchlogo.png" />
        </Transition>
      </div>
      

      <Transition @enter="zoomInBottom" @leave="zoomOutBottom"data-av-blur="3" data-av-delay="1.5" data-av-duration="1">
        <div v-if="appear" class="w-full max-w-md mx-auto text-white text-lg font-round mb-5">
          <p class="font-semibold">Welcome to DreamsTorchlight Forum</p>
          This forum is for the discussion and interpretation of dreams. Connect, Discuss, and Grow.
        </div>
      </Transition>
      
      <div class="flex justify-center space-x-5">
        <Transition @enter="skewInLeft" @leave="skewOutLeft"  data-av-blur="3" data-av-delay="1.7" data-av-offset="100vw" data-av-duration="1.5">
          <NuxtLink v-if="appear && !auth.isAuthenticated" to="/signup" @click="appear=false">
            <Button class="bg-[#01153e] text-white hover:bg-[#01153e]/80" style="color:white">Join</Button>
          </NuxtLink>
        </Transition>
        
        <Transition @enter="skewInRight" @leave="skewOutRight" data-av-blur="3" data-av-delay="1.7" data-av-offset="100vw" data-av-duration="1.5">
          <Button @click="appear=false" v-if="appear">
            {{  auth.isAuthenticated ? 'Continue' : 'Explore as Guest' }}</Button>
        </Transition>
      </div>
      
    </div>
  
  </div>
  
</div>
</template>

<style>
#welcome {
  background: #0c4a6e; /* Fallback solid color */
  background: -moz-radial-gradient(circle at 50% 20%, #38bdf8, #0369a1, #0c4a6e); /* Firefox */
  background: -webkit-radial-gradient(circle at 50% 20%, #38bdf8, #0369a1, #0c4a6e); /* Safari, Chrome */
  background: -o-radial-gradient(circle at 50% 20%, #38bdf8, #0369a1, #0c4a6e); /* Opera */
  background: -ms-radial-gradient(circle at 50% 20%, #38bdf8, #0369a1, #0c4a6e); /* IE 10+ */
  background: radial-gradient(circle at 50% 20%, #38bdf8, #0369a1, #0c4a6e); /* Standard syntax */
}
</style>
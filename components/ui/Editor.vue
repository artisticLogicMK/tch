<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Emoji from '@/components/ui/Emoji.vue'

const model = defineModel() // Binding content model
const props = defineProps(['content'])

const quillEditor = ref(null)
const emojiPopup = ref(null)
const emojiPopupVisible = ref(false)
const emojiPopupPos = ref({ top: 0, left: 0 })
let quill = null

// Hide emoji popup when clicking outside
onClickOutside(emojiPopup, () => {
  emojiPopupVisible.value = false
})

onMounted(async () => {
  if (process.client) {
    const Quill = (await import('quill')).default

    // Register custom font sizes
    const Size = Quill.import('attributors/style/size')
    Size.whitelist = ['0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.5rem', '1.875rem']
    Quill.register(Size, true)

    nextTick(() => {
      if (quillEditor.value) {
        quill = new Quill(quillEditor.value, {
          theme: 'snow',
          modules: { toolbar: '#toolbar' },
          placeholder: 'Type contents here...\nType semicolon : to select emoji'
        })

        // If there is pre-saved content, load it
        if (props.content) quill.clipboard.dangerouslyPasteHTML(props.content)

        // Update the model when the editor content changes
        quill.on('text-change', () => {
          model.value = {
            html: quill.root.innerHTML,
            text: quill.getText()
          }
        })

        // Detects when semicolon (:) is typed to invoke emoji popup
        quill.on('text-change', (delta, oldDelta, source) => {
          if (source === 'user') {
            const range = quill.getSelection()
            if (range && quill.getText()[range.index - 1] === ':') {
              showPopup(range.index)
              quill.deleteText(range.index - 1, 1) // Remove the :
            }
          }
        })

        // When emoji button is clicked, show the emoji popup
        document.getElementById('emoji-btn')?.addEventListener('click', (e) => {
          e.preventDefault()
          quill.focus()
          const range = quill.getSelection()
          if (range) showPopup(range.index)
        })
      }
    })
  }
})

// Function to show emoji popup at cursor position
const showPopup = (index) => {
  if (!quill) return
  const bounds = quill.getBounds(index)
  emojiPopupPos.value = { top: bounds.top + 30, left: bounds.left }
  emojiPopupVisible.value = true
}

// Function to insert selected emoji into the editor
const setEmoji = (emoji) => {
  if (!quill) return
  const range = quill.getSelection()
  if (!range) quill.focus()
  quill.insertText(range?.index || 0, emoji)
}

onUnmounted(() => {
  if (quill) {
    quill = null
  }
})
</script>


<template>
  <div>

    <div id="toolbar" class="relative">
      <!-- Text Formatting -->
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
    
      <!-- Headings -->
      <span class="ql-formats">
        <select class="ql-header">
          <option selected></option>
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
        </select>
      </span>
      
      <!-- Text Color & Background -->
      <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
    
      <!-- Blockquote -->
      <span class="ql-formats">
        <button class="ql-blockquote"></button>
      </span>
    
      <!-- Text Alignment -->
      <span class="ql-formats">
        <select class="ql-align"></select>
      </span>
    
      <!-- Lists & Indents -->
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
      </span>
    
      <!-- Font Size & Font Family -->
      <span class="ql-formats">
        <select class="ql-size">
          <option value="0.875rem" selected="">Normal</option>
          <option value="0.75rem">Extra Small</option>
          <option value="0.875rem">Small</option>
          <option value="1rem">Medium</option>
          <option value="1.125rem">Large</option>
          <option value="1.25rem">Extra Large</option>
          <option value="1.5rem">Extra Large 2</option>
          <option value="1.875rem">Extra Large 3</option>
        </select>
        
        <!--<select class="ql-font"></select>-->
      </span>

      <!-- Embeds: Links, Video.. -->
      <span class="ql-formats">
        <button id="emoji-btn">
          <img src="/assets/smiley.png" class="w-5" />
        </button>
        <button class="ql-link"></button>
        <button class="ql-video"></button>
      </span>
      
      <!-- Script (Subscript & Superscript) -->
      <span class="ql-formats">
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
      </span>
    
      <!-- Remove Formatting -->
      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    </div>

    <div class="relative">
      <div ref="quillEditor" class="torch-doc"></div>
      
      <div
        ref="emojiPopup"
        v-if="emojiPopupVisible" 
        class="emojiPopup" 
        :style="{ top: `${emojiPopupPos.top}px`, lefth: `${emojiPopupPos.left}px` }"
      >
        <Emoji @emojiSelected="setEmoji" />
      </div>
    </div>
    
  </div>
</template>


<style>
/* emojiPopup Styling */
.emojiPopup {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  @apply absolute w-full
}

.ql-container {
  @apply rounded-b-md
}

.ql-editor { 
  @apply text-[14px] text-slate-700 dark:text-slate-200 relative min-h-[200px]
}

.ql-editor::before {
  @apply text-sm leading-7 text-slate-400 dark:text-slate-500
}

.ql-container.ql-snow, .ql-toolbar.ql-snow{
  @apply border border-slate-200/80 dark:border-slate-900
}
.ql-toolbar.ql-snow{
  @apply rounded-t-md border-b-0
}

#toolbar * {
  @apply border-slate-200/80 dark:border-slate-900
}

#toolbar span {
  @apply border-none
}
#toolbar span svg {
  @apply text-slate-600 dark:text-slate-300
}
#toolbar span svg {
  fill: transparent !important;
  stroke: currentColor !important;
}

#toolbar span svg * {
  fill: inherit !important;
  stroke: inherit !important;
}

#toolbar span.ql-picker-label, #toolbar span.ql-picker-item {
  @apply text-slate-600 dark:text-slate-300
}
#toolbar .ql-picker-options{
  @apply bg-white dark:bg-slate-950
}


/* SVG Icons inside buttons should also change */
#toolbar .ql-active svg,
#toolbar button:hover svg,
#toolbar button:focus svg {
  stroke: #0284c7 !important;
}

.dark #toolbar .ql-active svg,
.dark #toolbar button:hover svg,
.dark #toolbar button:focus svg {
  stroke: #0ea5e9 !important;
}

/* Reset inactive SVGs */
#toolbar button:not(.ql-active) svg {
  fill: transparent !important;
  stroke: currentColor !important;
}

#toolbar .ql-picker-label.ql-active, .dark #toolbar .ql-picker-label.ql-active {
  @apply text-sky-600 dark:text-sky-500
}

.ql-tooltip {
  left: 50% !important;
  transform: translateX(-50%) !important;
  text-align: center;
  z-index: 1000;
}

.dark .ql-tooltip {
  @apply bg-slate-900 border-slate-800 shadow-md text-slate-600 dark:text-slate-300
}

.dark .ql-tooltip input {
  @apply bg-transparent border-slate-200/80 dark:border-slate-900
}

.ql-picker-options span[data-value="0.75rem"] {
  font-size: 0.75rem;
}
.ql-picker-options span[data-value="0.875rem"] {
  font-size: 0.875rem;
}
.ql-picker-options span[data-value="1rem"] {
  font-size: 1rem;
}
.ql-picker-options span[data-value="1.125rem"] {
  font-size: 1.125rem;
}
.ql-picker-options span[data-value="1.25rem"] {
  font-size: 1.25rem;
}
.ql-picker-options span[data-value="1.5rem"] {
  font-size: 1.5rem;
}
.ql-picker-options span[data-value="1.875rem"] {
  font-size: 1.875rem;
}
</style>
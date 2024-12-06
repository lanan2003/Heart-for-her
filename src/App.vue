<template>
  <div class="container" :class="{ 'fade-out': isButtonClicked }">
    <button 
      v-if="!isButtonClicked" 
      class="cute-button"
      @click="handleClick"
    >
      请碰一下我，陈秀小朋友
    </button>
    
    <div v-else class="message-container">
      <span class="typing-text">希望你每天开心</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isButtonClicked = ref(false)

const handleClick = () => {
  isButtonClicked.value = true
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ffd1dc, #e6e6fa);
  transition: opacity 0.5s;
}

.cute-button {
  padding: 15px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 25px;
  background: linear-gradient(45deg, #ff69b4, #ff1493);
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.cute-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.message-container {
  text-align: center;
}

.typing-text {
  font-size: 2em;
  color: #ff1493;
  font-weight: bold;
  display: inline-block;
  animation: typing 3s steps(20) infinite;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid #ff1493;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

.fade-out {
  animation: fadeOut 1s forwards;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style> 
<template>
  <div class="container">
    <div class="black-overlay" :class="{ 'fade-to-black': showBlackOverlay }"></div>
    
    <div class="content" :class="{ 'fade-out': showSakura }">
      <button 
        v-if="currentStep === 'initial'" 
        class="cute-button"
        @click="handleInitialClick"
      >
        请碰一下我，陈秀小朋友
      </button>

      <div v-if="currentStep === 'question1'" class="question-container">
        <div class="question">你喜欢我吗？</div>
        <div class="options">
          <button class="option-button" @click="handleQ1Answer('A')">喜欢</button>
          <button class="option-button" @click="handleQ1Answer('B')">不喜欢</button>
        </div>
      </div>

      <div v-if="currentStep === 'question2'" class="question-container">
        <div class="question">那你有多喜欢呢？</div>
        <div class="options">
          <button class="option-button" @click="handleQ2Answer('A')">很喜欢</button>
          <button class="option-button" @click="handleQ2Answer('B')">一般般喜欢</button>
        </div>
      </div>
      
      <div v-if="currentStep === 'blessing'" class="message-container">
        <div class="typing-text chinese">希望你每天开心</div>
        <div class="typing-text english-1">I hope you stay happy every day</div>
        <div class="typing-text english-2">and keep worries at bay</div>
      </div>
    </div>

    <div v-if="showSakura" class="sakura-container">
      <div v-for="n in 50" :key="n" class="sakura" :style="randomStyle()">
        <img src="/images/sakura.png" alt="sakura" />
      </div>
    </div>

    <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-content">{{ dialogMessage }}</div>
        <button class="dialog-button" @click="closeDialog">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref('initial')
const showSakura = ref(false)
const showDialog = ref(false)
const dialogMessage = ref('')
const showBlackOverlay = ref(false)

const handleInitialClick = () => {
  currentStep.value = 'question1'
}

const showDialogMessage = (message) => {
  dialogMessage.value = message
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  if (dialogMessage.value === '寒心，真寒心！') {
    currentStep.value = 'initial'
  }
}

const handleQ1Answer = (answer) => {
  if (answer === 'A') {
    currentStep.value = 'question2'
  } else {
    showDialogMessage('不可以不喜欢！')
  }
}

const handleQ2Answer = (answer) => {
  if (answer === 'A') {
    currentStep.value = 'blessing'
    showSakura.value = true
    
    setTimeout(() => {
      showBlackOverlay.value = true
      
      setTimeout(() => {
        router.push('/final')
      }, 3000)
    }, 11000)
  } else {
    showDialogMessage('寒心，真寒心！')
  }
}

const randomStyle = () => {
  const randomLeft = Math.random() * 100
  const randomDelay = Math.random() * 10
  const randomDuration = 5 + Math.random() * 5
  const randomSize = 30 + Math.random() * 20
  const randomRotate = Math.random() * 360
  
  return {
    '--left': `${randomLeft}vw`,
    '--delay': `${randomDelay}s`,
    '--duration': `${randomDuration}s`,
    '--size': `${randomSize}px`,
    '--rotate': `${randomRotate}deg`
  }
}
</script>

<style>
/* 重置全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffd1dc, #e6e6fa);
}
</style>

<style scoped>
/* 复制原 App.vue 中的所有 scoped 样式到这里 */
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: 20px;
}

.content {
  text-align: center;
  transition: opacity 0.5s;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
}

.cute-button {
  padding: 15px 30px;
  font-size: clamp(1.2em, 5vw, 1.5em);
  border: none;
  border-radius: 30px;
  background: linear-gradient(45deg, #ff69b4, #ff1493);
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.cute-button:active {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #ff1493, #ff69b4);
}

.message-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 100%;
}

.typing-text {
  font-weight: bold;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  border-right: 3px solid #ff1493;
  max-width: 100%;
  padding: 0 10px;
}

.typing-text.chinese {
  font-size: clamp(1.8em, 7vw, 2.5em);
  color: #ff1493;
  animation: typingChinese 2s steps(20), blink 0.7s step-end infinite;
}

.typing-text.english-1 {
  font-size: clamp(1.2em, 5vw, 2em);
  color: #ff69b4;
  animation: typingEnglish1 2.5s steps(30) 2s both, blink 0.7s step-end infinite;
}

.typing-text.english-2 {
  font-size: clamp(1.2em, 5vw, 2em);
  color: #ff69b4;
  animation: typingEnglish2 2s steps(20) 4.5s both, blink 0.7s step-end infinite;
}

@keyframes typingChinese {
  from { width: 0 }
  to { width: 100% }
}

@keyframes typingEnglish1 {
  from { width: 0 }
  to { width: 100% }
}

@keyframes typingEnglish2 {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink {
  from, to { border-color: transparent }
  50% { border-color: #ff1493 }
}

.fade-out {
  animation: fadeOut 2s forwards;
  animation-delay: 8s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeOut {
  0% { 
    opacity: 1;
    transform: scale(1);
  }
  100% { 
    opacity: 0;
    transform: scale(0.95);
  }
}

.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.sakura {
  position: absolute;
  top: -50px;
  left: var(--left);
  width: var(--size);
  height: var(--size);
  animation: fall var(--duration) linear var(--delay) infinite;
  transform-origin: center;
}

.sakura img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: rotate(var(--rotate));
  animation: floating 3s ease-in-out infinite;
  filter: drop-shadow(0 0 2px rgba(255, 192, 203, 0.5));
}

@keyframes fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0.3;
  }
}

@keyframes floating {
  0%, 100% {
    transform: rotate(var(--rotate)) translateX(0);
  }
  50% {
    transform: rotate(calc(var(--rotate) + 15deg)) translateX(15px);
  }
}

.question-container {
  text-align: center;
  padding: 20px;
}

.question {
  font-size: 1.8em;
  color: #ff1493;
  margin-bottom: 20px;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

.options {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.option-button {
  padding: 12px 25px;
  font-size: 1.2em;
  border: none;
  border-radius: 25px;
  background: linear-gradient(45deg, #ff69b4, #ff1493);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 80%;
  width: 300px;
}

.dialog-content {
  font-size: 1.2em;
  color: #ff1493;
  margin-bottom: 20px;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

.dialog-button {
  padding: 8px 20px;
  font-size: 1em;
  border: none;
  border-radius: 20px;
  background: linear-gradient(45deg, #ff69b4, #ff1493);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dialog-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.black-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-to-black {
  opacity: 1;
}

@media (max-width: 768px) {
  .message-container {
    padding: 10px;
    gap: 15px;
  }

  .sakura {
    transform: scale(0.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .typing-text,
  .sakura,
  .cute-button {
    animation: none;
    transition: none;
  }
}

/* 添加路由过渡效果 */
.route-enter-active,
.route-leave-active {
  transition: opacity 1s ease;
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
}
</style>
<!DOCTYPE html>
<template>
  <div class="heart-container" @click="playMusic">
    <audio ref="bgMusic" src="/music/background-music.MP3" loop></audio>
    <div class="falling-particles">
      <div v-for="particle in fallingParticles" 
           :key="particle.id"
           class="falling-particle"
           :style="getFallingParticleStyle(particle)">
      </div>
    </div>
    <div class="canvas-container">
      <div v-for="(particle, index) in visibleParticles" 
           :key="particle.id"
           :class="['particle', particle.type]"
           :style="getParticleStyle(particle)">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const bgMusic = ref(null)

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const CANVAS_CENTER_X = CANVAS_WIDTH / 2
const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2
const IMAGE_ENLARGE = 11

// 您提供的所有函数保持不变
function heartFunction(t, enlargeRatio = IMAGE_ENLARGE) {
    let x = 16 * Math.pow(Math.sin(t), 3)
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    x *= enlargeRatio
    y *= enlargeRatio
    return [x + CANVAS_CENTER_X, y + CANVAS_CENTER_Y]
}

function calculatePosition(x, y, ratio) {
    const distanceFromCenter = Math.sqrt(
        Math.pow(x - CANVAS_CENTER_X, 2) + 
        Math.pow(y - CANVAS_CENTER_Y, 2)
    )
    const btRange = 1000 / (distanceFromCenter + 1)
    const dx = ratio * btRange * (x - CANVAS_CENTER_X) / 1000
    const dy = ratio * btRange * (y - CANVAS_CENTER_Y) / 1000
    return [x - dx, y - dy]
}

function scatterInside(x, y, beta = 0.15) {
    const ratiox = -beta * Math.log(Math.random())
    const ratioy = -beta * Math.log(Math.random())
    const dx = ratiox * (x - CANVAS_CENTER_X)
    const dy = ratioy * (y - CANVAS_CENTER_Y)
    return [x - dx, y - dy]
}

const particles = ref([])
const frame = ref(0)
const animationFrame = ref(null)

const visibleParticles = computed(() => {
    return particles.value.filter(p => 
        p.x >= -10 && p.x <= CANVAS_WIDTH + 10 && 
        p.y >= -10 && p.y <= CANVAS_HEIGHT + 10
    )
})

function createBaseParticles() {
    const baseParticles = []
    let id = 0

    // 创建核心轮廓
    for (let i = 0; i < 180; i++) {
        const t = (i / 180) * 2 * Math.PI
        const [x, y] = heartFunction(t)
        baseParticles.push({
            id: id++,
            originalX: x,
            originalY: y,
            x: x,
            y: y,
            size: Math.random() * 2 + 1,
            type: 'core',
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.3 + 0.7,
            wobble: Math.random() * Math.PI * 2
        })
    }

    // 创建内部填充
    for (let i = 0; i < 120; i++) {
        const t = Math.random() * 2 * Math.PI
        let [x, y] = heartFunction(t)
        ;[x, y] = scatterInside(x, y, 0.2)
        baseParticles.push({
            id: id++,
            originalX: x,
            originalY: y,
            x: x,
            y: y,
            size: Math.random() * 1.5 + 0.5,
            type: 'inner',
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.2 + 0.5,
            wobble: Math.random() * Math.PI * 2
        })
    }

    return baseParticles
}

function updateParticles() {
    const currentTime = Date.now() / 1000
    
    particles.value = particles.value.map(p => {
        // 基础心跳动画
        const heartbeat = Math.sin(currentTime * 2) * 0.5
        
        // 每个粒子的独立运动
        const wobble = Math.sin(currentTime * p.speed + p.wobble) * 2
        
        // 计算新位置
        let [newX, newY] = calculatePosition(
            p.originalX + Math.cos(p.angle) * wobble,
            p.originalY + Math.sin(p.angle) * wobble,
            heartbeat * 30
        )

        // 添加小范围随机抖动
        newX += (Math.random() - 0.5) * 0.5
        newY += (Math.random() - 0.5) * 0.5

        return {
            ...p,
            x: newX,
            y: newY
        }
    })

    frame.value = (frame.value + 1) % 60
    animationFrame.value = requestAnimationFrame(updateParticles)
}

function getParticleStyle(particle) {
    return {
        transform: `translate3d(${particle.x}px, ${particle.y}px, 0)`,
        width: `${particle.size}px`,
        height: `${particle.size}px`
    }
}

function playMusic() {
    if (bgMusic.value && bgMusic.value.paused) {
        bgMusic.value.play()
    }
}

// 添加飘落粒子相关的状态
const fallingParticles = ref([])
const FALLING_PARTICLE_COUNT = 200

// 创建飘落粒子
function createFallingParticle() {
  return {
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * -100 - 20,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random() * 0.5 + 0.3,
    wobble: {
      speed: 0,
      amplitude: 0,
      offset: 0
    }
  }
}

// 更新飘落粒子
function updateFallingParticles() {
  fallingParticles.value = fallingParticles.value.map(particle => {
    if (particle.y > window.innerHeight - 100) {
      return createFallingParticle()
    }
    
    return {
      ...particle,
      x: particle.x,
      y: particle.y + particle.speed
    }
  })
}

// 获取飘落粒子样式
function getFallingParticleStyle(particle) {
  return {
    transform: `translate3d(${particle.x}px, ${particle.y}px, 0)`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    opacity: particle.opacity
  }
}

onMounted(() => {
    particles.value = createBaseParticles()
    updateParticles()
    
    // 添加音频自动播放
    if (bgMusic.value) {
        bgMusic.value.volume = 0.5 // 设置音量为 50%
        // 尝试播放音频
        const playPromise = bgMusic.value.play()
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("自动播放失败:", error)
            })
        }
    }
    
    // 初始化飘落粒子
    fallingParticles.value = Array.from({ length: FALLING_PARTICLE_COUNT }, createFallingParticle)
    
    // 创建动画循环
    function animate() {
      updateFallingParticles()
      requestAnimationFrame(animate)
    }
    animate()
})

onBeforeUnmount(() => {
    if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value)
    }
    // 组件卸载时停止音频
    if (bgMusic.value) {
        bgMusic.value.pause()
        bgMusic.value.currentTime = 0
    }
})
</script>

<style scoped>
.heart-container {
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  animation: fadeIn 2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.canvas-container {
  width: 640px;
  height: 480px;
  position: relative;
  z-index: 2;
}

.particle {
  position: absolute;
  border-radius: 50%;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  pointer-events: none;
}

.particle.halo {
  background: #DDA0DD;
  opacity: 0.5;
  box-shadow: 0 0 2px #DDA0DD;
}

.particle.edge {
  background: #9370DB;
  opacity: 0.8;
  box-shadow: 0 0 2px #9370DB;
}

.particle.core {
  background: #8A2BE2;
  opacity: 0.9;
  box-shadow: 0 0 3px #8A2BE2;
}

.particle.inner {
  background: #9400D3;
  opacity: 0.7;
  box-shadow: 0 0 2px #9400D3;
}

.falling-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.falling-particle {
  position: absolute;
  background: linear-gradient(135deg, #9370DB, #8A2BE2);
  border-radius: 50%;
  box-shadow: 0 0 3px #9370DB;
  pointer-events: none;
  will-change: transform;
}
</style> 
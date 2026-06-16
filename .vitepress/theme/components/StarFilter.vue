<template>
  <div class="star-filter" v-if="hasStars">
    <button
      class="star-filter-btn"
      :class="{ active: isActive }"
      @click="toggleFilter"
      :title="isActive ? '显示全部题目' : '只显示收藏题目'"
    >
      <span class="star-icon">⭐</span>
      <span>{{ isActive ? '显示全部' : '只看收藏' }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const isActive = ref(false)
const hasStars = ref(false)
const route = useRoute()
let observer = null

const toggleFilter = () => {
  isActive.value = !isActive.value
  localStorage.setItem('star-filter-active', isActive.value ? '1' : '0')
  applyFilter()
}

const applyFilter = () => {
  nextTick(() => {
    processSections()
  })
}

const processSections = () => {
  const content = document.querySelector('.v-doc .content-container')
  if (!content) return

  // 收集所有 h2 元素
  const h2List = content.querySelectorAll('h2')
  if (h2List.length === 0) return

  // 检测是否有 ⭐ 标记的 h2
  hasStars.value = Array.from(h2List).some(h2 => h2.textContent.includes('⭐'))

  // 收集每个 h2 对应的 section（h2 到下一个 h2 之间的所有元素）
  const sections = []
  const children = content.children
  let currentSection = null

  for (let i = 0; i < children.length; i++) {
    const el = children[i]
    if (el.tagName === 'H2') {
      currentSection = { h2: el, elements: [] }
      sections.push(currentSection)
    }
    if (currentSection) {
      currentSection.elements.push(el)
    }
  }

  // 应用筛选
  for (const section of sections) {
    const isStarred = section.h2.textContent.includes('⭐')
    if (isActive.value && !isStarred) {
      section.h2.dataset.starHidden = 'true'
      section.elements.forEach(el => { el.dataset.starHidden = 'true' })
    } else {
      delete section.h2.dataset.starHidden
      section.elements.forEach(el => { delete el.dataset.starHidden })
    }
  }
}

onMounted(() => {
  // 延迟执行，等待页面内容渲染完成
  setTimeout(() => {
    processSections()
    const saved = localStorage.getItem('star-filter-active')
    if (saved === '1') {
      isActive.value = true
      applyFilter()
    }
  }, 300)

  // 监听内容区域 DOM 变化
  const content = document.querySelector('.v-doc')
  if (content) {
    observer = new MutationObserver(() => {
      processSections()
      if (isActive.value) applyFilter()
    })
    observer.observe(content, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// 路由变化时重新检测和筛选
watch(() => route.path, () => {
  isActive.value = false
  hasStars.value = false
  setTimeout(() => {
    processSections()
    const saved = localStorage.getItem('star-filter-active')
    if (saved === '1') {
      isActive.value = true
      applyFilter()
    }
  }, 300)
})
</script>

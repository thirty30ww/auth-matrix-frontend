import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from "./router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/style/index.css'

// 导入所有 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入 stores
import { useThemeStore } from '@/stores'
import { useTabsStore } from '@/stores'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 先初始化Pinia
app.use(pinia)

// 初始化各种 store 状态
const themeStore = useThemeStore()
const tabsStore = useTabsStore()

// 初始化主题（应用到DOM）
themeStore.initializeTheme()
// 确保首页标签存在
tabsStore.initializeTabs()

// 再初始化路由
app.use(router)

app.use(ElementPlus, {
    locale: zhCn,
    // 全局配置组件默认属性
    button: {
        round: true
    }
})

app.mount('#app')

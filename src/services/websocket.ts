import { useAuthStore } from '@/stores/auth.ts'
import SockJS from 'sockjs-client'
import { Client, type IFrame } from '@stomp/stompjs'

/**
 * WebSocket 服务类
 * 负责管理 WebSocket 连接、重连、断开等操作
 */
class WebSocketService {
  // STOMP 客户端实例
  private client: Client | null = null
  
  // 连接状态标志
  private connected = false
  
  // 连接过程的 Promise，用于等待连接完成
  // 当多个地方同时调用 connect() 时，可以共享同一个连接过程
  private connectPromise: Promise<void> | null = null
  
  // Promise 的 resolve 函数，在连接成功时调用
  private connectResolve: (() => void) | null = null

  /**
   * 连接 WebSocket
   * 
   * 功能：
   * 1. 检查是否已连接或正在连接，避免重复连接
   * 2. 获取 token 并创建 WebSocket 连接
   * 3. 返回 Promise，可以等待连接完成
   * 
   * @returns Promise<void> 连接完成的 Promise
   */
  connect() {
    // 情况1：已经连接成功
    if (this.connected) {
      console.log('WebSocket 已连接')
      // 返回已完成的 Promise 或创建一个新的已完成 Promise
      return this.connectPromise || Promise.resolve()
    }

    // 情况2：正在连接中（有其他地方已经调用了 connect）
    if (this.connectPromise) {
      console.log('WebSocket 正在连接中，返回现有 Promise')
      return this.connectPromise
    }

    // 情况3：首次连接，开始建立连接
    const authStore = useAuthStore()
    const token = authStore.accessToken

    // 检查 token 是否存在
    if (!token) {
      console.error('未找到 token，无法连接 WebSocket')
      return Promise.reject(new Error('未找到 token'))
    }

    // 创建一个 Promise 来跟踪连接过程
    // 这个 Promise 会在 onConnect 回调中被 resolve
    this.connectPromise = new Promise<void>((resolve) => {
      this.connectResolve = resolve
    })

    // 创建 STOMP 客户端配置
    this.client = new Client({
      // WebSocket 工厂函数：创建底层的 WebSocket 连接
      webSocketFactory: () => {
        // 使用 SockJS 作为 WebSocket 的兼容层
        // 通过 URL 参数传递 token（因为 SockJS 不支持自定义请求头）
        return new SockJS(`http://localhost:8080/ws?token=${token}`)
      },
      
      // 调试日志函数
      debug: (str) => {
        console.log('STOMP:', str)
      },
      
      // 重连配置：连接断开后，等待 5 秒自动重连
      reconnectDelay: 5000,
      
      // 心跳配置：每 4 秒接收一次服务器心跳
      heartbeatIncoming: 4000,
      
      // 心跳配置：每 4 秒向服务器发送一次心跳
      heartbeatOutgoing: 4000,
      
      // 回调：连接成功时触发
      onConnect: (frame: IFrame) => {
        console.log('WebSocket 连接成功', frame)
        this.connected = true
        
        // 连接成功，调用 resolve 函数，让等待的 Promise 完成
        if (this.connectResolve) {
          this.connectResolve()
          this.connectResolve = null // 清空，避免重复调用
        }
      },
      
      // 回调：STOMP 协议错误时触发
      onStompError: (frame: IFrame) => {
        console.error('STOMP 错误:', frame.headers['message'])
        this.connected = false
      },
      
      // 回调：WebSocket 连接关闭时触发
      onWebSocketClose: () => {
        console.log('WebSocket 连接关闭')
        this.connected = false
        
        // 重置 Promise 相关变量，以便下次重连时可以创建新的 Promise
        this.connectPromise = null
        this.connectResolve = null
      },
      
      // 回调：WebSocket 错误时触发
      onWebSocketError: (event) => {
        console.error('WebSocket 错误:', event)
      }
    })

    // 激活客户端，开始连接
    this.client.activate()
    console.log('正在连接 WebSocket...')

    // 返回连接 Promise，调用者可以 await 等待连接完成
    return this.connectPromise
  }

  /**
   * 等待 WebSocket 连接成功
   * 
   * 使用场景：
   * - 在加载数据前，确保 WebSocket 已连接
   * - 避免因连接未完成导致的数据不准确问题
   * 
   * 工作原理：
   * 1. 如果已连接，立即返回 true
   * 2. 如果未连接，调用 connect() 并等待
   * 3. 使用 Promise.race 实现超时机制
   * 4. 超时或失败时返回 false，不会阻塞程序
   * 
   * @param timeout 超时时间（毫秒），默认 5000ms
   * @returns Promise<boolean> 连接是否成功
   */
  async waitForConnection(timeout = 5000): Promise<boolean> {
    // 如果已经连接，直接返回成功
    if (this.connected) {
      return true
    }

    try {
      // 调用 connect() 获取连接 Promise
      const connectPromise = this.connect()

      // 使用 Promise.race 实现超时机制
      // 哪个 Promise 先完成就返回哪个结果
      await Promise.race([
        connectPromise, // 连接 Promise
        new Promise<void>((_, reject) =>
          // 超时 Promise：在指定时间后 reject
          setTimeout(() => reject(new Error('WebSocket 连接超时')), timeout)
        )
      ])

      // 如果走到这里，说明连接成功（没有超时）
      return true
    } catch (error) {
      // 连接失败或超时
      console.error('等待 WebSocket 连接失败:', error)
      return false
    }
  }

  /**
   * 断开 WebSocket 连接
   * 
   * 使用场景：
   * - 用户登出时
   * - 页面卸载时
   * - 需要手动断开连接时
   */
  disconnect() {
    if (this.client) {
      // 调用 STOMP 客户端的 deactivate 方法断开连接
      this.client.deactivate().then(() => console.log('WebSocket 已断开'))
      this.connected = false
    }
  }

  /**
   * 检查连接状态
   * 
   * @returns boolean 是否已连接
   */
  isConnected() {
    return this.connected
  }
}

// 导出单例实例，全局共享同一个 WebSocket 连接
export const websocketService = new WebSocketService()


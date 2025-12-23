import { useAuthStore } from '@/stores/auth.ts'
import SockJS from 'sockjs-client'
import { Client, type IFrame } from '@stomp/stompjs'

class WebSocketService {
  private client: Client | null = null
  private connected = false

  /**
   * 连接 WebSocket
   */
  connect() {
    if (this.connected) {
      console.log('WebSocket 已连接')
      return
    }

    const authStore = useAuthStore()
    const token = authStore.accessToken

    if (!token) {
      console.error('未找到 token，无法连接 WebSocket')
      return
    }

    // 创建 STOMP 客户端
    this.client = new Client({
      webSocketFactory: () => {
        // 通过 URL 参数传递 token（SockJS 不支持自定义请求头）
        return new SockJS(`http://localhost:8080/ws?token=${token}`)
      },
      debug: (str) => {
        console.log('STOMP:', str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame: IFrame) => {
        console.log('WebSocket 连接成功', frame)
        this.connected = true
      },
      onStompError: (frame: IFrame) => {
        console.error('STOMP 错误:', frame.headers['message'])
        this.connected = false
      },
      onWebSocketClose: () => {
        console.log('WebSocket 连接关闭')
        this.connected = false
      },
      onWebSocketError: (event) => {
        console.error('WebSocket 错误:', event)
      }
    })

    this.client.activate()
    console.log('正在连接 WebSocket...')
  }

  /**
   * 断开 WebSocket
   */
  disconnect() {
    if (this.client) {
      this.client.deactivate().then(() => console.log('WebSocket 已断开'))
      this.connected = false
    }
  }

  /**
   * 检查连接状态
   */
  isConnected() {
    return this.connected
  }
}

export const websocketService = new WebSocketService()

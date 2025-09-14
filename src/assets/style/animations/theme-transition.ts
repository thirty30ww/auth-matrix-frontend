/**
 * 主题切换动画工具函数
 */

/**
 * 执行主题切换动画（使用 View Transitions API）
 * @param toggleAction 切换主题的回调函数
 * @param clickEvent 点击事件（用于动画起点）
 */
export function executeThemeTransition(
    toggleAction: () => void | Promise<void>,
    clickEvent?: MouseEvent
): void {
    // 如果没有传入事件（如程序化调用），直接切换
    if (!clickEvent) {
        toggleAction()
        return
    }

    const x = clickEvent.clientX
    const y = clickEvent.clientY

    // 计算从点击位置到屏幕边缘的最大距离
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    )

    // 检查浏览器是否支持 View Transitions API
    if (!document.startViewTransition) {
        toggleAction()
        return
    }

    // 使用 View Transitions API 创建平滑动画
    const transition = document.startViewTransition(async () => {
        await toggleAction()
    })

    // 当转换准备就绪时，添加圆形扩散动画
    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ]

        // 始终让新视图从圆圈扩散出来覆盖旧视图
        // new视图的z-index更高，所以应该是扩散效果
        document.documentElement.animate(
            {
                clipPath: clipPath, // 从小圆扩散到大圆
            },
            {
                duration: 500,
                easing: 'ease-out',
                pseudoElement: '::view-transition-new(root)', // 新视图扩散
            }
        )
    })
}
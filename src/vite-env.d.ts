/// <reference types="vite/client" />

// View Transitions API 类型声明
interface Document {
    startViewTransition?: (callback: () => void | Promise<void>) => {
        ready: Promise<void>
        finished: Promise<void>
    }
}

interface ImportMeta {
    readonly glob: (pattern: string) => Record<string, () => Promise<any>>;
}


# 兑换码

<!-- 顶部统计栏：未使用 / 已使用计数 + 清除按钮 -->
<div class="cdkey-stats">
    <span class="cdkey-stats-item">🆕 未使用 <strong>{{ unusedList.length }}</strong> 个</span>
    <span v-if="usedList.length > 0" class="cdkey-stats-item">✅ 已使用 <strong>{{ usedList.length }}</strong> 个</span>
    <NButton
        v-if="usedList.length > 0"
        size="tiny"
        text
        type="warning"
        @click="clearUsedKeys"
    >
        清除记录
    </NButton>
</div>
<!-- 未使用兑换码卡片网格 -->
<div v-if="unusedList.length > 0" class="cdkey-grid">
    <div
        v-for="item in unusedList"
        :key="item.key"
        class="cdkey-card"
    >
        <div class="cdkey-card-body">
            <div class="cdkey-label">
                <span class="cdkey-icon">🔑</span>
                <span class="cdkey-label-text">兑换码</span>
            </div>
            <code class="cdkey-code">{{ item.key }}</code>
            <div class="cdkey-date">
                <span class="cdkey-date-icon">📅</span>
                <span>{{ formatDate(item.date) }}</span>
            </div>
        </div>
        <NButton
            class="cdkey-copy-btn"
            :type="copiedKey === item.key ? 'success' : 'primary'"
            :disabled="copiedKey === item.key"
            @click="copyText(item.key)"
            block
        >
            <span v-if="copiedKey === item.key">✓ 已复制</span>
            <span v-else>📋 点击复制</span>
        </NButton>
    </div>
</div>
<!-- 全部用完时的空状态 -->
<div v-else class="cdkey-empty">
    <span class="cdkey-empty-icon">🎉</span>
    <p>所有兑换码已使用完毕</p>
    <NButton
        v-if="usedList.length > 0"
        style="margin-top: 12px"
        type="warning"
        text
        @click="clearUsedKeys"
    >
        重置记录
    </NButton>
</div>
<!-- 已使用兑换码的展开 / 收起按钮 -->
<NButton v-if="usedList.length > 0" class="cdkey-toggle" text @click="showUsed = !showUsed">
{{ showUsed ? '🔽 收起已使用' : '🔼 查看已使用的兑换码 (' + usedList.length + ')' }}
</NButton>
<!-- 已使用兑换码卡片网格（默认折叠） -->
<div v-if="showUsed && usedList.length > 0" class="cdkey-grid cdkey-grid-used">
    <div
        v-for="item in usedList"
        :key="item.key"
        class="cdkey-card cdkey-card-used"
    >
        <div class="cdkey-card-body">
            <div class="cdkey-label">
                <span class="cdkey-icon">✅</span>
                <span class="cdkey-label-text">已使用</span>
            </div>
            <code class="cdkey-code cdkey-code-used">{{ item.key }}</code>
            <div class="cdkey-date">
                <span class="cdkey-date-icon">📅</span>
                <span>{{ formatDate(item.date) }}</span>
            </div>
        </div>
        <NButton
            class="cdkey-copy-btn"
            type="default"
            @click="copyText(item.key)"
            block
            secondary
        >
            📋 再次复制
        </NButton>
    </div>
</div>

<script setup lang="ts">
    // 依赖导入
    import { NButton, useMessage, useDialog } from 'naive-ui'
    import { CDKEY } from '../data/CDKEY.ts'    // 兑换码数据源
    import { ref, computed, onMounted } from 'vue' // Vue 核心 API

    // 通过 NMessageProvider 获取 message / dialog，自动继承暗色主题
    const message = useMessage()
    const dialog = useDialog()

    // localStorage 存储键名
    const STORAGE_KEY = 'crazy-water-world-used-cdkeys'

    // 响应式状态
    const copiedKey = ref('')           // 当前刚复制成功的 key（用于按钮变绿）
    const usedKeys = ref<string[]>([])  // 已使用的 key 列表（持久化到 localStorage）
    const showUsed = ref(false)         // 是否展开已使用区域

    // 计算属性：根据 usedKeys 自动过滤列表
    const unusedList = computed(() =>
        CDKEY.filter((item) => !usedKeys.value.includes(item.key)) // 排除已使用的
    )

    const usedList = computed(() =>
        CDKEY.filter((item) => usedKeys.value.includes(item.key))  // 仅保留已使用的
    )

    // 页面挂载时从 localStorage 恢复已使用记录
    onMounted(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY) // 读取存储
            if (stored) {
                usedKeys.value = JSON.parse(stored)           // 反序列化 JSON
            }
        } catch {
            usedKeys.value = [] // 解析失败则重置为空数组
        }
    })

    // 将已使用 key 列表写入 localStorage
    const saveUsedKeys = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usedKeys.value)) // 序列化写入
        } catch {
            message.error('本地存储失败') // 无痕浏览 / 存储满时提示
        }
    }

    // 日期格式化：20260916 → 2026-09-16
    const formatDate = (date: string) => {
        if (date.length === 8) {
            return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}` // 按年月日截取
        }
        return date // 非 8 位直接原样返回
    }

    // 复制兑换码到剪贴板，并标记为已使用
    const copyText = (key: string) => {
        navigator.clipboard.writeText(key)  // 浏览器剪贴板 API
            .then(() => {
                copiedKey.value = key       // 触发按钮变绿 + 不可点击
                if (!usedKeys.value.includes(key)) {
                    usedKeys.value.push(key) // 去重后加入已使用列表
                    saveUsedKeys()           // 持久化到 localStorage
                }
                message.success('复制成功')
                setTimeout(() => {
                    copiedKey.value = ''     // 2 秒后恢复按钮初始状态
                }, 2000)
            })
            .catch(() => {
                message.error('复制失败，请手动复制') // 兜底错误提示
            })
    }

    // 清除所有已使用记录（弹窗二次确认）
    const clearUsedKeys = () => {
        dialog.warning({
            title: '确认清除',
            content: '清除记录后所有兑换码将重新显示，确定要清除吗？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                usedKeys.value = []            // 清空内存状态
                showUsed.value = false         // 折叠已使用区域
                try {
                    localStorage.removeItem(STORAGE_KEY) // 删除存储
                } catch {
                    // 静默忽略删除失败
                }
                message.success('记录已清除')
            },
        })
    }

</script>

<style scoped>

    /* ⑯ 统计栏 */
    .cdkey-stats {
        display: flex;                        /* 弹性布局水平排列 */
        align-items: center;                  /* 垂直居中 */
        gap: 16px;                            /* 子元素间距 */
        margin-bottom: 16px;                  /* 与下方卡片间距 */
        font-size: 14px;
        color: var(--vp-c-text-2, #888);      /* 自动适配亮/暗主题 */
    }

    .cdkey-stats-item strong {
        color: var(--vp-c-brand, #646cff);    /* 数字用品牌色高亮 */
    }

    /* ⑰ 卡片网格布局 */
    .cdkey-grid {
        display: grid;                                       /* 网格布局 */
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* 自适应列数：最小 240px */
        gap: 16px;                                           /* 卡片间距 */
    }

    /* ⑱ 已使用区域整体降低透明度 */
    .cdkey-grid-used {
        margin-top: 12px;     /* 与展开按钮间距 */
        opacity: 0.7;         /* 整体淡化 */
    }

    /* ⑲ 单张卡片 */
    .cdkey-card {
        border: 1px solid var(--vp-c-border, #e2e2e3);
        border-radius: 12px;                 /* 圆角 */
        overflow: hidden;                    /* 裁剪溢出（配合按钮无边角） */
        transition: all 0.25s ease;          /* 平滑过渡动画 */
        background: var(--vp-c-bg-soft, #f6f6f7);
    }

    .cdkey-card:hover {
        border-color: var(--vp-c-brand, #646cff); /* 悬浮时边框变品牌色 */
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); /* 悬浮阴影 */
        transform: translateY(-2px);                 /* 轻微上浮 */
    }

    /* ⑳ 已使用卡片样式：降低透明度 + 无品牌色 hover */
    .cdkey-card-used {
        opacity: 0.65; /* 整体进一步淡化 */
    }

    .cdkey-card-used:hover {
        opacity: 0.85;                              /* hover 时稍微恢复 */
        border-color: var(--vp-c-border, #e2e2e3);  /* 不显示品牌色边框 */
    }

    /* ㉑ 卡片内容区域 */
    .cdkey-card-body {
        padding: 20px 20px 12px;
        display: flex;
        flex-direction: column;  /* 纵向排列（标签 → 码 → 日期） */
        align-items: center;     /* 水平居中 */
        gap: 8px;               /* 元素间距 */
    }

    /* ㉒ 顶部标签行（🔑 兑换码） */
    .cdkey-label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--vp-c-text-2, #666);
        text-transform: uppercase;    /* 英文大写 */
        letter-spacing: 0.05em;       /* 字间距 */
    }

    .cdkey-icon {
        font-size: 14px;
    }

    .cdkey-label-text {
        font-weight: 500;
    }

    /* ㉓ 兑换码文字（等宽字体 + 虚线边框） */
    .cdkey-code {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace; /* 等宽字体栈 */
        font-size: 18px;
        font-weight: 700;
        color: var(--vp-c-brand, #646cff);
        background: var(--vp-c-bg, #fff);
        padding: 6px 14px;
        border-radius: 8px;
        letter-spacing: 0.08em;                              /* 字母间距更清晰 */
        border: 1px dashed var(--vp-c-brand-light, #a8abff); /* 虚线边框 */
    }

    /* ㉔ 已使用兑换码：灰色 + 删除线 */
    .cdkey-code-used {
        color: var(--vp-c-text-2, #999);      /* 灰色文字 */
        border-color: var(--vp-c-border, #ddd); /* 灰色边框 */
        text-decoration: line-through;          /* 中划线 */
    }

    /* ㉕ 日期行 */
    .cdkey-date {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--vp-c-text-2, #888);
    }

    .cdkey-date-icon {
        font-size: 13px;
    }

    /* ㉖ 底部复制按钮 */
    .cdkey-copy-btn {
        border-radius: 0 !important;  /* 覆盖 naive-ui 默认圆角，与卡片底部齐平 */
        border: none !important;      /* 去除默认边框 */
        font-size: 13px;
    }

    /* ㉗ 展开 / 收起已使用按钮 */
    .cdkey-toggle {
        margin-top: 16px;
        font-size: 13px;
    }

    /* ㉘ 空状态容器 */
    .cdkey-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        color: var(--vp-c-text-2, #888);
        border: 2px dashed var(--vp-c-border, #e2e2e3); /* 虚线边框 */
        border-radius: 12px;
    }

    .cdkey-empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
    }

    .cdkey-empty p {
        margin: 0;
        font-size: 15px;
    }

    /* ㉙ 移动端适配：屏幕 ≤ 640px 时单列 + 统计栏换行 */
    @media (max-width: 640px) {
        .cdkey-grid {
            grid-template-columns: 1fr; /* 强制单列 */
        }

        .cdkey-stats {
            flex-wrap: wrap; /* 允许换行 */
            gap: 8px;        /* 缩小间距 */
        }
    }
</style>
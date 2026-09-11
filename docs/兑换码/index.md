# 兑换码

未使用兑换码：

<div class="list-container">
    <NButton @click="copyText('BEJV1XWU')">BEJV1XWU</NButton>
    <NButton @click="copyText('yxzBGPP93X')">yxzBGPP93X</NButton>
    <NButton @click="copyText('39SJJ14')">39SJJ14</NButton>
    <NButton @click="copyText('SJJ58023')">SJJ58023</NButton>
    <NButton @click="copyText('2SJJ5064')">2SJJ5064</NButton>
</div>

<script setup lang="ts">
    import { NButton } from 'naive-ui'
    import { createDiscreteApi } from 'naive-ui'

    const { message } = createDiscreteApi(['message'])

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text)
        message.success('复制成功')
    }

</script>

<style scoped>
    .list-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        flex-direction: column;
    }
</style>

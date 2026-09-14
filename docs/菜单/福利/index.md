# 福利汇总

> 以下内容默认你自己完成益世界账号

## 微信汇总

### 疯狂水世界活动站

#### 进入方法

微信直接搜索 <NText type="primary" tag="b">疯狂水世界活动站</NText> <NButton @click="copyText('疯狂水世界活动站')" size="small" type="info">复制</NButton>

<NImage src="/crazy-water-world/image/福利/疯狂水世界活动站.png" alt="疯狂水世界" style="width: 150px;" />

#### 礼包内容

1. 企业好友专属见面礼（需要添加企业微信）
2. 水世界月度福利限时领（需要添加企业微信）

### 游戏圈

#### 进入方法

1. 加圈有礼（荒岛冒险头像框）
2. 在线礼包（每天必拿）
3. 每日抽奖（每天必拿）

<div class="flex-container">
    <NImage src="/crazy-water-world/image/福利/发现游戏.png" alt="疯狂水世界" style="width: 100px;" />
    <NImage src="/crazy-water-world/image/福利/圈子水世界.png" alt="疯狂水世界" style="width: 200px;" />
    <NImage src="/crazy-water-world/image/福利/每日抽奖.png" alt="疯狂水世界" style="width: 250px;" />
</div>

### 益世界福利中心（类似心悦会员）

#### 进入方法

微信直接搜索 <NText type="primary" tag="b">益世界福利中心</NText> <NButton @click="copyText('益世界福利中心')" size="small" type="info">复制</NButton>

<NImage src="/crazy-water-world/image/福利/益世界福利中心.png" alt="益世界福利中心" style="width: 150px;" />

<script setup lang="ts">
    import { NButton, NText, NImage } from 'naive-ui'
    import { createDiscreteApi } from 'naive-ui'

    const { message } = createDiscreteApi(['message'])

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text)
        message.success('复制成功')
    }

</script>

<style scoped>
    .flex-container {
        display: flex;
        gap: 10px;
    }
</style>

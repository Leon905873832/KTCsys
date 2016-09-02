<template>
    <div id="toast" v-show="completeToastShow">
        <div class="weui_mask_transparent"></div>
        <div class="weui_toast">
            <i class="weui_icon_toast"></i>
            <p class="weui_toast_content"><slot>已完成</slot></p>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['completeToastShow']
    }
</script>
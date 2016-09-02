<template>
    <div id="dialog1" v-show="dialogShow">
        <div class="weui_mask"></div>
        <div class="weui_dialog">
            <div class="weui_dialog_hd">
                <strong class="weui_dialog_title">
                    <slot name="dialog-head">弹窗标题</slot>
                </strong>
            </div>
            <div class="weui_dialog_bd">
                <slot name="dialog-hd">弹窗内容，告知当前页面信息等</slot>
            </div>
            <div class="weui_dialog_ft">
                <a href="javascript:void(0);" class="weui_btn_dialog default" @click="cancel">取消</a>
                <a href="javascript:void(0);" class="weui_btn_dialog primary" @click="confirm">确定</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['dialogShow'],
        methods: {
            cancel: function () {
                this.dialogShow = false;
            },
            confirm: function () {
                this.$dispatch('confirm');
                this.dialogShow = false;
            }
        }
    }
</script>
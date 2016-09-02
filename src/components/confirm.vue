<template>
    <div id="dialog2" v-show="confirm.dialogShow">
        <div class="weui_mask"></div>
        <div class="weui_dialog">
            <div class="weui_dialog_hd">
                <strong class="weui_dialog_title">
                    <slot>弹窗标题</slot>
                </strong>
            </div>
            <div class="weui_dialog_bd">{{confirm.dialogMsg}}</div>
            <div class="weui_dialog_ft">
                <a href="javascript:void(0);" class="weui_btn_dialog primary" @click="close">确定</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['confirm'],
        methods: {
            close: function () {
                this.confirm.dialogShow = false;
            }
        }
    }
</script>
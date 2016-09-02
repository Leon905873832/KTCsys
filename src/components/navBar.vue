<style type="text/css" scoped>
    .weui_bar_item_on {
        background-color: transparent;
    }
    .weui_bar_item_on:before {
        content: ' ';
        position: absolute;
        left: 0px;
        bottom: 0;
        z-index: 600;
        height: 1px;
        background-color: #04BE02;
        width: 100%;
    }
    .weui_tab_bd {
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .weui_tab_bd_wrapper {
        position: absolute;
        top: 49px;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
<template>
    <div class="weui_tab">
        <div class="weui_navbar">
            <div class="weui_navbar_item" :class="{'weui_bar_item_on':navBarData.isCurrent === $index}"
                 v-for="item in navBarData.navBarItems" @click="toggleCurrent($index)">{{item.navItem}}
            </div>
        </div>
        <div class="weui_tab_bd">
            <div class="weui_tab_bd_wrapper">
                <slot>tab页的内容</slot>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['navBarData'],
        methods: {
            // 切换当前选项
            toggleCurrent: function (index) {
                this.navBarData.isCurrent = index;
                this.$dispatch('query');
            }
        }
    }
</script>
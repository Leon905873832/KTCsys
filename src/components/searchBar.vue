<template>
    <div class="weui_search_bar" :class="{'weui_search_focusing':isFocus}">
        <form class="weui_search_outer">
            <div class="weui_search_inner">
                <i class="weui_icon_search" @click="blur"></i>
                <input type="search" class="weui_search_input" id="search_input"
                       :placeholder="searchBarData.placeholder"
                       v-model="searchBarData.keyWord" @focus="focus" @blur="blur">
                <a href="javascript:void(0);" class="weui_icon_clear" id="search_clear" @click="clear"></a>
            </div>
            <label for="search_input" class="weui_search_text" id="search_text">
                <i class="weui_icon_search"></i>
                <span>搜索</span>
            </label>
        </form>
        <a href="javascript:void(0);" class="weui_search_cancel" @click="cancel">取消</a>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                isFocus: false
            }
        },
        props: ['searchBarData'],
        methods: {
            focus: function () {
                this.isFocus = true;
            },
            clear: function () {
                this.searchBarData.keyWord = '';
            },
            cancel: function () {
                this.isFocus = false;
                this.clear();
            },
            blur: function () {
                this.$dispatch('search', this.searchBarData.keyWord);
                this.cancel();
            }
        }
    }
</script>
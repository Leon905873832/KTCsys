<style type="text/css" scoped>
    @-webkit-keyframes slideInUp {
        from {
            -webkit-transform: translate3d(0, -100%, 0);
            transform: translate3d(0, -100%, 0);
            visibility: visible;
        }

        to {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes slideInUp {
        from {
            -webkit-transform: translate3d(0, -100%, 0);
            transform: translate3d(0, -100%, 0);
            visibility: visible;
        }

        to {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
    }

    @-webkit-keyframes slideOutUp {
        from {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        to {
            visibility: hidden;
            -webkit-transform: translate3d(0, -100%, 0);
            transform: translate3d(0, -100%, 0);
        }
    }

    @keyframes slideOutUp {
        from {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        to {
            visibility: hidden;
            -webkit-transform: translate3d(0, -100%, 0);
            transform: translate3d(0, -100%, 0);
        }
    }

    .formTop-transition {
        -webkit-animation-duration: 0.2s;
        animation-duration: 0.2s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .formTop-enter {
        -webkit-animation-name: slideInUp;
        animation-name: slideInUp;
    }

    .formTop-leave {
        -webkit-animation-name: slideOutUp;
        animation-name: slideOutUp;
    }
    .prompt {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        height: 64px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background-color: #04BE02;
        color: #FFFFFF;
        font-size: 18px;
        text-align: center;
        line-height: 64px;
    }
</style>
<template>
    <div class="prompt" v-show="prompt.promptShow" transition="formTop">{{prompt.promptMsg}}</div>
</template>
<script type="text/javascript">
    export default {
        props: ['prompt'],
        methods: {
            showPrompt: function (msg) {
                // 不传msg参数,提示框不会显示
                if (msg) {
                    this.prompt.promptMsg = msg;
                    this.prompt.promptShow = true;
                }
            }
        },
        watch: {
            'prompt.promptShow':function(val){
                // val是boolean类型值
                if (val) {
                    // 提示信息2秒后自动隐藏
                    var _this = this;
                    setTimeout(function () {
                        _this.prompt.promptShow = false;
                        _this.prompt.promptMsg = '';
                    }, 1600);
                }
            }
        }
    }
</script>
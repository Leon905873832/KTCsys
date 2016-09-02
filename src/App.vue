<template>
    <router-view transition="fadeRight" transition-mode="out-in"></router-view>
</template>
<style type="text/css" scoped>
    /*转场动画*/
    .fadeRight-transition {
        -webkit-animation-duration: 0.2s;
        animation-duration: 0.2s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .fadeRight-enter {
        -webkit-animation-name: fadeIn;
        animation-name: fadeIn;
    }

    .fadeRight-leave {
        -webkit-animation-name: lightSpeedOut;
        animation-name: lightSpeedOut;
    }

    @-webkit-keyframes lightSpeedOut {
        from {
            opacity: 1;
        }

        to {
            -webkit-transform: translate3d(100%, 0, 0) skewX(30deg);
            transform: translate3d(100%, 0, 0) skewX(30deg);
            opacity: 0;
        }
    }

    @keyframes lightSpeedOut {
        from {
            opacity: 1;
        }

        to {
            -webkit-transform: translate3d(100%, 0, 0) skewX(30deg);
            transform: translate3d(100%, 0, 0) skewX(30deg);
            opacity: 0;
        }
    }
</style>
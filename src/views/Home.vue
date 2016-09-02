<template>
    <div class="container">
        <header>
            <a href="javascript:void(0)" class="logout" @click="logOut">
                <i class="iconfont">&#xe60f;</i>
            </a>
            <h1>功能列表</h1>
        </header>
        <div class="main">
            <div class="wrapper">
                <div class="weui_grids">
                    <a class="weui_grid js_grid" v-for="operate in operateList" @click="link(operate.operateUrl)">
                        <div class="weui_grid_icon">
                            <i class="iconfont">{{{operateIcon[operate.operateCode]}}}</i>
                        </div>
                        <p class="weui_grid_label">{{operate.operateName}}</p>
                    </a>
                </div>
            </div>
        </div>
        <!-- 正在加载提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在加载...</loading-toast>
        <!--退出登录对话框-->
        <dialog :dialog-show.sync="dialogShow" @confirm="confirmLogOut">
            <span slot="dialog-head">确认退出</span>
            <span slot="dialog-hd">您确定要退出吗？</span>
        </dialog>
        <!-- 加载失败提示信息 -->
        <confirm :confirm="confirm">加载失败！</confirm>
    </div>
</template>
<script>
    import loadingToast from '../components/loadingToast.vue';      // 加载时的提示框
    import dialog from '../components/dialog.vue';                  // 退出确认框
    import confirm from '../components/confirm.vue';                // ajax错误提示框
    import urlAPI from '../assets/js/urlAPI.js';
    var homeUrl = urlAPI.homeUrl;                                   // 查询操作列表接口
    export default {
        data: function () {
            return {
                operateList: {},                    // 用户操作列表
                operateIcon: {                      // 操作列表的图标
                    'REIMBURSE': '&#xe60e;',
                    'APPROVE': '&#xe610;',
                    'ENTRUST': '&#xe611;',
                    'PROJECT': '&#xe606;',
                    'REPORTS': '&#xe60d;',
                    'INVOICE': '&#xe607;',
                    'MAIN-HOURS': '&#xe60b;',
                    'CLEARANCE': '&#xe601;'
                },
                loadingToastShow: false,            // 正在加载提示框, 默认不显示
                dialogShow: false,                  //确认退出的弹框，默认不显示
                confirm: {
                    dialogShow: false,              // 设置ajax错误提示框是否显示，默认不显示
                    dialogMsg: ''                   // 提示框信息
                }
            }
        },
        components: {
            loadingToast,
            dialog,
            confirm
        },
        methods: {
            logOut: function () {
                // 显示确认退出的对话框
                this.dialogShow = true;
            },
            confirmLogOut: function () {
                // 退出登录，清除会话信息并跳转回登录界面
                window.sessionStorage.removeItem('userInfo');
                this.$route.router.go({name: 'login'});
            },

            // 跳转连接
            link: function (operateUrl) {
                // 获取的会话存储中的用户信息
                var userInfo = window.sessionStorage.getItem('userInfo');
                if (userInfo !== null) {
                    var userCode = JSON.parse(userInfo).userCode;
                }
                this.$route.router.go({name: operateUrl, query: {userCode: userCode}});
            },
        },
        created: function () {
            // ajax请求操作列表
            this.$http.get(homeUrl, {
                params: {
                    'userCode': this.$route.query.userCode
                },
                before: function () {
                    this.loadingToastShow = true
                }
            }).then(function (response) {
                var result = response.json();
                if (result.success) {
                    this.$set('operateList', result.operateList);
                } else {
                    // 显示错误信息
                    this.confirm.dialogMsg = result.error;     // 登录失败的提示信息
                    this.confirm.dialogShow = true;            // 显示弹框
                }
            }, function (response) {
                // 显示错误信息
                this.confirm.dialogMsg = '请求超时!';       // 登录失败的提示信息
                this.confirm.dialogShow = true;            // 显示弹框
            }).finally(function () {
                // 关闭提示图标
                this.loadingToastShow = false;
            });
        }
    }
</script>
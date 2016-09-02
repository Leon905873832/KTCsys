<template>
    <div class="container">
        <header>
            <a href="javascript:void(0)" class="go-back" @click="goBack">
                <i class="iconfont">&#xe600;</i>
            </a>
            <h1>修改密码</h1>
        </header>
        <div class="main">
            <div class="wrapper">
                <form action="#" method="post">
                    <div class="weui_cells weui_cells_form">
                        <div class="weui_cell">
                            <div class="weui_cell_hd">
                                <label class="weui_label" for="userCode"><i class="iconfont">&#xe602;</i></label>
                            </div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="userCode" placeholder="请输入用户名"
                                       v-model="modifyInfo.userCode" @blur="blurValid($event)">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd">
                                <label class="weui_label" for="oldPassWord"><i class="iconfont">&#xe603;</i></label>
                            </div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="password" id="oldPassword" placeholder="请输入旧密码"
                                       v-model="modifyInfo.oldPassword" @blur="blurValid($event)">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd">
                                <label class="weui_label" for="newPassword"><i class="iconfont">&#xe603;</i></label>
                            </div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="password" id="newPassword" placeholder="请输入新密码"
                                       v-model="modifyInfo.newPassword" @blur="blurValid($event)">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd">
                                <label class="weui_label" for="rePassword"><i class="iconfont">&#xe605;</i></label>
                            </div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="password" id="rePassword" placeholder="请再次输入新密码"
                                       v-model="modifyInfo.rePassword" @blur="blurValid($event)">
                            </div>
                        </div>
                    </div>
                    <div class="weui_btn_area">
                        <a class="weui_btn weui_btn_primary" href="javascript:void(0);" @click="modifyPassword">提交</a>
                    </div>
                </form>
            </div>
        </div>
        <!-- 表单验证提示信息 -->
        <prompt :prompt="prompt" v-ref:prompt></prompt>
        <!-- 正在修改提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在修改...</loading-toast>
        <!-- 修改成功提示信息 -->
        <complete-toast :complete-toast-show="completeToastShow">修改成功</complete-toast>
        <!-- 修改失败提示信息 -->
        <confirm :confirm="confirm">修改失败</confirm>
    </div>
</template>
<script>
    import prompt from  '../components/prompt.vue';                 // 表单验证时的提示信息
    import loadingToast from '../components/loadingToast.vue';      // 修改时的框
    import completeToast from '../components/completeToast.vue';    // 修改成功的提示框
    import confirm from '../components/confirm.vue';                // ajax错误提示框
    import urlAPI from '../assets/js/urlAPI.js';
    var modifyPasswordUrl = urlAPI.modifyPassword;                  // 修改密码接口
    export default {
        data: function () {
            return {
                modifyInfo: {
                    userCode: '',            // 用户登录名
                    oldPassword: '',         // 旧密码
                    newPassword: '',         // 新密码
                    rePassword: ''           // 重新输入密码
                },
                prompt: {
                    promptShow: false,              // 设置提示信息框是否显示，默认不显示
                    promptMsg: ''                   // 提示信息内容，默认为空
                },
                loadingToastShow: false,            // 修改时的正在加载框, 默认不显示
                completeToastShow: false,           // 修改成功后的提示框,默认不显示
                confirm: {
                    dialogShow: false,              // 设置ajax错误提示框是否显示，默认不显示
                    dialogMsg: ''                   // 提示框信息
                }
            }
        },
        methods: {
            goBack: function () {
                window.history.back();
            },
            verify: function (x) {
                // 验证规则
                switch (x) {
                    case 'userCode':
                        this.$refs.prompt.showPrompt('用户名不能为空！');
                        break;
                    case 'oldPassword':
                        this.$refs.prompt.showPrompt('请输入旧密码！');
                        break;
                    case 'newPassword':
                        this.$refs.prompt.showPrompt('请输入新密码！');
                        break;
                    case 'rePassword':
                        this.$refs.prompt.showPrompt('请再次输入新密码！');
                        break;
                }
            },
            blurValid: function (event) {
                var ele = event.target;
                if (!ele.value) {
                    this.verify(ele.id);
                }else{
                    if (ele.id === 'rePassword' && this.modifyInfo.rePassword !== this.modifyInfo.newPassword) {
                        this.$refs.prompt.showPromot('两次输入密码不一致！');
                    }
                }
            },
            postModifyInfo: function () {
                // 定义修改密码方法
                this.$http.post(modifyPasswordUrl, {
                    'modifyInfo': JSON.stringify(this.modifyInfo)
                }, {
                    emulateJSON: true,
                    before: function () {
                        // 正在修改的提示图标
                        this.loadingToastShow = true;
                    }
                }).then(function (response) {
                    var result = response.json();
                    if (result.success) {
                        // 提示修改成功
                        this.completeToastShow = true;
                        // 页面跳转至登录界面
                        var _this = this;
                        setTimeout(function () {
                            _this.$route.router.go({name: 'login'});
                        }, 400);
                    } else {
                        this.confirm.dialogMsg = result.error;     // 修改失败的提示信息
                        this.confirm.dialogShow = true;            // 显示弹框
                    }
                }, function (response) {
                    this.confirm.dialogMsg = '请求超时';            // 连接失败的提示信息
                    this.confirm.dialogShow = true;                // 显示弹框
                }).finally(function () {
                    // 关闭提示图标
                    this.loadingToastShow = false;
                });
            },
            modifyPassword: function () {
                // 先对表单数据进行验证
                for (var attr in this.modifyInfo) {
                    if (!this.modifyInfo[attr]) {
                        this.verify(attr);
                        return false;
                    }else{
                        if (attr === 'rePassword' && this.modifyInfo.rePassword !== this.modifyInfo.newPassword) {
                            this.$refs.prompt.showPromot('两次输入密码不一致！');
                            return false;
                        }
                    }
                }
                this.postModifyInfo();
            }
        },
        components: {
            prompt,
            loadingToast,
            completeToast,
            confirm
        },
        created: function () {
            // 加载页面时，读取之前的登录信息
            var loginInfo = window.localStorage.getItem('loginInfo');
            if (loginInfo !== null) {
                loginInfo = JSON.parse(loginInfo);
                this.userCode = loginInfo.userCode;
                this.oldPassword = loginInfo.password;
            }
        }
    }
</script>
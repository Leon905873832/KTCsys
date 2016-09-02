<template>
    <div class="container">
        <header>
            <h1>登录</h1>
        </header>
        <div class="main">
            <div class="wrapper">
                <form action="#" method="post">
                    <div class="weui_cells weui_cells_form">
                        <div class="weui_cell weui_cell_select weui_select_after">
                            <div class="weui_cell_hd">
                                <label for="company" class="weui_label"><i class="iconfont">&#xe604;</i></label>
                            </div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <select class="weui_select" name="company" id="company" v-model="loginInfo.selected">
                                    <option :value="item.companyCode" v-for="item in belongToCompany">
                                        {{item.companyName}}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd">
                                <label class="weui_label" for="userCode"><i class="iconfont">&#xe602;</i></label>
                            </div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="userCode" placeholder="请输入用户名"
                                       v-model="loginInfo.userCode" @change="getCompanyInfo($event)">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd">
                                <label class="weui_label" for="passWord"><i class="iconfont">&#xe603;</i></label>
                            </div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="password" id="passWord" placeholder="请输入密码"
                                       v-model="loginInfo.password" @change="blurValid($event)">
                            </div>
                        </div>
                        <div class="weui_cell weui_cell_switch">
                            <div class="weui_cell_hd weui_cell_primary">记住我</div>
                            <div class="weui_cell_ft">
                                <input class="weui_switch" type="checkbox" v-model="loginInfo.rememberMe">
                            </div>
                        </div>
                    </div>
                    <div class="weui_btn_area  weui_btn_area_inline">
                        <a class="weui_btn weui_btn_primary" href="javascript:void(0);" @click="login">登录</a>
                        <a class="weui_btn weui_btn_default" v-link="{path: '/modify_password.html'}">修改密码</a>
                    </div>
                </form>
            </div>
        </div>
        <!-- 表单验证提示信息 -->
        <prompt :prompt="prompt" v-ref:prompt></prompt>
        <!-- 正在加载提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在登录...</loading-toast>
        <!-- 登录成功提示信息 -->
        <complete-toast :complete-toast-show="completeToastShow">登录成功</complete-toast>
        <!-- 登录失败提示信息 -->
        <confirm :confirm="confirm">登录失败！</confirm>
    </div>
</template>

<script>
    import prompt from  '../components/prompt.vue';                 // 表单验证时的提示信息
    import loadingToast from '../components/loadingToast.vue';      // 登录时的加载框
    import completeToast from '../components/completeToast.vue';    // 登录成功的提示框
    import confirm from '../components/confirm.vue';                // ajax错误提示框
    import urlAPI from '../assets/js/urlAPI.js';
    var queryCompanyUrl = urlAPI.queryCompany;                      // 查询公司接口
    var loginUrl = urlAPI.login;                                    // 登录接口

    export default {
        data: function () {
            return {
                belongToCompany: [
                    {
                        companyCode: 0,
                        companyName: '填写用户名选择所属公司'
                    }
                ],
                loginInfo: {
                    selected: '',                   // 选择的公司
                    userCode: '',                   // 用户登录名
                    password: '',                   // 用户密码
                    rememberMe: false               // 记住密码, 默认不记住
                },
                prompt: {
                    promptShow: false,              // 设置提示信息框是否显示，默认不显示
                    promptMsg: ''                   // 提示信息内容，默认为空
                },
                loadingToastShow: false,            // 登录时的正在加载框, 默认不显示
                completeToastShow: false,           // 登录成功后的提示框,默认不显示
                confirm: {
                    dialogShow: false,              // 设置ajax错误提示框是否显示，默认不显示
                    dialogMsg: ''                   // 提示框信息
                }
            }
        },
        components: {
            prompt,
            loadingToast,
            completeToast,
            confirm
        },
        methods: {
            blurValid: function (event) {
                var ele = event.target;
                if (!ele.value) {
                    if (ele.id === 'userCode') {
                        // 显示提示信息
                        this.$refs.prompt.showPrompt('用户名不能为空！');
                    } else if (ele.id === 'passWord') {
                        // 显示提示信息
                        this.$refs.prompt.showPrompt('密码不能为空！');
                    }
                }
            },
            getCompanyInfo: function (event) {
                if (!event.target.value) {
                    this.blurValid(event);
                } else {
                    // ajax请求公司信息
                    this.$http.get(queryCompanyUrl, {
                        params: {
                            'userCode': this.loginInfo.userCode
                        }
                    }).then(function (response) {
                        var result = response.json();
                        if (result.success) {
                            this.$set('belongToCompany', result.companyList);
                            // 默认选中第一项
                            this.loginInfo.selected = this.belongToCompany[0].companyCode;
                        } else {
                            // 显示错误信息
                            this.$refs.prompt.showPrompt(result.error);
                        }
                    }, function (response) {
                        // 显示错误信息
                        this.$refs.prompt.showPrompt('请求超时!');
                    });
                }
            },
            postLoginInfo: function () {
                // 把登录信息格式化为json数据
                var loginInfoJson = JSON.stringify(this.loginInfo);

                // 定义登录方法
                this.$http.post(loginUrl, {
                    'loginInfo': loginInfoJson
                }, {
                    emulateJSON: true,
                    before: function () {
                        if (this.loginInfo.rememberMe) {
                            // 用户打开了记住密码，保存登录信息和公司信息
                            window.localStorage.setItem('loginInfo', loginInfoJson);
                            window.localStorage.setItem('belongToCompany', JSON.stringify(this.belongToCompany));
                        } else {
                            // 用户关闭了记住密码，删除登录信息
                            window.localStorage.removeItem('loginInfo');
                        }
                        // 正在登录的提示图标
                        this.loadingToastShow = true;
                    }
                }).then(function (response) {
                    var result = response.json();
                    if (result.success) {
                        // 提示登录成功
                        this.completeToastShow = true;
                        //把获取的用户信息保存在session中
                        var userInfo = result.userInfo;
                        window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                        // 页面跳转至主页
                        var _this = this;
                        setTimeout(function () {
                            _this.$route.router.go({name: 'home', query: {userCode: _this.loginInfo.userCode}});
                        }, 400);
                    } else {
                        this.confirm.dialogMsg = result.error;     // 登录失败的提示信息
                        this.confirm.dialogShow = true;            // 显示弹框
                    }
                }, function (response) {
                    this.confirm.dialogMsg = '请求超时';           // 连接失败的提示信息
                    this.confirm.dialogShow = true;                // 显示弹框
                }).finally(function () {
                    // 关闭提示图标
                    this.loadingToastShow = false;
                });
            },
            login: function () {
                // 登录前先验证用户名和密码
                if (!this.loginInfo.userCode) {
                    // 显示提示信息
                    this.$refs.prompt.showPrompt('用户名不能为空！');
                } else if (!this.loginInfo.password) {
                    // 显示提示信息
                    this.$refs.prompt.showPrompt('密码不能为空！');
                } else {
                    // 验证通过，执行登录方法
                    this.postLoginInfo();
                }
            }
        },
        created: function () {
            // 加载页面时，读取之前的登录信息
            var loginInfo = window.localStorage.getItem('loginInfo');
            var belongToCompany = window.localStorage.getItem('belongToCompany');
            if (loginInfo !== null) {
                this.$set('belongToCompany', JSON.parse(belongToCompany));
                this.$set('loginInfo', JSON.parse(loginInfo));
            }
        }
    }
</script>


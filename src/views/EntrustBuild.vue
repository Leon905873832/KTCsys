<template>
    <div class="container">
        <top-bar head-title="委托他人"></top-bar>
        <div class="main">
            <div class="wrapper">
                <form action="#" method="post">
                    <div class="weui_cells weui_cells_form">
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">用户名：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="userName" readonly
                                       v-model="entrustData.userName">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">受托人：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="trusteeName" readonly placeholder="请输入受托人姓名"
                                       v-model="entrustData.trusteeName"
                                       @click="openActionSheet($event, entrustUrl)">
                            </div>
                        </div>
                        <div class="weui_cell remark-cell">
                            <div class="weui_cell_hd"><label class="weui_label">备注：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <textarea class="weui_textarea" placeholder="请输入备注" rows="3" id="remark"
                                          v-model="entrustData.remark"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="weui_btn_area  weui_btn_area_inline">
                        <a class="weui_btn weui_btn_primary" href="javascript:void(0);"
                           @click="submitEntrust">提交</a>
                    </div>
                </form>
            </div>
        </div>
        <!--委托人上拉弹框-->
        <action-sheet :action-sheet="entrustName" v-ref:entrust-name>
            <label class="weui_cell weui_check_label" v-for="item in entrustName.actionSheetData">
                <div class="weui_cell_bd weui_cell_primary">
                    <p>{{item.userName}}</p>
                </div>
                <div class="weui_cell_ft">
                    <input type="radio" class="weui_check" name="radio" @click="chooseActionItem($index)">
                    <span class="weui_icon_checked"></span>
                </div>
            </label>
        </action-sheet>
        <!-- 表单验证提示信息 -->
        <prompt :prompt="prompt" v-ref:prompt></prompt>
        <!-- 正在提交提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在提交...</loading-toast>
        <!-- 成功提示信息 -->
        <complete-toast :complete-toast-show="completeToastShow">提交成功!</complete-toast>
        <!-- 提交失败提示信息 -->
        <confirm :confirm="confirm">提交失败！</confirm>
    </div>
</template>
<script>
    import topBar from  '../components/header.vue';                 // 顶部导航条
    import prompt from  '../components/prompt.vue';                 // 表单验证时的提示信息
    import loadingToast from '../components/loadingToast.vue';      // 正在提交提示框
    import confirm from '../components/confirm.vue';                // ajax错误提示框
    import completeToast from '../components/completeToast.vue';    // 提交成功的提示框
    import actionSheet from '../components/actionSheet.vue';        // 上拉弹框
    import urlAPI from '../assets/js/urlAPI.js';
    var entrustBuildUrl = urlAPI.entrustBuild;                      // 报销单提交接口
    var entrustUrl = urlAPI.approval;                               // 委托人名单地址
    export default {
        data: function () {
            return {
                title: '新建报销单',             // 标题
                loadingToastShow: false,        // 正在加载框, 默认不显示
                confirm: {
                    dialogShow: false,          // 设置ajax错误提示框是否显示，默认不显示
                    dialogMsg: ''               // 提示框信息
                },
                prompt: {
                    promptShow: false,          // 设置提示信息框是否显示，默认不显示
                    promptMsg: ''               // 提示信息内容，默认为空
                },
                completeToastShow: false,       // 提交成功后的提示框,默认不显示
                entrustName: {
                    actionSheetShow: false,     // 上拉弹框是否显示，默认不显示
                    actionTitle: '',
                    actionSheetData: [],        // 弹框里的数据
                    choosedData: {}             // 选择的数据
                },
                entrustUrl: entrustUrl,         // 弹出框里面的条目地址
                entrustData: {                              // 委托单信息
                    userCode: '',                           // 用户code
                    userName: '',                           // 用户名
                    trusteeName: '',                        // 受托人姓名
                    trusteeCode: '',                        // 受托人code
                    remark: '',                             // 说明
                }
            }
        },
        components: {
            topBar,
            confirm,
            loadingToast,
            completeToast,
            prompt,
            actionSheet
        },
        methods: {
            openActionSheet: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'trusteeName':     // 项目状态
                        this.$refs.entrustName.getActionSheetItems(url, categoryCode);
                        this.entrustName.actionTitle = '委托人';
                        this.entrustName.actionSheetShow = true;
                        break;
                }
            },

            chooseActionItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'trusteeName':     // 项目状态
                        this.$refs.entrustName.chooseActionItem(index);
                        this.entrustData.trusteeCode = this.entrustName.choosedData.userCode;
                        this.entrustData.trusteeName = this.entrustName.choosedData.userName;
                        break;
                }
            },

            // 提交表单
            submitEntrust: function () {
                if (!this.entrustData.trusteeName) {
                    // 显示提示信息
                    this.$refs.prompt.showPrompt('委托人不能为空！');
                } else {
                    // 验证通过，执行提交方法
                    this.$http.post(entrustBuildUrl, {
                        'entrustData': JSON.stringify(this.entrustData)
                    }, {
                        emulateJSON: true,
                        before: function () {
                            // 正在提交的提示图标
                            this.loadingToastShow = true;
                        }
                    }).then(function (response) {
                        var result = response.json();
                        if (result.success) {
                            // 提示修改成功
                            this.completeToastShow = true;
                            // 获取的会话存储中的用户信息
                            var userInfo = window.sessionStorage.getItem('userInfo');
                            if (userInfo !== null) {
                                var userCode = JSON.parse(userInfo).userCode;
                            }
                            var _this = this;
                            setTimeout(function () {
                                _this.$route.router.go({name: 'reimburseList', query: {userCode: userCode}});
                            }, 1600);
                        } else {
                            this.confirm.dialogMsg = result.error;     // 提交失败的提示信息
                            this.confirm.dialogShow = true;            // 显示弹框
                        }
                    }, function (response) {
                        this.confirm.dialogMsg = '请求超时';           // 连接失败的提示信息
                        this.confirm.dialogShow = true;                // 显示弹框
                    }).finally(function () {
                        // 关闭提示图标
                        this.loadingToastShow = false;
                    });
                }
            }
        },
        created: function () {
            // 读取会话里的用户信息
            var userInfo = window.sessionStorage.getItem('userInfo');
            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                this.entrustData.userName = userInfo.userName;
                this.entrustData.userCode = userInfo.userCode;
            }
        }
    }
</script>
<template>
    <div class="container">
        <top-bar head-title="委托列表"></top-bar>
        <div class="main">
            <nav-bar :nav-bar-data="navBarData" @query="getEntrustList">
                <div class="nav-bar-content">
                    <p v-if="!entrustList.length" class="noData">暂无数据</p>
                    <div class="weui_panel" v-for="item in entrustList" @click="showOperateBox($index)">
                        <div class="weui_panel_bd">
                            <div class="weui_media_box weui_media_text">
                                <p class="weui_media_desc">委托人：{{item.entrustName}}</p>
                            </div>
                            <div class="weui_media_box weui_media_text">
                                <p class="weui_media_desc">受托人：{{item.trusteeName}}</p>
                            </div>
                            <div class="weui_media_box weui_media_text">
                                <p class="weui_media_desc">备注：{{item.remark}}</p>
                            </div>
                            <div class="weui_media_box weui_media_text">
                                <p class="weui_media_desc">状态：{{entrustStatus[item.status]}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav-bar>
        </div>
        <!--操作列表-->
        <div v-show="operateBoxShow">
            <div class="weui_mask" @click="operateBoxHide"></div>
            <div class="weui_dialog">
                <div class="weui_dialog_hd"></div>
                <div class="weui_dialog_bd">请选择操作，同意还是拒绝？</div>
                <div class="weui_dialog_ft">
                    <a href="javascript:void(0);" class="weui_btn_dialog default" @click="refuse">拒绝</a>
                    <a href="javascript:void(0);" class="weui_btn_dialog primary" @click="accept">同意</a>
                </div>
            </div>
        </div>
        <!-- 正在加载提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在加载...</loading-toast>
        <!-- 成功提示信息 -->
        <complete-toast :complete-toast-show="completeToastShow">提交成功!</complete-toast>
        <!-- 加载失败提示信息 -->
        <confirm :confirm="confirm">加载失败！</confirm>
    </div>
</template>
<script>
    import topBar from  '../components/header.vue';             // 顶部导航条
    import loadingToast from '../components/loadingToast.vue';  // 正在加载提示框
    import confirm from '../components/confirm.vue';            // ajax错误提示框
    import completeToast from '../components/completeToast.vue';// 成功的提示框
    import navBar from '../components/navBar.vue';              // 分页导航
    import urlAPI from '../assets/js/urlAPI.js';
    var entrustListUrl = urlAPI.entrustList;                   // 查询委托单列表接口
    var entrustReasonUrl = urlAPI.entrustReason;               // 处理委托信息接口
    export default{
        data: function () {
            return {
                entrustList: [],                    // 委托列表数据
                entrustItem: {},                    // 被点击的报销单条目
                entrustStatus: {
                    'refuse': '已拒绝',
                    'accept': '已接受',
                    'unhandled': '未处理'
                },
                navBarData: {                       // 分页导航数据
                    navBarItems: [
                        {navItem: '未处理'},
                        {navItem: '已处理'},
                        {navItem: '我的委托'}
                    ],
                    isCurrent: 0                    // 分页导航的当前项,默认为第0项
                },
                completeToastShow: false,           // 提交成功后的提示框,默认不显示
                operateBoxShow: false,              // 操作对话框是否显示，默认不显示
                loadingToastShow: false,            // 正在加载框, 默认不显示
                confirm: {
                    dialogShow: false,              // 设置ajax错误提示框是否显示，默认不显示
                    dialogMsg: ''                   // 提示框信息
                }
            }
        },
        methods: {
            getEntrustList: function () {
                // ajax请求委托列表
                this.$http.get(entrustListUrl, {
                    params: {
                        'entrustStatus': this.navBarData.isCurrent,     // 报销单类型
                        'userCode': this.$route.query.userCode,         // 用户code
                    },
                    before: function () {
                        // 正在加载的提示图标
                        this.loadingToastShow = true;
                        // 清空entrustList里面已保存的数据
                        this.entrustList = [];
                    }
                }).then(function (response) {
                    var result = response.json();
                    if (result.success) {
                        this.$set('entrustList', result.entrustList);
                    }
                }, function (response) {
                    // 显示错误信息
                    this.confirm.dialogMsg = '请求超时!';       // 获取数据失败的提示信息
                    this.confirm.dialogShow = true;            // 显示弹框
                }).finally(function () {
                    // 关闭提示图标
                    this.loadingToastShow = false;
                });
            },
            // 弹出操作对话框
            showOperateBox: function (index) {
                if (this.navBarData.isCurrent === 0) {
                    this.entrustItem = this.entrustList[index];
                    this.operateBoxShow = true;
                }
            },
            // 关闭操作对话框
            operateBoxHide: function () {
                this.operateBoxShow = false;
            },
            accept: function () {
                this.operateBoxShow = false;
                this.$set('entrustItem.decision', 'accept');    // 操作，accept接受，refuse拒绝
                window.sessionStorage.setItem('entrustData', JSON.stringify(this.entrustItem));
                this.$route.router.go({name: 'reimburseBuild'});
            },
            refuse: function () {
                this.$set('entrustItem.decision', 'refuse');
                this.$http.post(entrustReasonUrl, {
                    'entrustData': JSON.stringify(this.entrustItem)
                }, {
                    emulateJSON: true,
                    before: function () {
                        // 关闭操作对话框
                        this.operateBoxShow = false;
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
                            _this.completeToastShow = false;
                            _this.getEntrustList();
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
            },
        },
        components: {
            topBar,
            confirm,
            navBar,
            loadingToast,
            completeToast
        },
        created: function () {
            this.getEntrustList();
        }
    }
</script>
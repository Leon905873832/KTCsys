<template>
    <div class="container">
        <top-bar head-title="报销单列表"></top-bar>
        <div class="main">
            <nav-bar :nav-bar-data="navBarData" @query="getReimburseList">
                <div class="nav-bar-content">
                    <search-bar :search-bar-data="searchBarData" @search="fuzzySearch"></search-bar>
                    <p v-if="!reimburseList.length" class="noData">暂无数据</p>
                    <div class="weui_panel" v-for="item in reimburseList" @click="viewReimburseDetail($index)">
                        <div class="weui_panel_hd">{{item.reimburseTitle}}</div>
                        <div class="weui_panel_bd">
                            <div class="weui_media_box weui_media_text">
                                <p class="weui_media_desc">提交日期：{{item.reimburseDate}}</p>
                                <p class="weui_media_desc">报销金额：<span class="money">{{item.reimburseMoney | currency '&yen;'}}</span></p>
                                <p class="weui_media_desc">所属项目：{{item.reimburseProject}}</p>
                                <p class="weui_media_desc">当前审批人：{{item.approvalManager}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav-bar>
        </div>
        <div class="weui_tabbar">
            <a href="javascript:void(0);" class="weui_tabbar_item" v-link="{path: '/reimburseBuild.html'}">
                <div class="weui_tabbar_icon">
                    <i class="iconfont">&#xe608;</i>
                </div>
                <p class="weui_tabbar_label">新建报销</p>
            </a>
            <a href="javascript:void(0);" class="weui_tabbar_item" v-link="{path: '/entrustBuild.html'}">
                <div class="weui_tabbar_icon">
                    <i class="iconfont">&#xe611;</i>
                </div>
                <p class="weui_tabbar_label">委托他人</p>
            </a>
        </div>
        <!-- 正在加载提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在加载...</loading-toast>
        <!-- 加载失败提示信息 -->
        <confirm :confirm="confirm">加载失败！</confirm>
    </div>
</template>
<script>
    import topBar from  '../components/header.vue';             // 顶部导航条
    import searchBar from  '../components/searchBar.vue';       // 搜索框
    import loadingToast from '../components/loadingToast.vue';  // 正在加载提示框
    import confirm from '../components/confirm.vue';            // ajax错误提示框
    import navBar from '../components/navBar.vue';              // 分页导航
    import urlAPI from '../assets/js/urlAPI.js';
    var reimburseListUrl = urlAPI.reimburseList;                // 查询报销单列表接口
    export default{
        data: function () {
            return {
                reimburseList: [],              // 报销列表数据
                navBarData: {                   // 分页导航数据
                    navBarItems: [
                        {navItem: '审批中'},
                        {navItem: '待处理'},
                        {navItem: '已取消'},
                        {navItem: '已完成'},
                    ],
                    isCurrent: 0                // 分页导航的当前项,默认为第0项
                },
                searchBarData: {
                    placeholder: '请输入单号',  // 搜索框的默认提示信息
                    keyWord: ''                 // 用户输入的搜索字段
                },
                loadingToastShow: false,        // 正在加载框, 默认不显示
                confirm: {
                    dialogShow: false,          // 设置ajax错误提示框是否显示，默认不显示
                    dialogMsg: ''               // 提示框信息
                }
            }
        },
        methods: {
            getReimburseList: function (keyWord) {
                // ajax请求报销列表
                this.$http.get(reimburseListUrl, {
                    params: {
                        'reimburseStatus': this.navBarData.isCurrent,   // 报销单类型
                        'userCode': this.$route.query.userCode,         // 用户code
                        'keyWord': keyWord                              // 模糊查询
                    },
                    before: function () {
                        // 正在加载的提示图标
                        this.loadingToastShow = true;
                        // 清空reimburseList里已存在的数据
                        this.reimburseList = [];
                    }
                }).then(function (response) {
                    var result = response.json();
                    if (result.success) {
                        this.$set('reimburseList', result.reimburseList);
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
            fuzzySearch: function (keyWord) {
                this.getReimburseList(keyWord);
            },
            viewReimburseDetail: function (index) {
                // 跳转到报销单详情页面
                window.sessionStorage.setItem('isCurrent', JSON.stringify(this.navBarData.isCurrent));
                this.$route.router.go({name: 'reimburseDetail', query: {reimburseId: this.reimburseList[index].reimburseId}});
            }
        },
        components: {
            topBar,
            confirm,
            navBar,
            searchBar,
            loadingToast
        },
        created: function () {
            this.getReimburseList();
        }
    }
</script>
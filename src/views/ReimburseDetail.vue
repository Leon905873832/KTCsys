<template>
    <div class="container">
        <top-bar head-title="报销单详情"></top-bar>
        <div class="main">
            <div class="wrapper">
                <div class="weui_cells_title" v-if="approveInfo.length">审批信息</div>
                <div class="weui_cells" v-if="approveInfo.length">
                    <div class="weui_cell" v-for="item in approveInfo">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>{{item.approveManager}}</p>
                        </div>
                        <div class="weui_cell_ft">{{item.approveMsg}}</div>
                    </div>
                </div>
                <div class="weui_cells_title">报销单信息</div>
                <div class="weui_cells">
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>用户</p>
                        </div>
                        <div class="weui_cell_ft">{{reimburseData.userName}}</div>
                    </div>
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>总金额</p>
                        </div>
                        <div class="weui_cell_ft">{{reimburseData.totalMoney | currency '&yen;'}}</div>
                    </div>
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>所属项目</p>
                        </div>
                        <div class="weui_cell_ft">{{reimburseData.belongToProjectName}}</div>
                    </div>
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>审批人</p>
                        </div>
                        <div class="weui_cell_ft">{{reimburseData.approveManagerName}}</div>
                    </div>
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>备注</p>
                        </div>
                        <div class="weui_cell_ft">{{reimburseData.remark}}</div>
                    </div>
                </div>
                <div class="weui_cells_title">发票信息</div>
                <div class="weui_cells" v-for="item in reimburseData.invoiceDetail" @click="recordIndex($index)">
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>发票类型</p>
                        </div>
                        <div class="weui_cell_ft">{{item.invoiceTypeName}}</div>
                    </div>
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>发票金额</p>
                        </div>
                        <div class="weui_cell_ft">{{item.money | currency '&yen;'}}</div>
                    </div>
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>发票日期</p>
                        </div>
                        <div class="weui_cell_ft">{{item.date}}</div>
                    </div>
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>发票图片</p>
                        </div>
                        <div class="weui_cell_ft invoice-imgBox">
                            <img v-for="img in item.imgSrc" :src="img.src" alt="发票" @click="setSrc($event, $index)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="weui_tabbar" v-if="tabBarShow">
            <a href="javascript:void(0);" class="weui_tabbar_item" @click="editReimburse">
                <div class="weui_tabbar_icon">
                    <i class="iconfont">&#xe608;</i>
                </div>
                <p class="weui_tabbar_label">编辑</p>
            </a>
            <a href="javascript:void(0);" class="weui_tabbar_item" @click="deleteReimburse">
                <div class="weui_tabbar_icon">
                    <i class="iconfont">&#xe60c;</i>
                </div>
                <p class="weui_tabbar_label">撤回</p>
            </a>
        </div>
        <!-- 查看图片弹框 -->
        <div class="img-bg" v-show="invoiceBigImg">
            <div class="img-bar">
                <img :src="invoiceBigSrc" alt="发票图片">
                <i class="weui_icon_cancel" @click="HideBigImg"></i>
            </div>
        </div>
        <!-- 正在加载提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在加载...</loading-toast>
        <!-- 加载失败提示信息 -->
        <confirm :confirm="confirm">{{confirmTitle}}</confirm>
        <!-- 弹出对话框 -->
        <dialog :dialog-show.sync="dialogShow" @confirm="confirmDeleteReimburse">
            <span slot="dialog-head">确认删除？</span>
            <span slot="dialog-hd">数据不可恢复，您确定撤回吗？</span>
        </dialog>
        <!-- 删除成功提示信息 -->
        <complete-toast :complete-toast-show="completeToastShow">撤回成功！</complete-toast>
    </div>
</template>
<script>
    import topBar from  '../components/header.vue';                 // 顶部导航条
    import loadingToast from '../components/loadingToast.vue';      // 正在加载提示框
    import confirm from '../components/confirm.vue';                // ajax错误提示框
    import dialog from '../components/dialog.vue';                  // 对话框
    import completeToast from '../components/completeToast.vue';    // 删除成功的提示框
    import urlAPI from '../assets/js/urlAPI.js';
    var reimburseDetailUrl = urlAPI.reimburseDetail;                // 查询报销单详情接口
    var deleteReimburseUrl = urlAPI.deleteReimburse;                // 删除报销单接口
    export default {
        data: function () {
            return {
                approveInfo: [],                // 审批信息
                reimburseData: {},              // 报销单信息
                loadingToastShow: false,        // 正在加载框, 默认不显示
                completeToastShow: false,       // 删除成功后的提示框,默认不显示
                dialogShow: false,              // 对话框是否显示，默认不显示
                tabBarShow: false,              // 底部tab是否显示，默认不显示
                confirm: {
                    dialogShow: false,          // 设置ajax错误提示框是否显示，默认不显示
                    dialogMsg: ''               // 提示框信息
                },
                invoiceImgIndex: {               // 记录查看大图时，当前图片的位置
                    parentIndex: '',
                    selfIndex: ''
                },
                invoiceBigImg: false,            // 查看大图弹框是否显示，默认不显示
                invoiceBigSrc: '',               // 大图的src
                confirmTitle: '加载失败！'       // confirm提示框的标题
            }
        },
        components: {
            topBar,
            confirm,
            loadingToast,
            completeToast,
            dialog
        },
        methods: {
            // 记录被点击的发票条目的位置
            recordIndex: function (index) {
                this.invoiceImgIndex.parentIndex = index;
            },
            // 设置查看大图src
            setSrc: function (event, index) {
                this.invoiceImgIndex.selfIndex = index;    // 记录图片位置
                var src = event.target.src;
                this.invoiceBigSrc = src;
                this.invoiceBigImg = true;
            },
            // 关闭图片预览
            HideBigImg: function () {
                this.invoiceBigImg = false;
            },
            deleteReimburse: function(){
                // 弹出对话框
                this.dialogShow = true;
            },
            confirmDeleteReimburse: function () {
                // 获取地址栏的参数ctrctId
                var reimburseId = this.$route.query.reimburseId;

                // 删除报销单
                this.$http.post(deleteReimburseUrl, {
                    'reimburseId': reimburseId
                }, {
                    emulateJSON: true,
                    before: function () {
                        // 正在提交的提示图标
                        this.loadingToastShow = true;
                    }
                }).then(function (response) {
                    var result = response.data;
                    if (result.success) {
                        // 提示删除成功
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
                        // 显示错误信息
                        this.confirmTitle = '删除失败！'
                        this.confirm.dialogMsg = result.error;     // 删除失败的提示信息
                        this.confirm.dialogShow = true;            // 显示弹框
                    }
                }, function (response) {
                    // 显示错误信息
                    this.confirmTitle = '删除失败！'
                    this.confirm.dialogMsg = '请求超时!';       // 失败的提示信息
                    this.confirm.dialogShow = true;             // 显示弹框
                }).finally(function () {
                    // 关闭提示图标
                    this.loadingToastShow = false;
                });
            },
            editReimburse: function () {
                // 把当前报销单信息存入会话
                window.sessionStorage.setItem('reimburseData', JSON.stringify(this.reimburseData));
                // 跳转到编辑报销单页面
                this.$route.router.go({name: 'reimburseBuild', query: {reimburseId: this.$route.query.reimburseId}});
            }
        },
        created: function () {
            // 读取session里isCurrent信息
            var isCurrent = window.sessionStorage.getItem('isCurrent');
            if (isCurrent === '1') {
                this.tabBarShow = true;
            }
            // ajax请求报销详情
            this.$http.get(reimburseDetailUrl, {
                params: {
                    'reimburseId': this.$route.query.reimburseId,         // 报销单id
                },
                before: function () {
                    // 正在加载的提示图标
                    this.loadingToastShow = true;
                }
            }).then(function (response) {
                var result = response.json();
                if (result.success) {
                    this.$set('approveInfo', result.approveInfo);
                    this.$set('reimburseData', result.reimburseData);
                } else {
                    // 显示错误信息
                    this.confirmTitle = '加载失败！'
                    this.confirm.dialogMsg = result.error;     // 获取数据失败的提示信息
                    this.confirm.dialogShow = true;            // 显示弹框
                }
            }, function (response) {
                // 显示错误信息
                this.confirmTitle = '加载失败！'
                this.confirm.dialogMsg = '请求超时!';       // 获取数据失败的提示信息
                this.confirm.dialogShow = true;            // 显示弹框
            }).finally(function () {
                // 关闭提示图标
                this.loadingToastShow = false;
            });
        }
    }
</script>
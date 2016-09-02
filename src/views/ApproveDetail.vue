<template>
    <div class="container">
        <top-bar head-title="审批详情"></top-bar>
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
            <a href="javascript:void(0);" class="weui_tabbar_item" @click="openApproveBox($event)">
                <div class="weui_tabbar_icon">
                    <i class="iconfont">&#xe613;</i>
                </div>
                <p class="weui_tabbar_label">同意</p>
            </a>
            <a href="javascript:void(0);" class="weui_tabbar_item" @click="openApproveBox($event)">
                <div class="weui_tabbar_icon">
                    <i class="iconfont">&#xe614;</i>
                </div>
                <p class="weui_tabbar_label">退回</p>
            </a>
        </div>
        <!-- 查看图片弹框 -->
        <div class="img-bg" v-show="invoiceBigImg">
            <div class="img-bar">
                <img :src="invoiceBigSrc" alt="发票图片">
                <i class="weui_icon_cancel" @click="HideBigImg"></i>
            </div>
        </div>
        <!--审批意见弹框-->
        <div v-show="approveBox.approveBoxShow" transition="fade">
            <div class="weui_mask" @click="closeApproveBox"></div>
            <div class="action-list" v-show="approveBox.approveBoxShow" transition="slideDown">
                <div class="action-list-hd">
                    <div class="weui_cell">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>审批意见</p>
                        </div>
                        <div class="weui_cell_ft">
                            <a href="javascript:void(0);" class="weui_btn weui_btn_mini weui_btn_primary"
                               @click="closeApproveBox">关闭</a>
                        </div>
                    </div>
                </div>
                <div class="action-list-bd">
                    <form action="#" method="post">
                        <div class="weui_cells weui_cells_form">
                            <div class="weui_cell remark-cell">
                                <div class="weui_cell_hd"><label class="weui_label">审批意见：</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <textarea class="weui_textarea" placeholder="请输入审批意见" rows="3"
                                              v-model="approveBox.approveMsg"></textarea>
                                </div>
                            </div>
                            <div class="weui_cell" v-show="approveBox.decision">
                                <div class="weui_cell_hd"><label class="weui_label">下一审批人：</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <input class="weui_input" type="text" id="approveManagerName" readonly
                                           v-model="approveBox.approveManagerName"
                                           @click="openActionSheet($event, approvalUrl)">
                                </div>
                            </div>
                        </div>
                        <div class="weui_btn_area">
                            <a class="weui_btn weui_btn_primary" href="javascript:void(0);" @click="postApproveMsg">提交</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!--审批人上拉弹框-->
        <action-sheet :action-sheet="approveManagerName" v-ref:approve-manager-name>
            <label class="weui_cell weui_check_label" v-for="item in approveManagerName.actionSheetData">
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
        <!-- 正在加载提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在加载...</loading-toast>
        <!-- 加载失败提示信息 -->
        <confirm :confirm="confirm">{{confirmTitle}}</confirm>
        <!-- 提交成功提示信息 -->
        <complete-toast :complete-toast-show="completeToastShow">提交成功</complete-toast>
    </div>
</template>
<script>
    import topBar from  '../components/header.vue';                 // 顶部导航条
    import prompt from  '../components/prompt.vue';                 // 表单验证时的提示信息
    import loadingToast from '../components/loadingToast.vue';      // 正在加载提示框
    import confirm from '../components/confirm.vue';                // ajax错误提示框
    import completeToast from '../components/completeToast.vue';    // 提交成功的提示框
    import actionSheet from '../components/actionSheet.vue';        // 上拉弹框
    import urlAPI from '../assets/js/urlAPI.js';
    var approveDetailUrl = urlAPI.approveDetail;                   // 查询报销单详情接口
    var approveReasonUrl = urlAPI.approveReason;                   // 提交审批信息接口
    var approvalUrl = urlAPI.approval;                             // 审批人名单地址
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
                prompt: {
                    promptShow: false,          // 设置提示信息框是否显示，默认不显示
                    promptMsg: ''               // 提示信息内容，默认为空
                },
                invoiceImgIndex: {               // 记录查看大图时，当前图片的位置
                    parentIndex: '',
                    selfIndex: ''
                },
                invoiceBigImg: false,            // 查看大图弹框是否显示，默认不显示
                invoiceBigSrc: '',               // 大图的src
                approveBox: {
                    approveBoxShow: false,          // 审批弹框是否显示
                    approveMsg: '',                 // 审批意见
                    approveManagerCode: '',         // 审批人Code
                    approveManagerName: '',         // 审批人姓名
                    decision: true                  // 审批结果，true为通过，false为拒绝
                },
                approveManagerName: {
                    actionSheetShow: false,     // 上拉弹框是否显示，默认不显示
                    actionTitle: '',
                    actionSheetData: [],        // 弹框里的数据
                    choosedData: {}             // 选择的数据
                },
                approvalUrl: approvalUrl,      // 审批人地址
                confirmTitle: '加载失败！'       // confirm提示框的标题
            }
        },
        components: {
            topBar,
            confirm,
            loadingToast,
            prompt,
            completeToast,
            actionSheet
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
            // 打开审批意见弹框
            openApproveBox: function (event) {
                var txt = event.currentTarget.children[1].innerHTML;
                if (txt === '同意') {
                    this.approveBox.decision = true;
                } else if (txt === '退回') {
                    this.approveBox.decision = false;
                }
                this.approveBox.approveBoxShow = true;
            },
            // 关闭审批意见弹框
            closeApproveBox: function () {
                this.approveBox.approveBoxShow = false;
            },
            openActionSheet: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'approveManagerName':     // 项目状态
                        this.$refs.approveManagerName.getActionSheetItems(url, categoryCode);
                        this.approveManagerName.actionTitle = '审批人';
                        this.approveManagerName.actionSheetShow = true;
                        break;
                }
            },

            chooseActionItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'approveManagerName':     // 审批人
                        this.$refs.approveManagerName.chooseActionItem(index);
                        this.approveBox.approveManagerCode = this.approveManagerName.choosedData.userCode;
                        this.approveBox.approveManagerName = this.approveManagerName.choosedData.userName;
                        break;
                }
            },
            // 提交审批意见
            postApproveMsg: function () {
                var userCode = JSON.parse(window.sessionStorage.getItem('userInfo')).userCode;
                if (this.approveBox.approveMsg === '') {
                    this.$refs.prompt.showPrompt('审批意见不能为空！');
                } else {
                    // 关闭弹框
                    this.approveBox.approveBoxShow = false;
                    this.$http.post(approveReasonUrl, {
                        'userCode': userCode,
                        'reimburseId': this.$route.query.reimburseId,
                        'approveInfo': JSON.stringify(this.approveBox)
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
                                _this.$route.router.go({name: 'approveList', query: {userCode: userCode}});
                            }, 1600);
                        } else {
                            this.confirm.dialogMsg = result.error;     // 提交失败的提示信息
                            this.confirm.dialogShow = true;            // 显示弹框
                        }
                    }, function (response) {
                        this.confirm.dialogMsg = '请求超时';            // 连接失败的提示信息
                        this.confirm.dialogShow = true;                // 显示弹框
                    }).finally(function () {
                        // 关闭提示图标
                        this.loadingToastShow = false;
                    });
                }
            }
        },
        created: function () {
            // 读取session里isCurrent信息
            var isCurrent = window.sessionStorage.getItem('isCurrent');
            if (isCurrent === '0') {
                this.tabBarShow = true;
            }
            // ajax请求报销详情
            this.$http.get(approveDetailUrl, {
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
                    this.confirmTitle = '加载失败！';
                    this.confirm.dialogMsg = result.error;     // 获取数据失败的提示信息
                    this.confirm.dialogShow = true;            // 显示弹框
                }
            }, function (response) {
                // 显示错误信息
                this.confirmTitle = '加载失败！';
                this.confirm.dialogMsg = '请求超时!';       // 获取数据失败的提示信息
                this.confirm.dialogShow = true;            // 显示弹框
            }).finally(function () {
                // 关闭提示图标
                this.loadingToastShow = false;
            });
        }
    }
</script>
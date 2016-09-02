<style scoped>
    .weui_btn_mini {
        position: relative;
        overflow: hidden;
    }

    .invoice-imgBox {
        font-size: 0
    }

    .invoice-imgBox img {
        display: inline-block;
        width: 32px;
        height: 32px;
        margin-right: 5px;
    }

    #add-btn-file {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        font-size: 32px;
        opacity: 0;
    }
</style>
<template>
    <div class="container">
        <top-bar :head-title="title"></top-bar>
        <div class="main">
            <div class="wrapper">
                <form action="#" method="post">
                    <div class="weui_cells_title">报销单信息</div>
                    <div class="weui_cells weui_cells_form">
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">用户名：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="userName" readonly
                                       v-model="reimburseData.userName">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">总金额：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="totalMoney" placeholder="填写发票后自动计算" readonly
                                       v-model="reimburseData.totalMoney">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">所属项目：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="belongToProjectName" readonly
                                       v-model="reimburseData.belongToProjectName"
                                       @click="openActionSheet($event, belongToUrl)">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">审批人：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="approveManagerName" readonly
                                       v-model="reimburseData.approveManagerName"
                                       @click="openActionSheet($event, approvalUrl)">
                            </div>
                        </div>
                        <div class="weui_cell remark-cell">
                            <div class="weui_cell_hd"><label class="weui_label">备注：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <textarea class="weui_textarea" placeholder="请输入备注" rows="3" id="remark"
                                          v-model="reimburseData.remark"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="weui_cells_title">发票信息</div>
                    <div class="weui_cells weui_cells_form" v-for="item in reimburseData.invoiceDetail"
                         transition="fade" @click="recordIndex($index)">
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">发票类型：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" id="invoiceType" readonly
                                       v-model="item.invoiceTypeName"
                                       @click="openActionSheet($event, optionItemsUrl, 'EXP_TYPE')">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">发票金额：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="number" v-model="item.money" @change="sum">
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">发票日期：</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <date-picker :time.sync="item.date" :option="option"></date-picker>
                            </div>
                        </div>
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label class="weui_label">发票图片：</label></div>
                            <div class="weui_cell_bd weui_cell_primary invoice-imgBox">
                                <img v-for="img in item.imgSrc" :src="img.src" alt="发票" @click="setSrc($event, $index)">
                            </div>
                            <a href="javascript:void(0);" class="weui_btn weui_btn_mini weui_btn_primary">
                                <input type="file" id="add-btn-file" @change="uploadImg($event.target.files, $index)"
                                       accept="image/*" capture/>添加
                            </a>
                        </div>
                    </div>
                    <div class="weui_btn_area  weui_btn_area_inline">
                        <a class="weui_btn weui_btn_primary" href="javascript:void(0);"
                           @click="submitReimburse('submit')">提交</a>
                        <a class="weui_btn weui_btn_primary" href="javascript:void(0);"
                           @click="submitReimburse('save')">保存</a>
                    </div>
                </form>
            </div>
        </div>
        <footer>
            <a href="javascript:void(0);" class="button" @click="addInvoiceItem">添加发票</a>
        </footer>
        <!--所属项目上拉弹框-->
        <action-sheet :action-sheet="belongToProject" v-ref:belong-to-project>
            <label class="weui_cell weui_check_label" v-for="item in belongToProject.actionSheetData">
                <div class="weui_cell_bd weui_cell_primary">
                    <p>{{item.projectName}}</p>
                </div>
                <div class="weui_cell_ft">
                    <input type="radio" class="weui_check" name="radio" @click="chooseActionItem($index)">
                    <span class="weui_icon_checked"></span>
                </div>
            </label>
        </action-sheet>
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
        <!--字典查询上拉弹框-->
        <action-sheet :action-sheet="category" v-ref:category>
            <label class="weui_cell weui_check_label" v-for="item in category.actionSheetData">
                <div class="weui_cell_bd weui_cell_primary">
                    <p>{{item.categoryItemName}}</p>
                </div>
                <div class="weui_cell_ft">
                    <input type="radio" class="weui_check" name="radio" @click="chooseActionItem($index)">
                    <span class="weui_icon_checked"></span>
                </div>
            </label>
        </action-sheet>
        <!-- 查看图片弹框 -->
        <div class="img-bg" v-show="invoiceBigImg">
            <div class="img-bar">
                <img :src="invoiceBigSrc" alt="发票图片">
                <i class="weui_icon_cancel" @click="HideBigImg"></i>
            </div>
            <a class="weui_btn weui_btn_warn" href="javascript:void(0);" @click="removeImg">删除</a>
        </div>
        <!-- 表单验证提示信息 -->
        <prompt :prompt="prompt" v-ref:prompt></prompt>
        <!-- 正在提交提示信息 -->
        <loading-toast :loading-toast-show="loadingToastShow">正在提交...</loading-toast>
        <!-- 成功提示信息 -->
        <complete-toast :complete-toast-show="completeToastShow">提交成功</complete-toast>
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
    import datePicker from 'vue-datepicker'                         // 时间选择
    import urlAPI from '../assets/js/urlAPI.js';
    var reimburseBuildUrl = urlAPI.reimburseBuild;                // 报销单提交接口
    var belongToUrl = urlAPI.belongTo;                             // 所属项目地址
    var approvalUrl = urlAPI.approval;                             // 审批人名单地址
    var optionItemsUrl = urlAPI.optionItems;                       // 发票类型名单地址
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
                invoiceImgIndex: {              // 记录查看大图时，当前图片的位置
                    parentIndex: '',
                    selfIndex: ''
                },
                belongToProject: {
                    actionSheetShow: false,     // 上拉弹框是否显示，默认不显示
                    actionTitle: '',
                    actionSheetData: [],        // 弹框里的数据
                    choosedData: {}             // 选择的数据
                },
                approveManagerName: {
                    actionSheetShow: false,     // 上拉弹框是否显示，默认不显示
                    actionTitle: '',
                    actionSheetData: [],        // 弹框里的数据
                    choosedData: {}             // 选择的数据
                },
                category: {
                    actionSheetShow: false,     // 上拉弹框是否显示，默认不显示
                    actionTitle: '',
                    actionSheetData: [],        // 弹框里的数据
                    choosedData: {}             // 选择的数据
                },
                belongToUrl: belongToUrl,                  // 所属项目弹框
                approvalUrl: approvalUrl,                  // 审批人地址
                optionItemsUrl: optionItemsUrl,            // 弹出框里面的条目地址
                invoiceBigImg: false,                       // 发票大图，默认隐藏
                invoiceBigSrc: '',                          // 发票大图地址
                reimburseData: {                            // 报销单信息
                    reimburseId: '',                        // 报销单id，新建为''
                    userCode: '',                           // 用户code
                    userName: '',                           // 用户名
                    totalMoney: '',                         // 总金额
                    belongToProjectCode: '',                // 所属项目code
                    belongToProjectName: '',                // 所属项目name
                    approveManagerName: '',                 // 审批人姓名
                    approveManagerCode: '',                 // 审批人code
                    remark: '',                             // 说明
                    invoiceDetail: [],                      // 发票信息，默认为空
                    entrustData: {}                         // 委托信息, 存储接收到的委托信息表
                },

                // 时间选择相关
                option: {
                    type: 'day',
                    week: ['一', '二', '三', '四', '五', '六', '日'],
                    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    format: 'YYYY-MM-DD',
                    inputStyle: {
                        'width': '100%',
                        'border': '0',
                        'outline': '0',
                        '-webkit-appearance': 'none',
                        'background-color': 'transparent',
                        'font-size': 'inherit',
                        'color': 'inherit',
                        'height': '1.41176471em',
                        'line-height': '1.41176471'
                    },
                    color: {
                        header: '#04BE02',
                        headerText: '#fff'
                    },
                    buttons: {
                        ok: '确定',
                        cancel: '取消'
                    }
                }
            }
        },
        components: {
            topBar,
            confirm,
            loadingToast,
            completeToast,
            prompt,
            actionSheet,
            datePicker
        },
        methods: {
            // 添加一条发票
            addInvoiceItem: function () {
                var now = new Date();
                var year = now.getFullYear().toString();
                var month = now.getMonth() + 1;
                var day = now.getDate().toString();
                var addZero = function (num) {  // 小于10,前面补零
                    var str = '';
                    if (parseInt(num) < 10) {
                        str = '0' + num;
                    } else {
                        str = num.toString();
                    }
                    return str;
                };
                month = addZero(month);
                day = addZero(day);
                var date = year + '-' + month + '-' + day;
                this.reimburseData.invoiceDetail.unshift({
                    invoiceId: '',                  // 发票id，默认为空
                    invoiceTypeCode: '',            // 发票类型Code
                    invoiceTypeName: '',            // 发票类型Name
                    money: '',                      // 发票金额
                    date: date,                     // 发票日期
                    imgSrc: []                      // 图片src
                });
            },

            // 计算总金额
            sum: function () {
                var sum = 0;
                var _this = this;
                this.reimburseData.invoiceDetail.forEach(function (value) {
                    if (window.isNaN(parseFloat(value.money)) || parseFloat(value.money) <= 0) {
                        _this.$refs.prompt.showPrompt('金额必须是有效数字！');
                    } else {
                        sum += parseFloat(value.money);
                        _this.reimburseData.totalMoney = sum.toFixed(2);
                    }
                });
            },

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
            // 删除图片
            removeImg: function () {
                // 删除图片
                this.reimburseData.invoiceDetail[this.invoiceImgIndex.parentIndex].imgSrc.splice(this.invoiceImgIndex.selfIndex, 1);
                // 关闭弹窗
                this.invoiceBigImg = false;
            },

            openActionSheet: function (event, url, categoryCode) {
                // 打开弹窗并请求数据
                this.target = event.target.id;
                switch (this.target) {
                    case 'belongToProjectName':     // 项目状态
                        this.$refs.belongToProject.getActionSheetItems(url, categoryCode);
                        this.belongToProject.actionTitle = '所属项目';
                        this.belongToProject.actionSheetShow = true;
                        break;

                    case 'approveManagerName':     // 项目状态
                        this.$refs.approveManagerName.getActionSheetItems(url, categoryCode);
                        this.approveManagerName.actionTitle = '审批人';
                        this.approveManagerName.actionSheetShow = true;
                        break;
                    case 'invoiceType':    // 发票类型
                        this.$refs.category.getActionSheetItems(url, categoryCode);
                        this.category.actionTitle = '发票类型';
                        this.category.actionSheetShow = true;
                        break;
                }
            },

            chooseActionItem: function (index) {
                // 确认选择
                switch (this.target) {
                    case 'belongToProjectName':     // 项目状态
                        this.$refs.belongToProject.chooseActionItem(index);
                        this.reimburseData.belongToProjectCode = this.belongToProject.choosedData.projectCode;
                        this.reimburseData.belongToProjectName = this.belongToProject.choosedData.projectName;
                        break;
                    case 'approveManagerName':     // 审批人
                        this.$refs.approveManagerName.chooseActionItem(index);
                        this.reimburseData.approveManagerCode = this.approveManagerName.choosedData.userCode;
                        this.reimburseData.approveManagerName = this.approveManagerName.choosedData.userName;
                        break;
                    case 'invoiceType':    // 发票类型
                        this.$refs.category.chooseActionItem(index);
                        this.reimburseData.invoiceDetail[this.invoiceImgIndex.parentIndex].invoiceTypeCode = this.category.choosedData.categoryItemCode;
                        this.reimburseData.invoiceDetail[this.invoiceImgIndex.parentIndex].invoiceTypeName = this.category.choosedData.categoryItemName;
                        break;
                }
            },

            // 定义提交表单的方法
            postReimburseInfo: function (state) {
                this.$http.post(reimburseBuildUrl, {
                    'reimburseData': JSON.stringify(this.reimburseData),
                    'state': state
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
            },

            uploadImg: function (files, index) {
                var canvas = document.createElement('canvas');
                var file = files[0];
                var reader = new window.FileReader();
                var _this = this;
                this.loadingToastShow = true;
                reader.onload = function (e) {
                    var img = new window.Image();       // 创建一个img对象
                    img.src = e.target.result;          // 把img指向新取得的图片地址
                    // 配合canvas压缩图片
                    img.onload = function () {
                        if (img.width > 2400 || img.height > 2400) {
                            canvas.width = img.width / 8;
                            canvas.height = img.height / 8;
                        } else if (img.width > 1200 || img.height > 1200) {
                            canvas.width = img.width / 4;
                            canvas.height = img.height / 4;
                        } else if (img.width > 600 || img.height > 600) {
                            canvas.width = img.width / 2;
                            canvas.height = img.height / 2;
                        } else {
                            canvas.width = img.width;
                            canvas.height = img.height;
                        }
                        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                        _this.reimburseData.invoiceDetail[index].imgSrc.push({src: canvas.toDataURL()});
                        _this.loadingToastShow = false;
                    }
                };
                reader.readAsDataURL(file);
            },

            // 提交表单
            submitReimburse: function (state) {
                if (!this.reimburseData.totalMoney) {
                    // 显示提示信息
                    this.$refs.prompt.showPrompt('总金额不能为空！');
                } else if (!this.reimburseData.belongToProjectName) {
                    // 显示提示信息
                    this.$refs.prompt.showPrompt('所属项目不能为空!');
                } else if (!this.reimburseData.approveManagerName) {
                    // 显示提示信息
                    this.$refs.prompt.showPrompt('审批人不能为空!');
                } else {
                    // 验证通过，执行提交方法
                    this.postReimburseInfo(state);
                }
            }
        },
        created: function () {
            var reimburseId = this.$route.query.reimburseId;
            if (reimburseId) {
                // 如果reimburseId存在，说明是编辑报销单
                this.title = '编辑报销单'
                // 读取会话里的报销单信息
                var reimburseData = window.sessionStorage.getItem('reimburseData');
                if (reimburseData) {
                    this.reimburseData = JSON.parse(reimburseData);
                }
            } else {
                /*
                 * 如果reimburseId不存在，说明是新建报销单
                 * 加载页面时，默认添加一条发票
                 */
                this.addInvoiceItem();
                // 读取会话里的委托信息
                var entrustData = window.sessionStorage.getItem('entrustData');
                if (entrustData) {
                    // 如果委托信息存在，说明是委托新建
                    entrustData = JSON.parse(entrustData);
                    this.$set('reimburseData.entrustData', entrustData);
                    this.reimburseData.userName = entrustData.entrustName;
                    this.reimburseData.userCode = entrustData.entrustCode;
                    return false;
                }
                // 读取会话里的用户信息
                var userInfo = window.sessionStorage.getItem('userInfo');
                if (userInfo) {
                    userInfo = JSON.parse(userInfo);
                    this.reimburseData.userName = userInfo.userName;
                    this.reimburseData.userCode = userInfo.userCode;
                }
            }
        },
        beforeDestroy: function () {
            // 离开该页前，销毁会话信息中的委托信息，防止重新进入新建页面出错
            window.sessionStorage.removeItem('entrustData');
        }
    }
</script>
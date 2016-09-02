<template>
    <div v-show="actionSheet.actionSheetShow" transition="fade">
        <div class="weui_mask" @click="closeActionSheet"></div>
        <div class="action-list" v-show="actionSheet.actionSheetShow" transition="slideDown">
            <div class="action-list-hd">
                <div class="weui_cell">
                    <div class="weui_cell_bd weui_cell_primary">
                        <p>{{actionSheet.actionTitle}}</p>
                    </div>
                    <div class="weui_cell_ft">
                        <a href="javascript:void(0);" class="weui_btn weui_btn_mini weui_btn_primary"
                           @click="closeActionSheet">确定</a>
                    </div>
                </div>
            </div>
            <div class="action-list-bd">
                <div class="weui_cells weui_cells_radio">
                    <slot>暂无数据！</slot>
                </div>
            </div>
        </div>
        <!-- ajax失败时的提示信息 -->
        <prompt :prompt="prompt" v-ref:prompt></prompt>
    </div>
</template>
<script>
    import prompt from  '../components/prompt.vue';  // ajax失败时的提示信息
    export default {
        props: {
            /*
             * actionSheet是个对象,有三个参数
             * actionTitle: '', 代表弹出框标题
             * choosedData: {}, 代表已选择的数据
             * actionSheetData: [] 代表后台返回的数据
             * actionSheetShow 弹框是否显示
             }
             */
            actionSheet: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {
                prompt: {
                    promptShow: false,          // 设置提示信息框是否显示，默认不显示
                    promptMsg: ''               // 提示信息内容，默认为空
                }
            }
        },
        components: {
            prompt
        },
        methods: {
            closeActionSheet: function () {
                this.actionSheet.actionSheetShow = false;
                this.actionSheet.actionSheetData = [];
            },
            chooseActionItem: function (index) {
                // 选择弹框内的条目
                this.actionSheet.choosedData = this.actionSheet.actionSheetData[index];
            },
            getActionSheetItems: function (url, categoryCode) {
                /*
                 * 请求弹框的内容,categoryCode是字典值,由后台确定
                 * PRJ_STS 项目状态
                 * CCY_CDE 币种
                 * PRJ_MTD 代表计费方式
                 * CTRT_STS 合同状态
                 * CTRT_TYPE 合同类型
                 * INV_TYPE  开票类型
                 * INV_STS   开票状态
                 * PYMT_STS  支付状态
                 * EXP_TYPE  发票类型
                 */
                if (categoryCode) {
                    // 判断是否根据字典值查询
                    url = url + '?categoryCode=' + categoryCode;
                }
                this.$http.get(url).then(function (response) {
                    var result = response.json();
                    if (result.success) {
                        this.actionSheet.actionSheetData = result.categoryList;
                    } else {
                        // 显示错误信息
                        this.$refs.prompt.showPrompt(result.error);
                    }
                }, function (response) {
                    // 显示错误信息
                    this.$refs.prompt.showPrompt('请求超时!');
                });
            }
        }
    }
</script>
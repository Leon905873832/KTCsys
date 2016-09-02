/**
 * Created by Administrator on 2016/8/25.
 */
import Login from '../../views/Login.vue'
import Home from '../../views/Home.vue'
import ReimburseList from '../../views/ReimburseList.vue'
import ReimburseDetail from '../../views/ReimburseDetail.vue'
import ReimburseBuild from '../../views/ReimburseBuild.vue'
import ApproveList from '../../views/ApproveList.vue'
import ApproveDetail from '../../views/ApproveDetail.vue'

import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
var router = new VueRouter();
router.map({
    '/login.html': {
        name: 'login',
        component: Login
    },
    '/modify_password.html': {
        name: 'modify',
        component: function (resolve) {
            require(['../../views/ModifyPassword'], resolve)
        }
    },
    '/home.html': {
        name: 'home',
        component: Home
    },
    '/reimburseList.html': {
        name: 'reimburseList',
        component: ReimburseList
    },
    '/reimburseDetail.html': {
        name: 'reimburseDetail',
        component: ReimburseDetail
    },
    '/reimburseBuild.html': {
        name: 'reimburseBuild',
        component: ReimburseBuild
    },
    '/approveList.html': {
        name: 'approveList',
        component: ApproveList
    },
    '/approveDetail.html': {
        name: 'approveDetail',
        component: ApproveDetail
    },
    '/entrustBuild.html': {
        name: 'entrustBuild',
        component: function (resolve) {
            require(['../../views/EntrustBuild'], resolve)
        }
    },
    '/entrustList.html': {
        name: 'entrustList',
        component: function (resolve) {
            require(['../../views/EntrustList'], resolve)
        }
    }
});
router.redirect({
  // 重定向 / 到 /login.html
  '/': '/login.html'
});
router.beforeEach(function (transition) {
    if (!window.sessionStorage.getItem('userInfo') && transition.to.path !== '/login.html' && transition.to.path !== '/modify_password.html') {
        router.go({path:'/login.html'});
    }else{
        transition.next();
    }
});
export default router

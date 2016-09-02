<template>
	<header>
	    <a href="javascript:void(0)" class="go-back" @click="goBack">
	        <i class="iconfont">&#xe600;</i>
	    </a>
	    <a href="javascript:void(0)" class="go-home" @click="goHome">
	        <i class="iconfont">&#xe604;</i>
	    </a>
	    <h1>{{headTitle}}</h1>
	</header>
</template>
<script>
	export default {
		props:['headTitle'],
		methods: {
			goBack: function () {
                window.history.back();
            },
            goHome: function () {
            	var userInfo = window.sessionStorage.getItem('userInfo');
	            if (userInfo !== null) {
	                var userCode = JSON.parse(userInfo).userCode;
	            }
            	this.$route.router.go({name: 'home', query: {userCode: userCode}});
            }
		}
	}
</script>
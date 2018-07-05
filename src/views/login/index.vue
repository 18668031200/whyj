<template>
	<div class="login-container">
		<el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" >
			<div class="title-container">
				<p class="title">{{ $t('login.title')}}</p>
			</div>
			<el-form-item prop="username">
				<span class="svg-container svg-container_login">
					<svg-icon icon-class="input"></svg-icon>
				</span>
				<el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="username" ></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password"></svg-icon>
				</span>
				<el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" placeholder="password"></el-input>
				<span class="show-pwd" @click="showMyPwd">
					<svg-icon icon-class="eye" />
				</span>
			</el-form-item>

			<el-button type="primary" class="container-sub-button" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.login')}}</el-button>

		</el-form>

	</div>
</template>

<script type="text/javascript">
import { isvalidUsername } from '@/utils/validator'

export default{
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('The password can not be less than 5 digits'))
      }  else {
        callback()
      }
    } 

    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },

  methods: {
    showMyPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if(this.loginForm.username !== 'admin'){
            this.$router.push({ path: '/show' })
            return
          }
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    isvalidPassword(password){
      return password === 'admin'
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
	$background: #fafbfa;
	$dark_gray:#131b1f;
	$light_gray:rgb(101, 102, 105);

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $background inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
	$background: #fafbfa;
	$dark_gray:#082a14;
	$light_gray:#eee;

	.login-container{
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: $background;
		.login-form{
			position: absolute;
    		left: 0;
    		right: 0;
    		width: 520px;
    		padding: 35px 35px 15px 35px;
    		margin: 120px auto;
		}
		.svg-container {
		    padding: 6px 5px 6px 15px;
		    color: $dark_gray;
		    vertical-align: middle;
		    width: 30px;
		    display: inline-block;
		    &_login {
		      font-size: 20px;
	    	}
  		}
  		.title-container {
		    position: relative;
		    .title {
		      font-size: 26px;
		      font-weight: 400;
		      color: $light_gray;
		      margin: 0px auto 40px auto;
		      text-align: center;
		      font-weight: bold;
		    }
  		}
  		.show-pwd {
		    position: absolute;
		    right: 10px;
		    top: 7px;
		    font-size: 16px;
		    color: $dark_gray;
		    cursor: pointer;
		    user-select: none;
		}
		.container-sub-button{

		}

	}

</style>

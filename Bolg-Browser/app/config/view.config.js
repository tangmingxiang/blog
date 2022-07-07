export default {
  "login": {
    id: 'loginModal',
    title: '登 录',
    formType: 'loginForm',
    formData: [
      {
        label: "用户名",
        query: "username",
        type: "text",
        placeholder: "请输入用户名"
      },
      {
        label: "密码",
        query: "password",
        type: "password",
        placeholder: "请输入密码"
      }
    ],
    btns: [
      {
        name: '尚无账号, 注册',
        toggle: 'modal',
        targetName: '#registerModal',
        type: 'button'
      },
      {
        name: '登录',
        type: 'submit'
      },
      {
        name: '取消',
        type: 'button',
        dismiss: 'modal'
      }
    ]
  },
  "register": {
    id: 'registerModal',
    title: '注 册',
    formType: 'registerForm',
    formData: [
      {
        label: "用户名",
        query: "username",
        type: "text",
        placeholder: "请输入用户名，长度6-8位，包含数字和字母"
      },
      {
        label: "密码",
        query: "password",
        type: "password",
        placeholder: "请输入密码，至少包含大小写字母和数字，长度8-12位"
      },
      {
        label: "邮箱",
        query: "email",
        type: "text",
        placeholder: "请输入邮箱地址"
      }
    ],
    btns: [
      {
        name: '注册',
        type: 'submit'
      },
      {
        name: '重置',
        type: 'reset'
      },
      {
        name: '取消',
        dismiss: 'modal',
        type: 'button'
      }
    ]
  }
}
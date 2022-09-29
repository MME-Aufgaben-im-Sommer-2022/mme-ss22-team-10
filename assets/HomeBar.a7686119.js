var r=Object.defineProperty;var c=(n,o,t)=>o in n?r(n,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[o]=t;var e=(n,o,t)=>(c(n,typeof o!="symbol"?o+"":o,t),t);import{W as l,G as i,a as s,D as a,M as d,S as p,T as g,b as u,c as h,E as m}from"./index.634112ec.js";import f from"./UserSettings.552f17e2.js";const $=`<div id="home-bar-container">
  <div class="spacer"></div>
  <span id="greet-text"></span>
  <div class="spacer"></div>
  <moon-sun-toggle></moon-sun-toggle>
  <div id="profile-icon" class="icon profile"></div>
  <div id="profile-dropdown-menu" class="doodle-border">
    <div id="account-information">
      <svg>
        <image xlink:href="https://i.imgur.com/6E0t6HW.png" />
      </svg>
      <span id="username"></span>
      <span id="email"></span>
    </div>
    <span id="manage-account">Manage Account</span>
    <span id="logout-option">Logout</span>
  </div>
</div>
`,v=`home-bar{height:3.5em}#home-bar-container{display:flex;flex-direction:row;width:100%;height:100%;justify-content:flex-end}#home-bar-container>#greet-text{align-self:center;text-align:center;font-size:var(--font-size-large);border-bottom:var(--text-accent) solid 2px;white-space:nowrap;text-overflow:ellipsis}#user-settings-container{width:40%;height:90%}#profile-icon:hover{cursor:pointer}#profile-dropdown-menu{position:absolute;display:none;margin:3em 1em 0 0;background-color:var(--background-primary);border-radius:5px}#profile-dropdown-menu>span{text-decoration:none;display:inherit;padding:10px}#profile-dropdown-menu>#account-information{align-items:center;padding:10px}#account-information>svg{margin:10px;padding:10px;width:100px;height:100px;border-radius:100px;background-color:var(--background-focus)}image{width:100%;height:100%}#username{text-autospace:ideograph-alpha;font-size:large}#email{font-size:small}#manage-account{border-bottom:var(--background-focus) dashed 2px;color:var(--text-accent)}#manage-account:hover{color:var(--text-accent-hover);cursor:pointer}#logout-option{color:var(--text-faint)}#logout-option:hover{color:var(--error-color);cursor:pointer}.show{display:flex!important}
`,x="logout";class M extends l{constructor(){super($,v);e(this,"$greetText");e(this,"$userSettingsModal");e(this,"$profileIcon");e(this,"$profileDropdown");e(this,"$logoutOpt");e(this,"$manageAccOpt");e(this,"$username");e(this,"$email");e(this,"userSettingsModelState");e(this,"$onLogoutOptionClicked",async()=>{await a.signOut(),new g().setMessage("\u{1F44B} Bye bye - see you soon!").setType(u.Info).setDuration(h.Short).show(),m.notifyAll(x,{}),setTimeout(()=>window.location.reload(),2e3)});e(this,"onManageAccOptionClicked",()=>{this.$userSettingsModal.toggle()});e(this,"onUserSettingsChanged",()=>{this.$setGreetText()});e(this,"$setAccInfo",async()=>{const t=await a.getAccountData();this.$email.innerHTML=t.email,this.$username.innerHTML=`\u{1F331}${t.name}`});e(this,"$onProfileIconClicked",()=>{this.$setAccInfo(),this.$profileDropdown.classList.toggle("show")});e(this,"$onFocusOut",()=>{const t=event.target;t!==this.$profileIcon&&(t===this.$manageAccOpt||!this.$profileDropdown.contains(t))&&this.$profileDropdown.classList.remove("show")})}get htmlTagName(){return"home-bar"}onCreate(){return this.initData().then(()=>{this.$initHtml(),this.initListener()})}async initData(){if(!i.hasState(s.userSettingsModel)){const t=await a.getUserSettingsModel();if(t)i.addState(t.toState(),s.userSettingsModel);else throw new Error("Could not load user settings model")}this.userSettingsModelState=i.getStateById(s.userSettingsModel)}$initHtml(){this.$greetText=this.select("#greet-text"),this.$profileIcon=this.select("#profile-icon"),this.$profileDropdown=this.select("#profile-dropdown-menu"),this.$logoutOpt=this.select("#logout-option"),this.$manageAccOpt=this.select("#manage-account"),this.$username=this.select("#username"),this.$email=this.select("#email"),this.$setGreetText(),this.$setAccInfo(),this.$userSettingsModal=new d().setContent(new f).build()}initListener(){this.$manageAccOpt.addEventListener("click",this.onManageAccOptionClicked),this.$logoutOpt.addEventListener("click",this.$onLogoutOptionClicked),this.$profileIcon.addEventListener("click",this.$onProfileIconClicked),document.addEventListener("click",this.$onFocusOut),this.userSettingsModelState.addEventListener(p,this.onUserSettingsChanged)}$setGreetText(){this.$greetText.innerHTML=`\u{1F331} Hello ${this.userSettingsModelState.value.username}!`}}export{M as default};

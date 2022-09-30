var p=Object.defineProperty;var w=(e,s,t)=>s in e?p(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t;var n=(e,s,t)=>(w(e,typeof s!="symbol"?s+"":s,t),t);import{W as h,G as m,a as v,D as a,d as g,T as o,b as u,c as f}from"./index.e194eebf.js";const $=`<span class="title-m" id="user-settings-title">\u270F\uFE0F Edit your profile</span>

<div class="outer-container">
  <div class="container">
    <!--Change username-->
    <span for="new-username-input">Username:</span>
    <input
      id="new-username-input"
      type="text"
      placeholder="Username"
      class="input"
    />
  </div>
  <div class="container">
    <!--Change email-->
    <label for="new-email-input">Email:</label>
    <input
      type="email"
      class="form-control"
      id="new-email-input"
      placeholder="Email"
    />
  </div>
</div>

<!--Change password-->
<div id="new-passwords-input-container" class="outer-container">
  <div class="container">
    <span for="new-password-input">New password:</span>
    <input
      id="new-password-input"
      type="password"
      class="input"
      placeholder="New password"
    />
  </div>
  <div class="container">
    <span for="confirm-new-password-input">Confirm password:</span>
    <input
      id="confirm-new-password-input"
      type="password"
      class="input"
      placeholder="Confirm password"
    />
  </div>
</div>

<!--curren password-->
<div class="outer-container">
  <div class="container">
    <label for="current-password-input">Current Password:</label>
    <input
      type="password"
      class="input"
      id="current-password-input"
      placeholder="Current Password"
    />
  </div>
</div>

<div class="outer-container"></div>
<!--Buttons-->
<div id="settings-buttons">
  <button id="cancel-button" class="button">Cancel</button>
  <div class="spacer"></div>
  <button id="save-button" class="button">Save</button>
</div>
`,S=`user-settings{overflow-y:auto;padding-left:var(--spacing-large);padding-right:var(--spacing-large)}span,label,input{margin-top:var(--spacing-small);margin-bottom:var(--spacing-small)}#user-settings-title{text-align:center}#settings-buttons{display:flex;flex-direction:row;align-items:center;justify-content:center;width:100%;height:100%;padding:0;margin:0}.outer-container{margin-top:1em;border-top:dashed var(--background-focus)}#new-passwords-input-container{flex-direction:row}#new-passwords-input-container>div{flex-direction:column}#confirm-new-password-input,#new-password-input{width:100%}#current-password-input{width:50%}
`;class I extends h{constructor(){super($,S);n(this,"userSettingsModelState");n(this,"$newUsernameInput");n(this,"$newEmailInput");n(this,"$newPasswordInput");n(this,"$confirmNewPasswordInput");n(this,"$currentPasswordInput");n(this,"$cancelButton");n(this,"$saveButton");n(this,"accountData");n(this,"didSave",!1);n(this,"setAccountData",async()=>{this.accountData={email:"",username:""};const t=await a.getAccountData();this.accountData.email=t.email,this.accountData.username=t.name});n(this,"$setUserSettingsFormula",async()=>{await this.setAccountData(),this.$newEmailInput.value=this.accountData.email,this.$newUsernameInput.value=this.accountData.username,this.$currentPasswordInput.value="",this.$newPasswordInput.value="",this.$confirmNewPasswordInput.value=""});n(this,"$onCancelClicked",()=>{this.close(!1)});n(this,"$onSaveClicked",async()=>{const t=this.$newUsernameInput.value,i=this.$newEmailInput.value,r=this.$newPasswordInput.value,d=this.$confirmNewPasswordInput.value,c=this.$currentPasswordInput.value;try{if(t!==this.accountData.username&&(await a.updateUsername(t),this.userSettingsModelState.value.username=t,this.accountData.username=t),i!==this.accountData.email&&(await a.updateEmail(i,c),this.accountData.email=i),r!=="")if(r===d)await a.updatePassword(r,c),await a.signOut(),window.location.reload();else{this.showErrorToast("passwords not matching");return}this.close(!0),this.$setUserSettingsFormula()}catch(l){l instanceof Error&&this.showErrorToast(l.message);return}});n(this,"close",t=>{this.didSave=t,this.notifyAll(g.DO_CLOSE_EVENT)});n(this,"onModalClose",()=>{this.$setUserSettingsFormula(),this.didSave?this.onSavedUserSettings():this.onCanceledUserSettings(),this.didSave=!1});n(this,"onSavedUserSettings",()=>{new o().setType(u.Success).setMessage("\u{1F4BE} Your account settings have been updated").show()});n(this,"onCanceledUserSettings",()=>{new o().setType(u.Warning).setMessage("\u{1F5D1}\uFE0F Your changes have been discarded").show()});this.userSettingsModelState=m.getStateById(v.userSettingsModel)}onCreate(){this.$initHtml(),this.initListener()}$initHtml(){["slide-down-in","floating-container"].forEach(t=>this.classList.add(t)),this.$newUsernameInput=this.select("#new-username-input"),this.$newEmailInput=this.select("#new-email-input"),this.$newPasswordInput=this.select("#new-password-input"),this.$confirmNewPasswordInput=this.select("#confirm-new-password-input"),this.$currentPasswordInput=this.select("#current-password-input"),this.$cancelButton=this.select("#cancel-button"),this.$saveButton=this.select("#save-button"),this.$setUserSettingsFormula()}initListener(){this.$cancelButton.addEventListener("click",this.$onCancelClicked),this.$saveButton.addEventListener("click",this.$onSaveClicked)}get htmlTagName(){return"user-settings"}showErrorToast(t){new o().setMessage(t).setType(u.Error).setDuration(f.Short).show()}}export{I as default};

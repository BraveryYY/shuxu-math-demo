(() => {
  'use strict';
  const nav=[
    ['教学工作区',[['schedule','教学安排','calendar'],['tasks','教学待办','list'],['catalog','课程与班级','book'],['students','学生档案','users']]],
    ['机构管理',[['pay','教师课酬','coins'],['settings','教学设置','settings']]]
  ];
  const rootNav = {class:'catalog', course:'catalog', student:'students', exam:'students'};
  const lessonPages = new Set(['session', 'prepare', 'prep', 'classroom', 'project', 'record', 'feedback']);
  let lessonOrigin = {page:'schedule', path:'schedule'};
  function activeArea(key, parts) {
    if (key === 'tasks' || key === 'schedule' || key === 'catalog' || key === 'course' || key === 'class') {
      lessonOrigin = {page:rootNav[key] || key, path:[key, ...parts].map(encodeURIComponent).join('/')};
    } else if (!lessonPages.has(key)) {
      lessonOrigin = {page:'schedule', path:'schedule'};
    }
    return lessonPages.has(key) ? lessonOrigin.page : rootNav[key] || key;
  }
  const aliases={'exam-demo':'exam',lesson:'prep',mobile:'record',finance:'pay',members:'settings',models:'settings',institution:'settings'};
  const more={prep:'课次备课',classroom:'课次授课',prepare:'课次备课',session:'课次详情',class:'班级详情',course:'课程详情',project:'课堂投屏',record:'记录作答',feedback:'课后反馈',student:'学生个人档案',exam:'模拟试卷批阅'};
  const $=s=>document.querySelector(s),{icon,esc}=W;
  const pages=Object.fromEntries(nav.flatMap(([,items])=>items.map(([key,name])=>[key,name])));
  W.lessonReturn = () => ({
    path:lessonOrigin.path,
    label:more[lessonOrigin.path.split('/')[0]] || pages[lessonOrigin.page]
  });
  function route(){
    const [raw,...parts]=location.hash.slice(1).split('/').map(s=>{try{return decodeURIComponent(s);}catch{return '';}});
    const key=aliases[raw]||raw||'schedule';
    return [Object.hasOwn(pages,key)||Object.hasOwn(more,key)?key:'schedule',parts];
  }
  function hideMenu(){document.body.classList.remove('menu-open');$('#nav-shade').hidden=true;$('#open-nav')?.setAttribute('aria-expanded','false');}
  function showMenu(){document.body.classList.add('menu-open');$('#nav-shade').hidden=false;$('#open-nav')?.setAttribute('aria-expanded','true');$('#sidebar a[aria-current=page]')?.focus();}
  function roles(){
    W.modal('切换演示身份','<p class="muted">选择身份后，课表和教师课酬会切换到相应的查看范围。</p><div class="role-box section-space">'+[['admin','陈老师','机构管理员兼七年级方程班教师'],['teacher','孙老师','七年级基础班教师']].map(([id,name,role])=>'<button class="btn" data-role="'+id+'"><span>'+name+'<small> · '+role+'</small></span>'+(id===W.state.role?icon('check'):'')+'</button>').join('')+'</div>',body=>{
      body.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{W.state.role=b.dataset.role;delete W.state.scope;W.save();W.closeModal();render();W.toast('已切换为'+(W.state.role==='admin'?'陈老师':'孙老师'));});
    });
  }
  function shell(key,parts){
    const active=activeArea(key,parts),teacher=W.state.role==='teacher',role=teacher?'任课教师':'机构管理员';
    const side=$('#sidebar');side.innerHTML='<a class="brandlink" href="#schedule" aria-label="数序，返回教学安排"><span class="brandglyph" aria-hidden="true"><i></i><i></i><i></i></span><span>数序</span><small>教师端</small></a><div class="org-chip"><span>'+icon('book',17)+'</span>'+esc(W.state.orgName)+'</div><nav>'+nav.map(([group,items])=>'<p class="rail-label">'+group+'</p>'+items.map(([id,text,ic])=>'<a class="rail-link" href="#'+id+'"'+(active===id?' aria-current="page"':'')+'>'+icon(ic)+'<span>'+text+'</span></a>').join('')).join('')+'</nav><div class="rail-profile"><button class="profile-button" type="button" aria-label="切换演示身份"><span class="avatar">'+(teacher?'孙':'陈')+'</span><span><strong>'+(teacher?'孙老师':'陈老师')+'</strong><small>'+role+'</small></span>'+icon('down',14)+'</button><p class="rail-label">模拟数据 · 进度仅保存在本浏览器</p></div>';
    side.querySelector('.profile-button').onclick=roles;
    side.querySelectorAll('a').forEach(a=>a.addEventListener('click',hideMenu));
    const parentLink = lessonPages.has(key)
      ? '<a class="nav-parent" href="#' + esc(lessonOrigin.path) + '">' + esc(W.lessonReturn().label) + '</a><b aria-hidden="true">/</b>'
      : '';
    $('#topbar').innerHTML='<div class="crumb"><button type="button" class="icon-btn mobile-menu" id="open-nav" aria-label="打开导航" aria-controls="sidebar" aria-expanded="false">'+icon('menu',17)+'</button><span class="context">教师工作台</span><b>/</b>'+parentLink+'<strong>'+esc(more[key]||pages[key])+'</strong></div><span class="t-right"><i></i>免登录演示</span>';
    $('#open-nav').onclick=showMenu;
    document.body.classList.toggle('project-only',key==='project');
    document.title=(more[key]||pages[key])+' · 数序教师工作台';
  }
  function settings(){
    const v=$('#view');
    v.innerHTML='<header class="page-head"><div><p class="eyebrow">'+esc(W.state.orgName)+'</p><h1>教学设置</h1><p>管理演示身份，查看机构成员和本机数据。</p></div></header><div class="set-grid"><section class="card"><h2>机构成员</h2><p>陈老师 · 管理员兼任课教师<br>孙老师 · 七年级基础班教师<br>周老师 · 八年级几何班教师</p><div class="buttons"><button class="btn" id="set-role">切换演示身份</button></div></section><section class="card"><h2>本机模拟生成</h2><p>备课和课后建议根据所选知识点、学生情况与课堂记录生成。可以修改、确认或打印。</p><div class="buttons"><a class="btn" href="#tasks/prepare">查看待备课次</a></div></section><section class="card"><h2>演示进度</h2><p>日期固定在 2026 年 11 月 18 日，方便比较已上课次和待上课次。更改保存在本浏览器。</p><div class="buttons"><button class="btn" id="reset-demo">重置本机演示</button></div></section></div>';
    $('#set-role').onclick=roles;$('#reset-demo').onclick=()=>W.modal('重置本浏览器的演示进度？','<p>本机保存的备课修改、课堂记录、试卷批阅、附件与课酬操作都会清除。</p><div class="buttons section-space"><button class="btn" id="keep-demo">保留进度</button><button class="btn primary" id="yes-reset">重置演示</button></div>',body=>{
      body.querySelector('#keep-demo').onclick=W.closeModal;body.querySelector('#yes-reset').onclick=async()=>{try{await DemoDossier.clearAttachments();}catch{return;}W.reset();W.closeModal();W.go('schedule');W.toast('已恢复初始演示');};
    });
  }
  function render(){
    const [key,parts]=route();hideMenu();shell(key,parts);
    if(['schedule','session','prepare','class','course','catalog'].includes(key))DemoSchedule.render(key,parts);
    else if(key==='tasks')TeachingTasks.render(parts);
    else if(['prep','classroom','project','record','feedback'].includes(key)){
      if(W.state.role==='admin')DemoLesson.render(key,parts);
      else if(key==='prep')DemoLesson.previewPlan();
      else{
        document.body.classList.remove('project-only');
        $('#view').innerHTML='<a class="page-back" href="#schedule">← 教学安排</a><section class="card"><p class="eyebrow">七年级方程班 · 第 9 讲</p><h1>解一元一次方程：去分母</h1><p class="section-space">本节课由陈老师负责。当前是孙老师的任课视角，可查看课次安排，或切换到陈老师体验备课与课堂记录。</p><div class="buttons section-space"><button class="btn primary" id="view-as-chen">以陈老师体验本讲</button><a class="btn" href="#session/eq9">查看课次安排</a></div></section>';
        $('#view-as-chen').onclick=()=>{W.state.role='admin';delete W.state.scope;W.save();render();};
      }
    }
    else if(['students','student','exam'].includes(key))DemoDossier.render(key,parts);
    else if(key==='pay')DemoPay.render(key,parts);
    else settings();
  }
  W.render=render;
  $('#dialog-close').onclick=W.closeModal;
  $('#dialog').addEventListener('click',e=>{if(e.target!==$('#dialog'))return;const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)W.closeModal();});
  $('#nav-shade').onclick=hideMenu;
  document.querySelector('.skip').onclick=e=>{e.preventDefault();$('#view').focus();};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){hideMenu();$('#open-nav')?.focus();}});
  function positionPage() {
    const target = document.querySelector('[data-route-stage]');
    if (target?.scrollIntoView) target.scrollIntoView({block:'start'});
    else window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',()=>{W.closeModal();render();positionPage();});
  render();
  if (document.querySelector('[data-route-stage]')) positionPage();
})();

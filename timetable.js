(() => {
  'use strict';
  const {esc,icon}=W;
  const classes={
    algebra:{name:'七年级方程班',course:'方程与应用',teacher:'陈老师',grade:'七年级',time:'18:30–19:30',room:'201 教室',day:'周三',students:['he','lin','zhou'],goal:'从等式性质出发，掌握移项、去括号与去分母，再用方程解决数量关系问题。'},
    basics:{name:'七年级基础班',course:'数与整式',teacher:'孙老师',grade:'七年级',time:'09:00–10:00',room:'202 教室',day:'周六',students:['he','lin'],goal:'用符号表示数量，能检查去括号时每一项的符号，并合并同类项。'},
    geometry:{name:'八年级几何班',course:'三角形的证明',teacher:'周老师',grade:'八年级',time:'14:00–15:00',room:'203 教室',day:'周日',students:[],goal:'根据题设标注对应关系，利用全等三角形与角平分线的性质说明结论。'}
  };
  const rows=[
    ['eq1','algebra','09-09',1,'用字母表示数'],['eq2','algebra','09-16',2,'方程与等式'],['ba1','basics','09-05',1,'有理数的意义'],['ba2','basics','09-12',2,'数轴与绝对值'],['gm1','geometry','09-06',1,'三角形的三边'],['gm2','geometry','09-13',2,'三角形的内角'],
    ['eq4','algebra','10-14',4,'认识一元一次方程'],['eq5','algebra','10-21',5,'检验方程的解'],['eq6','algebra','10-28',6,'等式的变形'],
    ['ba3','basics','10-10',3,'用数轴比较大小'],['ba4','basics','10-17',4,'有理数加减法'],['gm3','geometry','10-11',3,'三角形的外角'],['gm4','geometry','10-18',4,'对应边与对应角'],
    ['eq7','algebra','11-04',7,'等式的性质'],['eq8','algebra','11-11',8,'移项与合并同类项'],
    ['eq9','algebra','11-18',9,'解一元一次方程：去分母'],['eq10','algebra','11-25',10,'列方程解决数量关系'],['eq11','algebra','12-02',11,'用方程比较两种方案'],
    ['ba5','basics','11-07',5,'整式的加减'],['ba6','basics','11-14',6,'去括号法则'],['ba7','basics','11-21',7,'先化简，再求值'],['ba8','basics','11-28',8,'用整式表示数量关系'],['ba9','basics','12-05',9,'整式运算综合练习'],
    ['gm5','geometry','11-08',5,'全等三角形'],['gm6','geometry','11-15',6,'角平分线的性质'],['gm7','geometry','11-22',7,'角边角判定'],['gm8','geometry','11-29',8,'证明的书写'],['gm9','geometry','12-06',9,'三角形综合证明']
  ].map(([id,group,date,n,title])=>({id,group,date:'2026-'+date,n,title,...classes[group]}));
  const shortDay=date=>['周日','周一','周二','周三','周四','周五','周六'][new Date(date+'T12:00:00Z').getUTCDay()];
  const monthTitle=m=>m.slice(0,4)+' 年 '+Number(m.slice(5))+' 月';
  const dateText=d=>Number(d.slice(5,7))+' 月 '+Number(d.slice(8))+' 日';
  const self=()=>W.state.role==='teacher'?'孙老师':'陈老师';
  const focused=r=>r.id==='eq9';
  function phase(r){return focused(r)?W.state.lesson?.phase==='ended'?'已下课':W.state.lesson?.phase==='live'?'上课中':'最近待上':r.date<'2026-11-18'?'已完成':'待上课';}
  function past(r){return ['已完成','已下课'].includes(phase(r));}
  function badge(r){const p=phase(r);return '<span class="pill '+(past(r)?'gray':p==='待上课'?'blue':'amber')+'">'+p+'</span>';}
  const link=(path,label,primary=false)=>'<a class="btn small'+(primary?' primary':'')+'" href="#'+path+'">'+label+'</a>';
  const jump=r=>focused(r)?(phase(r)==='已下课'?link('feedback','课后反馈'):link('prep','备课')):link('session/'+r.id,past(r)?'查看记录':'课次详情');
  const ninth=rows.find(r=>r.id==='eq9');
  function feature(){
    const p=phase(ninth);
    return '<section class="tt-feature"><div class="tt-feature-copy"><p class="eyebrow"><i></i>七年级方程班 · 第 9 讲</p><h2>解一元一次方程：去分母</h2><p>11 月 18 日（周三）　18:30–19:30　<span class="tt-thin">·</span>　201 教室</p><div class="buttons"><a class="btn primary" href="#prep">'+icon('edit',16)+'进入备课</a><a class="btn" href="#'+(p==='已下课'?'feedback':'classroom')+'">'+icon(p==='已下课'?'file':'play',16)+(p==='已下课'?'查看课后反馈':p==='上课中'?'继续授课':'进入课堂')+'</a></div></div><div class="tt-board" aria-label="示例板书：等式两边同乘六"><small>本讲板书 · 等式两边同乘 6</small><p><span class="frac"><span>x + 1</span><span>3</span></span> − <span class="frac"><span>x − 2</span><span>6</span></span> = 2</p><p>2(x + 1) − (x − 2) = 12</p></div></section>';
  }
  function viewButtons(layout,options){
    return '<div class="view-switch" role="group" aria-label="显示方式">'+options.map(([id,label,ic])=>'<button type="button" data-layout="'+id+'" aria-pressed="'+(layout===id)+'">'+icon(ic,13)+label+'</button>').join('')+'</div>';
  }
  function statusText(r){
    if(focused(r)){
      if(past(r)){const count=Object.values(W.state.lesson?.feedbackByStudent||{}).filter(v=>v.confirmed).length;return '课后反馈 '+count+'/3 已确认';}
      return (W.state.lesson?.confirmed===false?'备课草稿待确认':'教学题包已确认')+' · 上课提醒已送达';
    }
    return past(r)?'出勤已登记 · 反馈已完成':'已排课 · '+((W.state.reminders||{})[r.id]?'提醒已送达':'待确认上课提醒');
  }
  function cards(list){return '<div class="tt-cards">'+list.map(r=>'<article class="tt-card '+(past(r)?'finished ':'')+(r.teacher===self()?'mine ':'')+(focused(r)&&!past(r)?'current':'')+'"><div class="line"><time>'+dateText(r.date)+' · '+shortDay(r.date)+'</time>'+badge(r)+'</div><h3>第 '+r.n+' 讲 · '+esc(r.title)+'</h3><p>'+r.name+' · '+r.teacher+(r.teacher===self()?'（本人）':'')+'</p><p>'+r.time+' · '+r.room+'</p><p>'+statusText(r)+'</p><div class="buttons">'+jump(r)+(focused(r)?link('session/'+r.id,'课次详情'):'')+'</div></article>').join('')+'</div>';}
  function listView(list){return '<div class="card">'+list.map(r=>'<article class="tt-row"><div><strong>'+dateText(r.date)+'</strong><p>'+r.time+'</p></div><div><h3>第 '+r.n+' 讲 · '+esc(r.title)+'</h3><p>'+r.name+' · '+r.teacher+(r.teacher===self()?'（本人）':'')+'</p></div><div>'+badge(r)+'<p>'+statusText(r)+'</p></div><div class="buttons">'+link('session/'+r.id,'课次详情')+(focused(r)?link('prep','备课',true):'')+'</div></article>').join('')+'</div>';}
  function calendar(month,list){
    const [y,m]=month.split('-').map(Number),first=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7,days=new Date(Date.UTC(y,m,0)).getUTCDate();
    let html='<div class="table-scroll"><div class="tt-calendar">'+['一','二','三','四','五','六','日'].map(x=>'<strong>周'+x+'</strong>').join('');
    for(let i=0;i<Math.ceil((first+days)/7)*7;i++){
      const n=i-first+1;if(n<1||n>days){html+='<div class="tt-cell blank"></div>';continue;}
      const date=month+'-'+String(n).padStart(2,'0');
      html+='<div class="tt-cell"><time>'+n+'</time>'+list.filter(r=>r.date===date).map(r=>'<a class="'+(past(r)?'past ':'')+(r.teacher===self()?'mine ':'')+(focused(r)&&!past(r)?'current':'')+'" href="#session/'+r.id+'" title="'+esc(r.title)+'">'+r.time.slice(0,5)+' '+r.name+'<br>第 '+r.n+' 讲 · '+r.teacher+'</a>').join('')+'</div>';
    }return html+'</div></div><p class="tt-legend">左侧绿线表示本人课次，深绿为最近待上，灰色为已完成。</p>';
  }
  function schedule(){
    const month=W.state.month||'2026-11',layout=W.state.layout||'cards';
    let scope=W.state.scope;if(!scope)scope=W.state.role==='admin'?'all':'mine';
    const filtered=rows.filter(r=>r.date.startsWith(month)&&(scope==='all'||(scope==='mine'?r.teacher===self():r.teacher===scope)));
    const ordered=[...filtered].sort((a,b)=>Number(past(a))-Number(past(b))||(past(a)?b.date.localeCompare(a.date):a.date.localeCompare(b.date)));
    const v=document.querySelector('#view');
    v.innerHTML='<header class="page-head"><div><p class="eyebrow">'+esc(W.state.orgName)+'</p><h1>教学安排</h1><p>查看机构排课，从本节课进入备课、授课和课后反馈。</p></div></header>'+feature()+'<nav class="tt-mobile-shortcuts" aria-label="工作台快捷入口"><a href="#students">'+icon('users',16)+' 学生档案</a><a href="#pay">'+icon('coins',16)+' 教师课酬</a></nav><section aria-label="机构排课"><div class="panel-bar"><h2>机构课表</h2><span class="tt-weeknote">'+filtered.length+' 个课次</span></div><div class="tt-controls"><div class="tt-ctrlleft"><div class="month-switch"><button class="icon-btn" aria-label="上个月" data-shift="-1">'+icon('left',16)+'</button><strong>'+monthTitle(month)+'</strong><button class="icon-btn" aria-label="下个月" data-shift="1">'+icon('chevron',16)+'</button></div>'+(month!=='2026-11'?'<button class="btn small" data-today>演示月份</button>':'')+'</div><div class="tt-ctrlright"><select aria-label="筛选教师" id="scope">'+[['all','全部教师'],['mine','本人课次'],...['陈老师','孙老师','周老师'].map(t=>[t,t])].map(([id,label])=>'<option value="'+id+'"'+(scope===id?' selected':'')+'>'+label+'</option>').join('')+'</select>'+viewButtons(layout,[['cards','卡片','grid'],['list','列表','list'],['month','月表','table']])+'</div></div>'+(layout==='month'?calendar(month,filtered):!filtered.length?'<div class="card tt-empty">所选月份和教师暂无排课。</div>':layout==='list'?listView(ordered):cards(ordered))+'</section>';
    v.querySelectorAll('[data-shift]').forEach(b=>b.onclick=()=>{const [y,m]=month.split('-').map(Number);W.state.month=new Date(Date.UTC(y,m-1+Number(b.dataset.shift),1)).toISOString().slice(0,7);W.save();schedule();});
    const reset=v.querySelector('[data-today]');if(reset)reset.onclick=()=>{W.state.month='2026-11';W.save();schedule();};
    v.querySelector('#scope').onchange=e=>{W.state.scope=e.target.value;W.save();schedule();};
    v.querySelectorAll('[data-layout]').forEach(b=>b.onclick=()=>{W.state.layout=b.dataset.layout;W.save();schedule();});
  }
  function history(id){
    const ls=rows.filter(r=>r.group===id);
    return '<div class="table-scroll"><table class="data-table"><thead><tr><th>日期</th><th>课次与内容</th><th>状态</th><th>操作</th></tr></thead><tbody>'+ls.map(r=>'<tr><td>'+dateText(r.date)+'</td><td>第 '+r.n+' 讲 · '+esc(r.title)+'</td><td>'+badge(r)+'</td><td><a href="#session/'+r.id+'">查看课次</a></td></tr>').join('')+'</tbody></table></div>';
  }
  function catalog(){
    const layout=W.state.catalogLayout||'cards';
    const v=document.getElementById('view');v.innerHTML='<header class="page-head"><div><p class="eyebrow">'+esc(W.state.orgName)+'</p><h1>课程与班级</h1><p>按班级查看课程内容、学员和历次授课记录。</p></div>'+viewButtons(layout,[['cards','卡片','grid'],['list','列表','list']])+'</header><div class="'+(layout==='cards'?'set-grid':'')+'">'+Object.entries(classes).map(([id,c])=>'<section class="card '+(layout==='list'?'section-space':'')+'"><p class="eyebrow">'+c.grade+' · '+c.teacher+'</p><h2>'+c.name+'</h2><p class="muted">'+c.day+' '+c.time+' · '+c.room+'</p><div class="buttons">'+link('class/'+id,'班级详情',true)+link('course/'+id,'课程详情')+'</div></section>').join('')+'</div>';
    v.querySelectorAll('[data-layout]').forEach(b=>b.onclick=()=>{W.state.catalogLayout=b.dataset.layout;W.save();catalog();});
  }
  function detail(kind,id){
    const c=classes[id];if(!c){catalog();return;}
    document.getElementById('view').innerHTML='<a class="page-back" href="#catalog">← 课程与班级</a><header class="page-head"><div><p class="eyebrow">'+c.grade+' · '+c.teacher+'</p><h1>'+esc(kind==='course'?c.course:c.name)+'</h1><p>'+c.day+' '+c.time+' · '+c.room+'</p></div>'+link((kind==='course'?'class/':'course/')+id,kind==='course'?'查看授课班级':'查看课程')+'</header><div class="card"><h2>'+(kind==='course'?'本课程的学习目标':'班级学习内容')+'</h2><p>'+esc(c.goal)+'</p>'+(kind==='class'&&c.students.length?'<div class="buttons section-space">'+c.students.map(s=>link('student/'+s,W.students.find(p=>p.id===s).name+' · 学生档案')).join('')+'</div>':'')+'</div><section class="card section-space"><h2>课次与历史记录</h2>'+history(id)+'</section>';
  }
  function session(id){
    const r=rows.find(row=>row.id===id);if(!r){schedule();return;}
    const p=past(r),active=focused(r),studentLinks=(r.students||[]).map(id=>link('student/'+id,W.students.find(s=>s.id===id).name)).join('');
    const v=document.getElementById('view');
    v.innerHTML='<a class="page-back" href="#schedule">← 教学安排</a><header class="page-head"><div><p class="eyebrow">'+esc(r.name)+' · '+r.teacher+'</p><h1>第 '+r.n+' 讲 · '+esc(r.title)+'</h1><p>'+dateText(r.date)+' '+shortDay(r.date)+' · '+r.time+' · '+r.room+'</p></div>'+badge(r)+'</header><div class="set-grid"><section class="card"><h2>教学内容</h2><p>'+esc(active?'能逐项写出去分母后的第一行，保留括号，并通过代入核对方程解。':r.goal)+'</p><div class="buttons">'+link('class/'+r.group,'查看班级')+(active?link('prep','进入备课',true):'')+'</div></section><section class="card"><h2>课次进度</h2><p>'+statusText(r)+'</p><div class="buttons">'+(active?link(p?'feedback':'classroom',p?'课后反馈':'进入课堂',true):p?'<span class="pill">已归入课程历史</span>':'<button class="btn" data-remind>记录提醒已送达</button>')+'</div></section></div>'+(studentLinks?'<section class="card section-space"><h2>班级学员</h2><div class="buttons section-space">'+studentLinks+'</div></section>':'');
    const b=v.querySelector('[data-remind]');if(b){b.disabled=!!W.state.reminders?.[r.id];b.onclick=()=>{(W.state.reminders||={})[r.id]=true;W.save();session(id);W.toast('已记录模拟通知状态');};}
  }
  window.DemoSchedule={render(section,parts){if(section==='catalog')return catalog();if(section==='course'||section==='class')return detail(section,parts[0]);if(section==='session')return session(parts[0]);return schedule();}};
})();

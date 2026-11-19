(() => {
  'use strict';

  const sampleId='he', sampleTitle='数与方程随堂小测', pdf='./materials/grade7-exam-sample.pdf';
  const grade7='七年级', grade6='六年级';
  const questions=[
    {stem:'计算 −6 − (−4) + 3。',answer:'−6 + 4 + 3 = 1',point:'有理数加减法',verdict:'correct',cause:'把减去负数改写成加 4 后，按顺序计算得 1。'},
    {stem:'化简 5 − (2x − 3)。',answer:'5 − 2x − 3 = 2 − 2x',point:'去括号法则',verdict:'wrong',cause:'括号前的减号要分给两项。2x 已变为 −2x，−3 也要变为 +3，结果应为 8 − 2x。'},
    {stem:'解方程 x/3 + 2 = 5，写出去分母后的第一行。',answer:'x + 6 = 15\nx = 9',point:'去分母时逐项同乘',verdict:'correct',cause:'把等式两边各项同乘 3，整数 2 也乘了 3，得到 x + 6 = 15。'},
    {stem:'3 本同价练习本和一支 5 元的笔共 26 元。每本练习本多少元？请用 x 表示每本的价格，并列出方程。',answer:'3x + 5 = 26\n3x = 21，x = 7',point:'列一元一次方程',verdict:'correct',cause:'三本练习本的总价是 3x 元，列出 3x + 5 = 26，解得每本 7 元。'}
  ];
  const verdictNames={correct:'正确',wrong:'有误',unclear:'待辨认'};
  const profiles={
    he:{
      summary:'有理数加减运算较熟练。解方程时会选公分母，仍需检查没有分母的整数项是否也乘了公分母。',
      sixth:'能根据线段图说明分数乘法的数量关系，遇到逆向问题还需要写下等量关系。',
      old:'单位“1”与分数乘法', oldWork:'24 人的 3/4 是 18 人，线段图的四段等长。',
      points:[['有理数加减法','连续两次答对','第 7 讲课后练习第 1、2 题'],['去分母时逐项同乘','待复测','11 月 4 日的随堂练习中，x/4 + 1 = 3 的第一行写成 x + 1 = 12，整数 1 漏乘 4。']],
      home:'解 2x + 5 = 15 时，能先在两边同时减 5，再求得 x = 5。', focus:'去分母时漏乘整数项'
    },
    lin:{
      summary:'能用代入检验方程的解。遇到分子是多项式的分式，有时会提前丢掉括号。',
      sixth:'能按比例分配总量，列比例式时偶尔交换对应项。',
      old:'按比例分配',oldWork:'把 40 个球按 3∶2 分配，先算出每份是 8 个。',
      points:[['解的检验','本次正确','第 8 讲出口题中代回等式两边复核。'],['去分母时保留分子括号','待复测','第 8 讲订正中，将 2(x−1) 展开成 2x−1。']],
      home:'用 x = 3 代入方程 4x − 3 = 9，分别写出了左右两边的值。', focus:'去分母后保留分子括号'
    },
    zhou:{
      summary:'会从文字题提取等量关系。解方程的第一行宜先写清公分母，再固定等号两边的符号。',
      sixth:'换算长度单位时会主动核对量纲，解比例需要继续练习检查内项与外项。',
      old:'比与比例',oldWork:'按图上 2 厘米代表实际 8 米完成换算，能写出比例尺。',
      points:[['列一元一次方程','本次正确','第 7 讲应用题中列出 2x+3=17。'],['选择公分母','待复测','第 8 讲课后题把分母 4、6 的公分母选成 6。']],
      home:'用 x 表示一件商品的价格，把“两件再加三元”写为 2x + 3。',focus:'选择能整除各分母的公分母'
    }
  };
  const esc=x=>W.esc(String(x??''));
  const clone=x=>JSON.parse(JSON.stringify(x));
  const link=(path,text,cl='btn')=>'<a class="'+cl+'" href="#'+path+'">'+text+'</a>';
  const root=()=>document.getElementById('view');
  const current=()=>W.state.dossier ||= {materials:{},exam:{draft:questions.map(q=>({...q,checked:false})),published:null}};
  const teacherView=()=>W.state.role==='teacher';
  const inBasicClass=id=>id==='he'||id==='lin';
  const rosterForActor=()=>W.students.filter(s=>!teacherView()||inBasicClass(s.id));
  const classLabel=id=>teacherView()?'七年级基础班':inBasicClass(id)?'七年级方程班 · 七年级基础班':'七年级方程班';
  const person=id=>W.students.find(s=>s.id===id);
  const who=id=>person(id)?.name||'模拟学生';
  const roleTag=(label,tone='')=>'<span class="ds-tag '+tone+'">'+esc(label)+'</span>';
  const button=(attr,label,cls='btn')=>'<button type="button" class="'+cls+'" '+attr+'>'+label+'</button>';
  const empty=(msg)=>'<p class="ds-empty">'+esc(msg)+'</p>';
  const summaryCard=(title,inner)=>'<section class="card ds-card"><h2>'+title+'</h2>'+inner+'</section>';
  const gradeLabel=g=>g==='6'?grade6:grade7;
  function live(id){return (W.state.lesson?.observations?.[id]||[]).filter(Boolean);}
  function feedback(id){const f=W.state.lesson?.feedbackByStudent?.[id];return f?.confirmed?f:null;}
  function recent(id){
    const parts=[];
    const f=feedback(id);
    if(f)parts.push('第 9 讲课后反馈已确认。');
    const obs=live(id);
    if(obs.length){const ok=obs.filter(o=>o.verdict==='correct').length;parts.push('第 9 讲已记录 '+obs.length+' 次作答，其中 '+ok+' 次第一行写对。');}
    if(id===sampleId&&current().exam.published){
      const qs=current().exam.published;parts.push('本次试卷共核对 '+qs.length+' 题，'+qs.filter(q=>q.verdict==='correct').length+' 题答对。');
    }
    return parts.join('');
  }
  function head(kicker,title,subtitle='',actions=''){
    return '<header class="page-head ds-head"><div><p class="eyebrow">'+esc(kicker)+'</p><h1>'+esc(title)+'</h1>'+(subtitle?'<p class="muted">'+esc(subtitle)+'</p>':'')+'</div>'+actions+'</header>';
  }
  function sampleRow(cls=''){
    const {published,draft}=current().exam;
    const revised=published&&JSON.stringify(published)!==JSON.stringify(draft);
    return '<a class="ds-row ds-link '+cls+'" href="#exam/he"><span><strong>'+sampleTitle+'</strong><small>校内试卷 · 家长上传 · 2026-11-18</small></span>'+roleTag(revised?'有未确认修改':published?'已确认':'待核对',published&&!revised?'good':'warm')+'<span aria-hidden="true">›</span></a>';
  }
  function roster(){
    const node=root(),people=rosterForActor();
    node.innerHTML='<div class="ds">'+head('教学工作区 / 学生档案','学生档案','长沙知行学堂 · 七年级数学')+
      '<div class="ds-rosterbar"><h2>我的学生 <small>'+people.length+' 人</small></h2><label>查找学生 <input type="search" id="ds-query" placeholder="输入学生姓名"></label></div><div class="ds-roster" id="ds-results"></div>'+
      '<section class="card ds-card ds-paperlink"><div><h2>试卷批阅</h2><p class="muted">七年级模拟作答卷 · 4 道题</p></div>'+link('exam/he','对照原卷批阅 →')+'</section></div>';
    const input=node.querySelector('#ds-query'), cards=node.querySelector('#ds-results');
    function update(){
      const filtered=people.filter(s=>s.name.includes(input.value.trim()));
      cards.innerHTML=filtered.map((s,i)=>'<a class="card ds-person ds-person-'+i%3+'" href="#student/'+s.id+'"><div class="ds-id"><span class="ds-avatar" aria-hidden="true">'+esc(s.name.slice(-1))+'</span><div><h3>'+esc(s.name)+'</h3><small>'+esc(classLabel(s.id))+'</small></div></div><p>'+esc(profiles[s.id]?.summary||'')+'</p><div class="ds-person-foot"><span>'+esc(profiles[s.id]?.focus||'')+'</span><strong>查看档案 →</strong></div></a>').join('')||empty('没有找到该姓名的学生。');
    }
    input.oninput=update;update();
  }
  function pointRows(id,grade){
    const p=profiles[id], rows=grade===grade6?[[p.old,'曾经答对',p.oldWork]]:p.points;
    const updates=grade===grade7&&id===sampleId?current().exam.published||[]:[];
    const records=rows.map(r=>({point:r[0],status:r[1],evidence:r[2]}));
    const examGroups=new Map();
    updates.forEach((q,i)=>{if(!q.point.trim())return;const group=examGroups.get(q.point)||[];group.push({...q,num:i+1});examGroups.set(q.point,group);});
    for(const [point,qs] of examGroups){
      const sure=qs.filter(q=>q.verdict!=='unclear');if(!sure.length)continue;
      const ok=sure.filter(q=>q.verdict==='correct').length;
      const status=ok===sure.length?'本卷答对，待巩固':ok===0?'待订正复测':'正误并存，待复测';
      const evidence=sure.map(q=>'样卷第 '+q.num+' 题：'+q.answer+(q.cause?'。'+q.cause:'')).join(' ');
      const hit=records.find(r=>r.point===point);
      if(hit){hit.status=status;hit.evidence=evidence;}else records.push({point,status,evidence});
    }
    if(grade===grade7&&live(id).length){
      const obs=live(id), q=obs.at(-1);
      records.push({point:'课堂：去分母的第一行',status:q.verdict==='correct'?'最近一次正确':'待订正复测',evidence:(q.firstLine?'原作答：'+q.firstLine+'。':'')+(q.cause||'来自第 9 讲课堂记录。')});
    }
    return records.map(r=>'<div class="ds-point"><div><strong>'+esc(r.point)+'</strong>'+roleTag(r.status,/待订正|待复测|正误/.test(r.status)?'warm':'good')+'</div><p>'+esc(r.evidence)+'</p></div>').join('');
  }
  function evidenceText(title,text){
    return '<details class="ds-disclosure"><summary>'+title+'</summary><p>'+esc(text)+'</p></details>';
  }
  function baselineMaterials(id,grade){
    const p=profiles[id];
    if(grade===grade6)return evidenceText('比例与数量关系练习 <small>· 学生提交 · 2026-06-16</small>',p.oldWork);
    return evidenceText('方程与应用课后练习 <small>· 学生提交 · 2026-11-11</small>',p.home)+
      (id===sampleId?sampleRow():'');
  }
  function extraMaterials(id,grade){
    return (current().materials[id]||[]).filter(m=>m.grade===grade).map(m=>'<div class="ds-material">'+evidenceText(esc(m.title)+' <small>· '+esc(m.source)+' · '+esc(m.kind)+'</small>',m.note||'尚无附注。')+(m.fileId?button('data-file="'+esc(m.fileId)+'"','打开附件','ds-text'):'')+'</div>').join('');
  }
  function reports(id){
    const f=feedback(id), pub=id===sampleId&&current().exam.published;
    let html='';
    if(f)html+=summaryCard('第 9 讲 · 家长反馈','<p>'+esc(f.text)+'</p><h3>课后练习</h3><p>'+esc(f.practice)+'</p>');
    if(pub)html+=summaryCard('样卷 · 家长反馈',familyReport(pub,id));
    return html;
  }
  function history(id,grade){
    const p=profiles[id];
    if(grade===grade6)return summaryCard('已结课班级','<h3>六年级数学衔接班</h3>'+evidenceText('6 月 16 日 · 比与数量关系',p.oldWork));
    const basics=inBasicClass(id)?summaryCard('在读班级','<h3><a class="ds-text" href="#class/basics">七年级基础班 →</a></h3><p class="muted">长沙知行学堂 · 孙老师</p>'+
      evidenceText('11 月 7 日 · 第 5 讲 · 整式的加减',id==='he'?'能先按字母与指数分组，再合并同类项。':'合并前能写出同类项的系数，复查时已改正一次漏项。')+
      evidenceText('11 月 14 日 · 第 6 讲 · 去括号法则',id==='he'?'括号前为负号时，第二项仍需核对符号。':'能圈出括号前的符号，练习中已正确展开两项。')):'';
    if(teacherView())return basics;
    const obs=live(id);
    const entries=obs.map((q,i)=>'<div class="ds-point"><div><strong>'+esc(typeof q.question==='number'?'第 '+q.question+' 题':q.question||'课堂练习 '+(i+1))+'</strong>'+roleTag(q.verdict==='correct'?'第一行正确':'第一行有误',q.verdict==='correct'?'good':'warm')+'</div><p>'+esc(q.firstLine||'未登记第一行')+(q.cause?' · '+esc(q.cause):'')+'</p></div>').join('');
    return summaryCard('在读班级','<h3><a class="ds-text" href="#class/algebra">七年级方程班 →</a></h3><p class="muted">长沙知行学堂 · 陈老师</p>'+
      evidenceText('11 月 4 日 · 第 7 讲 · 等式的性质',p.home)+evidenceText('11 月 11 日 · 第 8 讲 · 移项与合并同类项',p.points[1][2])+
      '<div class="ds-row"><strong>11 月 18 日 · 第 9 讲 · 解一元一次方程：去分母</strong>'+link('session/eq9','查看课次 →','ds-text')+'</div>'+
      (entries||empty('授课时记录的第一行与错因会出现在这里。')))+basics;
  }
  function archive(id,tab,level){
    if(teacherView()&&!inBasicClass(id)){
      root().innerHTML='<div class="ds">'+link('students','← 我的学生','ds-back')+head('学生档案','仅限本人负责的学员','孙老师可查看七年级基础班的学生档案。')+'</div>';
      return;
    }
    const s=person(id);if(!s||!profiles[id]){roster();return;}
    const grade=gradeLabel(level), p=profiles[id];
    const tabs=[['overview','学情总览'],['materials','学习资料'],['history','班级与课次']];
    if(!tabs.some(([v])=>v===tab))tab='overview';
    const suffix=grade===grade6?'6':'7';
    const content=tab==='overview'?
      summaryCard('学情摘要','<p>'+esc(grade===grade7?p.summary:p.sixth)+'</p>'+(grade===grade7&&recent(id)?'<p class="ds-update">'+esc(recent(id))+'</p>':''))+
      summaryCard('知识点掌握与依据',pointRows(id,grade))+(grade===grade7?reports(id):''):
      tab==='materials'?summaryCard(grade+'学习资料',baselineMaterials(id,grade)+extraMaterials(id,grade)+'<div class="ds-bottom">'+button('data-add-material','登记学习资料')+'</div>'):history(id,grade);
    const node=root();
    node.innerHTML='<div class="ds">'+link('students','← 学生档案','ds-back')+head('长沙知行学堂 / 学生档案',s.name,classLabel(id)+' · '+(teacherView()?'孙老师':'长沙知行学堂'))+
      '<div class="ds-tools"><nav class="ds-tabs" aria-label="档案项目">'+tabs.map(([key,title])=>'<a href="#student/'+id+'/'+key+'/'+suffix+'" '+(tab===key?'aria-current="page"':'')+'>'+title+'</a>').join('')+'</nav><label>查看年级 <select id="ds-grade"><option value="7" '+(suffix==='7'?'selected':'')+'>七年级</option><option value="6" '+(suffix==='6'?'selected':'')+'>六年级</option></select></label></div>'+
      '<div class="ds-stack">'+content+'</div></div>';
    node.querySelector('#ds-grade').onchange=e=>W.go('student/'+id+'/'+tab+'/'+e.target.value);
    const add=node.querySelector('[data-add-material]');if(add)add.onclick=()=>addMaterial(id,grade);
    node.querySelectorAll('[data-file]').forEach(btn=>btn.onclick=()=>openAttachment(id,btn.dataset.file));
  }
  const fileStore='shuxu-demo-dossier-files-v1';
  const fileDB=()=>new Promise((resolve,reject)=>{
    if(!window.indexedDB){reject(Error('当前浏览器不能保存附件，可只登记资料信息。'));return;}
    const op=indexedDB.open(fileStore,1);
    op.onupgradeneeded=()=>op.result.createObjectStore('files');
    op.onsuccess=()=>{op.result.onversionchange=()=>op.result.close();resolve(op.result);};op.onerror=()=>reject(Error('附件存储暂不可用。'));
  });
  async function clearAttachments(){
    if(!window.indexedDB)return;
    try{
      await new Promise((resolve,reject)=>{
        const req=window.indexedDB.deleteDatabase(fileStore);
        req.onsuccess=()=>resolve();
        req.onblocked=()=>reject(Error('附件仍在其他标签页中使用。请关闭那些标签页后重试。'));
        req.onerror=()=>reject(Error('本机附件未能清除，请重试。'));
      });
    }catch(err){
      W.toast(err.message||'本机附件未能清除，请重试。');
      throw err;
    }
  }
  async function fileAction(mode,id,data){
    const db=await fileDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('files',mode),bucket=tx.objectStore('files'),q=mode==='readonly'?bucket.get(id):bucket.put(data,id);
      tx.oncomplete=()=>{db.close();resolve(q.result);};tx.onerror=tx.onabort=()=>{db.close();reject(Error('浏览器未能保存或读取附件。'));};
    });
  }
  async function openAttachment(id,fileId){
    const m=(current().materials[id]||[]).find(r=>r.fileId===fileId);if(!m)return;
    try{const file=await fileAction('readonly',fileId);if(!file)throw Error('未找到此浏览器内的附件。');
      const a=document.createElement('a'),url=URL.createObjectURL(file);a.href=url;a.download=m.filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(e){W.toast(e.message);}
  }
  function addMaterial(id,grade){
    W.modal('登记学习资料','<form class="ds-form" id="ds-add-form"><p>'+esc(who(id))+' · '+grade+'数学</p><label>资料名称<input name="title" required maxlength="65" placeholder="如：一元一次方程月考卷"></label><label>资料类型<select name="kind"><option>校内作业</option><option>校内试卷</option><option>机构练习</option><option>订正资料</option></select></label><label>提交人<select name="source"><option>学生本人</option><option>家长</option><option>教师代录</option></select></label><label>学习记录<textarea name="note" maxlength="1200" rows="3"></textarea></label><label>本地附件（可选，限 5 MB）<input type="file" name="file" accept="application/pdf,image/jpeg,image/png,image/webp"></label><p class="muted">附件仅保存在当前浏览器。请使用模拟资料。</p><p role="status" data-status></p><button class="btn primary" type="submit">保存资料</button></form>');
    const f=document.getElementById('ds-add-form');if(!f)return;
    f.onsubmit=async e=>{
      e.preventDefault();const b=new FormData(f),title=String(b.get('title')||'').trim(),file=b.get('file'),btn=f.querySelector('button');if(!title)return;
      btn.disabled=true;let fileId='',filename='';
      try{
        if(file?.size){
          if(file.size>5*1024*1024||!['application/pdf','image/jpeg','image/png','image/webp'].includes(file.type))throw Error('请选择 5 MB 以内的 PDF、JPG、PNG 或 WebP。');
          fileId=crypto.randomUUID();filename=file.name;await fileAction('readwrite',fileId,file);
        }
        const bucket=current().materials;bucket[id]||=[];bucket[id].unshift({title,grade,kind:String(b.get('kind')),note:String(b.get('note')||'').trim(),source:String(b.get('source')),fileId,filename});
        W.save();W.closeModal();archive(id,'materials',grade===grade6?'6':'7');W.toast('学习资料已保存');
      }catch(err){btn.disabled=false;f.querySelector('[data-status]').textContent=err.message;}
    };
  }
  function familyReport(qs,id){
    const name=who(id), positives=qs.map((q,i)=>({q,i})).filter(x=>x.q.verdict==='correct');
    const wrong=qs.map((q,i)=>({q,i})).filter(x=>x.q.verdict==='wrong');
    const unclear=qs.map((q,i)=>({q,i})).filter(x=>x.q.verdict==='unclear');
    const progress=qs.find(q=>q.point==='去分母时逐项同乘'&&q.verdict==='correct');
    const li=text=>'<li>'+esc(text)+'</li>';
    return '<div class="ds-family"><p class="muted">长沙知行学堂 · '+esc(name)+' · 七年级数学</p><h3>观察到的进步</h3><p>'+esc(progress?'11 月 4 日的第一行是 x + 1 = 12，漏乘了整数项。本卷同一知识点的作答为“'+progress.answer+'”，本次已能逐项同乘。':'本次没有与前次错误直接对应的正确作答，先记录当前表现。')+'</p><h3>本次答对</h3>'+
      (positives.length?'<ul>'+positives.map(({q,i})=>li('第 '+(i+1)+' 题 · '+q.point+'：'+q.answer)).join('')+'</ul>':'<p>本次尚未确认答对的题目。</p>')+'<h3>待订正与复测</h3>'+
      (wrong.length?'<ul>'+wrong.map(({q,i})=>li('第 '+(i+1)+' 题 · '+q.point+'：'+q.cause+' '+(q.point==='去括号法则'?'下次用一道括号前为负号的变式，逐项检查符号。':'下次用一道同考点的变式重新检验。'))).join('')+'</ul>':'<p>本卷没有已确认的错题。</p>')+
      (unclear.length?'<h3>需对照原卷再看</h3><ul>'+unclear.map(({q,i})=>li('第 '+(i+1)+' 题：'+(q.cause||'原作答待辨认'))).join('')+'</ul>':'')+'</div>';
  }
  function exam(parts){
    const id=sampleId, s=current().exam;
    const idx=Math.max(0,Math.min(3,(parseInt(parts[1],10)||1)-1)), family=parts[1]==='family', q=s.draft[idx], checked=s.draft.filter(a=>a.checked).length;
    const node=root(), section=family?'<div class="ds-review"><p>'+roleTag(s.published?'教师已确认':'反馈样例',s.published?'good':'')+'</p>'+(!s.published?'<p class="muted">以下为原样卷的反馈示例。逐题确认后的结果会写入档案。</p>':'')+familyReport(s.published||questions,id)+'</div>':
      '<div class="ds-review"><nav class="ds-qnav" aria-label="选择题目">'+s.draft.map((r,i)=>'<a href="#exam/he/'+(i+1)+'" aria-label="第 '+(i+1)+' 题'+(r.checked?'，已核对':'')+'" '+(i===idx?'aria-current="page"':'')+'>第 '+(i+1)+' 题'+(r.checked?' ✓':'')+'</a>').join('')+'</nav><p class="ds-split">'+roleTag(q.checked?'已核对':'待核对',q.checked?'good':'warm')+'<small>已核对 '+checked+' / 4 题</small></p>'+
      '<div class="ds-form" id="ds-question">'+formField('题目','stem',q.stem)+formField('卷面原作答','answer',q.answer)+formField('知识点','point',q.point,'input')+
      '<label>判断<select name="verdict">'+Object.entries(verdictNames).map(([key,label])=>'<option value="'+key+'" '+(key===q.verdict?'selected':'')+'>'+label+'</option>').join('')+'</select></label>'+formField('错因或批注','cause',q.cause)+
      '<p role="status" id="ds-ex-msg">修改会保存为本机草稿。</p><div class="ds-buttons">'+button('data-check',idx<3?'核对本题，进入下一题':'核对本题','btn')+button('data-publish '+(checked===4?'':'disabled'),'确认并更新档案','btn primary')+'</div></div></div>';
    node.innerHTML='<div class="ds">'+link('student/he/materials/7','← '+esc(who(id))+'的学习资料','ds-back')+head('七年级数学 / 试卷批阅',sampleTitle,'长沙知行学堂 · '+who(id)+'（样卷化名小满） · 2026-11-18')+
      '<div class="ds-exam-grid"><section class="card ds-paper"><div class="ds-row"><h2>试卷原件</h2><a href="'+pdf+'" target="_blank" rel="noopener">打开 PDF ↗</a></div><a href="'+pdf+'" target="_blank" rel="noopener"><img src="./materials/grade7-exam-preview.jpg" alt="一页四题的七年级数学模拟作答卷"></a></section><section class="card ds-readcard"><nav class="ds-tabs" aria-label="批阅视角"><a href="#exam/he/1" '+(!family?'aria-current="page"':'')+'>逐题批阅</a><a href="#exam/he/family" '+(family?'aria-current="page"':'')+'>家长反馈</a></nav>'+section+'</section></div></div>';
    if(family)return;
    const f=node.querySelector('#ds-question'),check=node.querySelector('[data-check]'),submit=node.querySelector('[data-publish]'),msg=node.querySelector('#ds-ex-msg'),split=node.querySelector('.ds-split');
    function sync(target){
      q[target.name]=target.value;q.checked=false;W.save();submit.disabled=true;msg.textContent='修改已保存。本题需要重新核对。';
      const n=s.draft.filter(x=>x.checked).length;split.innerHTML=roleTag('待核对','warm')+'<small>已核对 '+n+' / 4 题</small>';
      const tab=node.querySelector('.ds-qnav [aria-current]');tab.textContent='第 '+(idx+1)+' 题';tab.setAttribute('aria-label','第 '+(idx+1)+' 题');
    }
    f.oninput=e=>{if(e.target.name)sync(e.target);};
    f.onchange=e=>{if(e.target.name&&q[e.target.name]!==e.target.value)sync(e.target);};
    check.onclick=()=>{
      if(!q.stem.trim()||(q.verdict!=='unclear'&&(!q.point.trim()||!q.answer.trim()))||(q.verdict==='wrong'&&!q.cause.trim())){
        msg.textContent='请补全题目、作答和知识点。有误时请注明错因，字迹模糊可选“待辨认”。';return;
      }
      q.checked=true;W.save();if(idx<3)W.go('exam/he/'+(idx+2));else exam(parts);
    };
    submit.onclick=()=>{
      if(!s.draft.every(a=>a.checked))return;
      s.published=clone(s.draft);W.save();W.toast('已确认 4 题并更新七年级档案');W.go('student/he/overview/7');
    };
  }
  function formField(label,name,value,kind){
    return '<label>'+label+(kind==='input'?'<input name="'+name+'" value="'+esc(value)+'" maxlength="100">':'<textarea name="'+name+'" rows="2" maxlength="1500">'+esc(value)+'</textarea>')+'</label>';
  }
  function render(section,parts=[]){
    if(section==='student')archive(parts[0],parts[1],parts[2]);
    else if(section==='exam')exam(parts);
    else roster();
  }
  window.DemoDossier={render,clearAttachments};
})();

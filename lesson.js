(() => {
  'use strict';
  const lessonName = '解一元一次方程：去分母';
  const common = [
    {title:'逐项同乘', text:'解方程 x/3 + 2 = 5。写出去分母后的第一行，再求出 x。', first:'x + 6 = 15', method:'在等号两侧每一项下标出 ×3，比较整数 2 变形前后的数值。第一行是 x + 6 = 15，解得 x = 9。', why:'单独观察整数项是否同乘，让初次漏乘的学生也能指出是哪一项变了。'},
    {title:'保留整个分子', text:'解 (x + 1)/3 − (x − 2)/6 = 2。先写去分母的一行，再去括号。', first:'2(x + 1) − (x − 2) = 12', method:'先圈出两个多项式分子。两边乘 6 后保留括号，再展开为 2x + 2 − x + 2 = 12，得到 x = 8。', why:'将同乘和去括号分开，可以分辨是漏乘还是负号没有作用到括号中的每一项。'},
    {title:'选择公分母', text:'解 (2x + 1)/4 + (x − 1)/6 = 3。说明选择哪个公分母，并检查等号右边。', first:'3(2x + 1) + 2(x − 1) = 36', method:'4 和 6 的最小公倍数是 12。按 12÷4、12÷6 写出左边系数，再将右边乘 12。展开得 8x + 1 = 36，x = 35/8。', why:'让学生用各项的系数解释公分母的选择，而不是只给出一个倍数。'},
    {title:'求解后回代', text:'解 (4 − x)/2 − (2x + 1)/3 = 4，最后把解代回原式。', first:'3(4 − x) − 2(2x + 1) = 24', method:'两边乘 6 后再展开，得到 10 − 7x = 24，解得 x = −2。代回原式，左边为 3 − (−1) = 4，与右边相等。', why:'用一次独立解题同时检查第一行、变号和回代，作为课后安排的依据。'}
  ];
  const individual = {
    lin:{pre:'把 y/4 + 3 = 7 的两边同时乘 4。写出新的等式，并圈出由 3 得到的那一项。',preWhy:'先让整数项从 3 变成 12，检查每一项是否都乘了 4。',post:'解 (2t − 1)/3 + 2 = 5，写出第一行，再代回原方程。',postWhy:'撤去圈项提示，观察第一行能否主动写出 +6。'},
    he:{pre:'展开 5 − (u + 3)，再令 u = 1，比较展开前后的值。',preWhy:'先用无分母的式子检查括号前减号是否作用到两项。',post:'解 (v + 4)/2 − (v + 1)/3 = 3，分两行写出去分母和去括号的结果。',postWhy:'对照 −2(v + 1) 和 −2v − 2，定位负号在哪一步发生变化。'},
    zhou:{pre:'分别列出 4 与 6 的前三个正倍数，找出它们的最小公倍数。',preWhy:'先从倍数关系入手，再把这一方法迁移到方程中的两个分母。',post:'解 (w−1)/4 + (w+1)/6 = 3。先写出所选公分母，并用整除说明理由。',postWhy:'用两个不同分母复测选择公分母的能力，再用回代核验结果。'}
  };
  const defaults = {
    goals:'能选出公分母，用它同乘等式两边的每一项。\n能保留多项式分子的括号，独立解方程并回代检验。',
    steps:'10 分钟｜课前诊断：展示两种第一行，学生圈出存在差异的整数项。\n15 分钟｜示范同乘：在等号两侧逐项标记公分母，核对是否漏乘。\n20 分钟｜共同练习：完成含两个分母的方程，先保留分子括号，再去括号。\n15 分钟｜独立检验：把解代回原式，记录每个学生第一行以及需要复测的原因。',
    common,individual
  };
  const copy = value => JSON.parse(JSON.stringify(value));
  const notes = ['漏乘整数项','公分母选错','漏写分子括号','去括号变号错误','等号右边漏乘','其他错因'];
  const esc = v => W.esc(String(v ?? ''));
  const root = () => document.getElementById('view');
  const link = (hash,label,primary=false) => '<a class="btn'+(primary?' primary':'')+'" href="#'+hash+'">'+label+'</a>';
  const btn = (id,label,primary=false) => '<button type="button" class="btn'+(primary?' primary':'')+'" data-l="'+id+'">'+label+'</button>';
  const use = (action,fn) => root().querySelectorAll('[data-l="'+action+'"]').forEach(el=>el.addEventListener('click',fn));
  const val = id => document.getElementById(id);
  const lines = str => String(str||'').split('\n').filter(s=>s.trim()).map(s=>'<li>'+esc(s)+'</li>').join('');
  const options = sel => W.students.map(s=>'<option value="'+esc(s.id)+'"'+(sel===s.id?' selected':'')+'>'+esc(s.name)+'</option>').join('');
  function state(){
    const s=W.state.lesson ||= {};
    s.draft ||= copy(defaults); s.packet ||= copy(defaults); s.phase ||= 'ready';
    if(s.confirmed===undefined)s.confirmed=true;
    s.feedbackByStudent ||= {};s.feedbackDrafts ||= {};s.observations ||= {};
    for(const p of W.students) s.observations[p.id] ||= [];
    s.student ||= W.students[0].id; s.index ||= 0;
    return s;
  }
  const person = s => W.students.find(p=>p.id===s.student)||W.students[0];
  const selectedPacket = s => s.roomPacket || s.packet;
  function title(kicker,heading,desc,actions=''){
    return '<div class="lp-head"><div><div class="eyebrow">'+kicker+'</div><h1>'+heading+'</h1><p class="muted">'+desc+'</p></div><div class="buttons">'+actions+'</div></div>';
  }
  function draftEdited(s){s.confirmed=false;W.save();}
  function studentPicker(s,label){return '<label class="lp-picker">'+label+'<select data-pupil>'+options(s.student)+'</select></label>';}
  function pickStudent(s,show){
    root().querySelectorAll('[data-pupil]').forEach(sel=>{sel.onchange=()=>{s.student=sel.value;W.save();show();};});
  }
  function editFields(titleText,fields,onSave){
    W.modal(titleText,'<form id="lp-editor" class="lp-form">'+fields.map(([key,label,value])=>'<label>'+label+'<textarea name="'+key+'" rows="3" maxlength="3000" required>'+esc(value)+'</textarea></label>').join('')+'<div class="buttons"><button type="button" class="btn" data-cancel>取消</button><button class="btn primary">保存修改</button></div></form>');
    const form=val('lp-editor');form.querySelector('[data-cancel]').onclick=()=>W.closeModal();
    form.onsubmit=e=>{e.preventDefault();const result={};for(const [key] of fields){const elem=form.elements.namedItem(key);if(!elem.value.trim()){elem.focus();return;}result[key]=elem.value.trim();} W.closeModal();onSave(result);};
  }
  function previewSheet(p,s,packet){
    const i=packet.individual[p.id];
    const row=(label,text,why)=>'<section><h3>'+label+'</h3><p>'+esc(text)+'</p><p class="lp-why"><b>选择原因</b> '+esc(why)+'</p></section>';
    return '<div class="lp-sheet"><div class="eyebrow">长沙知行学堂 · 家长视角</div><h2>'+esc(p.name)+'的第 9 讲</h2>'+row('课前个性题',i.pre,i.preWhy)+'<section><h3>课中共同题与讲解</h3>'+packet.common.map((q,j)=>'<div class="lp-mini"><b>'+String(j+1).padStart(2,'0')+'　'+esc(q.text)+'</b><p>'+esc(q.method)+'</p><p class="lp-why">'+esc(q.why)+'</p></div>').join('')+'</section>'+row('课后个性题',i.post,i.postWhy)+'</div>';
  }
  function printSheet(s,all){
    const packet=s.packet,pupils=all?W.students:[person(s)];
    val('lp-printout')?.remove();const holder=document.createElement('div');holder.id='lp-printout';
    holder.innerHTML=pupils.map(p=>{
      const practice=packet.individual[p.id];
      const exercise=(label,text)=>'<section><h3>'+label+'</h3><p>'+esc(text)+'</p><div class="lp-writing"></div></section>';
      return '<article><p>长沙知行学堂　七年级数学　课堂练习单</p><h1>第 9 讲 · '+lessonName+'</h1><p>姓名　'+esc(p.name)+'</p>'+exercise('课前 · 个性练习',practice.pre)+packet.common.map((q,i)=>exercise('课中 · 共同题 '+(i+1),q.text)).join('')+exercise('课后 · 个性练习',practice.post)+'</article>';
    }).join('');
    document.body.append(holder);window.addEventListener('afterprint',()=>holder.remove(),{once:true});window.print();
  }
  function prep(s,parts){
    const page=['plan','packet','parent'].includes(parts[0])?parts[0]:'plan';const d=s.draft,p=person(s);
    let body='';
    if(page==='plan')body='<div class="lp-cols"><section class="card lp-panel"><div class="lp-section"><h2>本讲目标</h2>'+btn('edit-plan','编辑目标与步骤')+'</div><ol class="lp-goals">'+lines(d.goals)+'</ol><h2>教学步骤</h2><ol class="lp-steps">'+lines(d.steps)+'</ol><div class="buttons">'+link('prep/packet','查看教学题包 →',true)+'</div></section><aside class="card lp-panel"><div class="eyebrow">课堂板书 · 课件预览</div><h2>让整数项也乘上公分母</h2><div class="lp-board"><span>原方程</span><b>x/3 + 2 = 5</b><span>两边每一项都乘 3</span><b>x + 6 = 15</b></div><p>先让全班说出 2 为什么变成 6，再对照个人课前练习。</p></aside></div>';
    if(page==='packet')body='<div class="lp-cols"><section class="card lp-panel"><h2>全班共同题</h2>'+d.common.map((q,i)=>'<article class="lp-item"><div class="lp-section"><span class="lp-number">0'+(i+1)+' / '+esc(q.title)+'</span>'+btn('cq-'+i,'编辑')+'</div><h3>'+esc(q.text)+'</h3><p>'+esc(q.method)+'</p><p class="lp-why"><b>选择原因</b> '+esc(q.why)+'</p></article>').join('')+'</section><aside class="card lp-panel"><div class="lp-section"><h2>个人练习</h2>'+studentPicker(s,'学生')+'</div>'+['pre','post'].map((phase,i)=>'<article class="lp-item"><div class="lp-section"><h3>'+(i?'课后':'课前')+'个性题</h3>'+btn('edit-'+phase,'修改题目')+'</div><p>'+esc(d.individual[p.id][phase])+'</p><p class="lp-why"><b>选择原因</b> '+esc(d.individual[p.id][phase+'Why'])+'</p></article>').join('')+'<div class="buttons">' +btn('variant','生成模拟变式')+link('prep/parent','家长预览')+'</div></aside></div>';
    if(page==='parent')body='<div class="lp-cols"><section class="card lp-panel">'+studentPicker(s,'预览学生')+previewSheet(p,s,d)+'</section><aside class="card lp-panel"><h2>打印练习单</h2><p>每名学生一份，包含本人的课前题、全班共同题和本人的课后题，留有书写空间。</p><p class="muted">'+(s.confirmed?'可在系统打印窗口中选择打印或存储为 PDF。':'请先确认最新题包，再打印练习单。')+'</p><div class="buttons">'+(s.confirmed?btn('print-one','打印个人练习单',true)+btn('print-all','打印全班练习单'):btn('confirm','确认题包',true))+'</div></aside></div>';
    root().innerHTML='<div class="lp">'+title('七年级数学 / 第 9 讲备课',lessonName,'班课 · 陈老师 · 60 分钟',link('session/eq9','课次全流程')+link('classroom','进入授课',true))+'<div class="lp-strip"><span class="pill">'+(s.confirmed?'题包已确认':'题包有待确认修改')+'</span><span>4 道共同题 · '+W.students.length+' 份个性练习</span><div class="buttons">'+(!s.confirmed?btn('confirm','确认题包',true):'')+'</div></div><nav class="lp-tabs">'+[['plan','教学设计'],['packet','教学题包'],['parent','家长预览与打印']].map(([key,t])=>'<a href="#prep/'+key+'" '+(key===page?'aria-current="page"':'')+'>'+t+'</a>').join('')+'</nav>'+body+'</div>';
    const again=()=>prep(s,[page]);
    use('edit-plan',()=>editFields('编辑教学设计',[['goals','本讲目标（每行一项）',d.goals],['steps','教学步骤（每行一步）',d.steps]],res=>{Object.assign(d,res);draftEdited(s);again();}));
    d.common.forEach((q,i)=>use('cq-'+i,()=>editFields('编辑共同题 '+(i+1),[['text','题目',q.text],['first','参考第一行',q.first],['method','讲解方案',q.method],['why','选择原因',q.why]],res=>{Object.assign(q,res);draftEdited(s);again();})));
    ['pre','post'].forEach(key=>use('edit-'+key,()=>{const form=d.individual[p.id];editFields(p.name+' · '+(key==='pre'?'课前':'课后')+'个性题',[['text','题目',form[key]],['why','选择原因',form[key+'Why']]],res=>{form[key]=res.text;form[key+'Why']=res.why;draftEdited(s);again();});}));
    use('variant',()=>{
      W.modal('为'+p.name+'生成练习变式','<form class="lp-form" id="lp-variant"><label>练习阶段<select name="part"><option value="pre">课前</option><option value="post" selected>课后</option></select></label><label>本次调整重点<select name="focus"><option value="sign">括号与变号</option><option value="integer">整数项同乘</option><option value="multiple">选择公分母</option></select></label><p class="muted">使用本机模拟题库生成，随后仍可修改题目和理由。</p><button class="btn primary">生成并加入草稿</button></form>');
      const form=val('lp-variant');form.elements.namedItem('focus').value={he:'sign',lin:'integer',zhou:'multiple'}[p.id];
      const variants={
        sign:{pre:'展开 8 − (3a − 2)，并代入 a = 1 检查两式的值是否相同。',post:'解 (a + 3)/2 − (2a − 1)/3 = 2；保留括号写第一行，再单独写出去括号的一行。',why:'将括号前负号作用于每一项，便于检查后一项是否变号。'},
        integer:{pre:'两边同乘 5，写出 b/5 + 1 = 4 的下一行，并标出整数 1 的变化。',post:'解 (2b + 1)/5 − 2 = 1，圈出同乘后由 −2 变成的项，再代回检验。',why:'用新的整数项检查公分母是否乘到了等式两边的每一项。'},
        multiple:{pre:'分别列出 6 与 8 的公倍数，写出最小的正公倍数，并说明依据。',post:'解 (c+1)/6 + (c−2)/8 = 2。先写出两分母的最小公倍数及变形后的系数。',why:'从新的两个分母出发，检验能否先确定公分母，再完成同乘。'}
      };
      form.onsubmit=e=>{e.preventDefault();const key=form.elements.namedItem('part').value,variant=variants[form.elements.namedItem('focus').value];
        d.individual[p.id][key]=variant[key];d.individual[p.id][key+'Why']=variant.why;W.closeModal();draftEdited(s);again();W.toast('模拟变式已加入此学生的题包草稿');};
    });
    use('confirm',()=>{s.packet=copy(d);s.confirmed=true;W.save();again();W.toast('题包已确认，可预览和打印');});
    use('print-one',()=>printSheet(s,false));use('print-all',()=>printSheet(s,true));pickStudent(s,again);
  }
  function liveView(s,mode){
    const room=selectedPacket(s), all=room.common, idx=Math.min(s.index,all.length-1), q=all[idx], p=person(s);
    const response=(student)=>s.observations[student.id].find(o=>o.index===idx);
    const count=W.students.filter(student=>response(student)).length;
    const selectQ=(j)=>{s.index=j;s.reveal=false;W.save();liveView(s,mode);};
    const nav='<div class="lp-pager">'+all.map((_,i)=>'<button class="lp-dot" type="button" data-q="'+i+'" aria-pressed="'+(idx===i)+'">第 '+(i+1)+' 题</button>').join('')+'</div>';
    const controls='<div class="lp-controls"><button class="btn" data-l="prev" '+(idx===0?'disabled':'')+'>← 上一题</button>'+btn('reveal',s.reveal?'收起讲解':'显示讲解')+'<button class="btn primary" data-l="next" '+(idx===all.length-1?'disabled':'')+'>下一题 →</button></div>';
    const board='<div class="lp-slide '+(mode==='project'?'lp-screen':'')+'"><div class="lp-slide-label">共同题 '+String(idx+1).padStart(2,'0')+' / '+String(all.length).padStart(2,'0')+'</div><h2>'+esc(q.text)+'</h2>'+(s.reveal?'<div class="lp-solution"><small>参考第一行</small><strong>'+esc(q.first)+'</strong><p>'+esc(q.method)+'</p></div>':'')+'</div>';
    if(mode==='project'){
      root().innerHTML='<section class="lp lp-project"><div class="lp-section"><div class="eyebrow">第 9 讲 · 课堂投屏</div><div class="buttons">'+btn('fullscreen','全屏')+'<a class="btn" href="#project" target="_blank" rel="noopener">独立投屏窗口 ↗</a>'+link('classroom','返回授课')+'</div></div>'+board+controls+nav+'</section>';
      use('fullscreen',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(root().requestFullscreen)await root().requestFullscreen();else W.toast('当前浏览器支持直接横屏查看');}catch{W.toast('可使用浏览器全屏查看');}});
    }else if(mode==='record'){
      const o=response(p),ended=s.phase==='ended';
      root().innerHTML='<div class="lp lp-record">'+title('七年级数学 / 第 9 讲','学生作答记录','逐人核对去分母后的第一行。',link('classroom','返回课堂'))+nav+'<section class="card lp-panel">'+studentPicker(s,'选择学生')+'<h2>'+esc(q.text)+'</h2><p class="lp-why"><b>参考第一行</b> '+esc(q.first)+'</p><form id="lp-observe" class="lp-form"><label>学生写的第一行<input name="first" maxlength="300" required placeholder="例如：x + 2 = 15" value="'+esc(o?.firstLine)+'"></label><fieldset><legend>判断</legend><label><input type="radio" name="verdict" value="correct" required '+(o?.verdict==='correct'?'checked':'')+'> 正确</label><label><input type="radio" name="verdict" value="wrong" required '+(o?.verdict==='wrong'?'checked':'')+'> 有误</label></fieldset><label data-reason>实际错因<select name="cause"><option value="">选择错因</option>'+notes.map(t=>'<option '+(o?.reason===t?'selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label><label data-other>补充具体错因<input name="other" maxlength="200" value="'+esc(o?.reason==='其他错因'?o.cause:'')+'"></label><button class="btn primary" '+(ended?'disabled':'')+'>'+(ended?'本讲已结束':'保存本题作答')+'</button></form></section>'+link('classroom','回到全班记录')+'</div>';
      const form=val('lp-observe'),why=form.querySelector('[name="cause"]'),other=form.querySelector('[name="other"]');
      function conditional(){const wrong=form.querySelector('input[name=verdict]:checked')?.value==='wrong';form.querySelector('[data-reason]').hidden=!wrong;why.required=wrong;form.querySelector('[data-other]').hidden=!(wrong&&why.value==='其他错因');other.required=wrong&&why.value==='其他错因';}
      form.onchange=conditional;conditional();
      form.onsubmit=e=>{e.preventDefault();if(ended)return;const f=form.elements,first=f.namedItem('first').value.trim(),verdict=form.querySelector('input[name=verdict]:checked')?.value;if(!first||!verdict)return;const cause=verdict==='wrong'?(why.value==='其他错因'?other.value.trim():why.value):'';if(verdict==='wrong'&&!cause)return;
        const entry={index:idx,question:q.text,firstLine:first,verdict,cause,reason:verdict==='wrong'?why.value:''};const at=s.observations[p.id].findIndex(item=>item.index===idx);
        if(at<0)s.observations[p.id].push(entry);else s.observations[p.id][at]=entry;
        delete s.feedbackDrafts[p.id];delete s.feedbackByStudent[p.id];W.save();W.toast('已记录'+p.name+'的第 '+(idx+1)+' 题');W.go('classroom');};
      pickStudent(s,()=>liveView(s,mode));
    }else{
      root().innerHTML='<div class="lp">'+title('七年级数学 / 第 9 讲授课',lessonName,(s.phase==='ended'?'已下课 · 课堂回顾':'上课中 · 逐题讲解与观察')+' · 陈老师',link('session/eq9','课次全流程')+link('prep','查看备课')+link('project','打开投屏',true))+
        (!s.confirmed||JSON.stringify(s.packet)!==JSON.stringify(room)?'<p class="lp-why">本次课堂使用开课时已确认的题包。你可以在备课页面查看后续修改。</p>':'')+
        '<div class="lp-live-grid"><section class="card lp-panel">'+nav+board+controls+'</section><aside class="card lp-panel"><div class="lp-section"><h2>本题学生记录</h2><span class="pill">'+count+' / '+W.students.length+'</span></div><p class="muted">选择学生，记下实际写出的第一行和错因。</p>'+W.students.map(st=>{const o=response(st);return '<button type="button" data-person="'+esc(st.id)+'" class="lp-roll"><strong>'+esc(st.name)+'</strong><span>'+(o?o.verdict==='correct'?'第一行正确':'有误 · '+esc(o.cause):'待记录')+' ›</span></button>';}).join('')+'<div class="buttons">'+(s.phase==='ended'?link('feedback','课后题与反馈',true):btn('finish','下课并准备反馈',true))+'</div></aside></div></div>';
      root().querySelectorAll('[data-person]').forEach(el=>el.onclick=()=>{s.student=el.dataset.person;W.save();W.go('record');});
      use('finish',()=>{const total=W.students.reduce((n,p)=>n+s.observations[p.id].length,0);W.modal('结束第 9 讲','<p>已记录 '+total+' 条课堂作答。课后题和反馈将根据每个学生的实际记录生成，未记录的学生保留原复测计划。</p><div class="buttons">'+btn('stay','继续记录')+btn('end','确认下课',true)+'</div>');
        document.querySelector('[data-l=stay]').onclick=()=>W.closeModal();document.querySelector('[data-l=end]').onclick=()=>{s.phase='ended';W.save();W.closeModal();W.go('feedback');};});
    }
    root().querySelectorAll('[data-q]').forEach(el=>el.onclick=()=>selectQ(Number(el.dataset.q)));
    use('prev',()=>{if(idx>0)selectQ(idx-1);});use('next',()=>{if(idx<all.length-1)selectQ(idx+1);});
    use('reveal',()=>{s.reveal=!s.reveal;W.save();liveView(s,mode);});
  }
  const retests={
    '漏乘整数项':'解 y/4 + 3 = 8，先圈出 3，再写两边同乘 4 后的完整等式。检查第一行的整数项。',
    '等号右边漏乘':'解 y/3 + 1 = 7，分别写出等号两边每一项同乘 3 的结果，再求解。',
    '公分母选错':'找出 4 和 6 的最小公倍数，再写出 (y+1)/4 + (y−1)/6 = 2 的第一行；核对两分母是否都已消去。',
    '漏写分子括号':'解 (y+2)/3 − (y−1)/6 = 3。先圈出两个分子，写出保留括号的第一行，再展开。',
    '去括号变号错误':'解 (y+5)/2 − (y+1)/3 = 4。单独写出 −2(y+1) 展开后的式子，并逐项检查符号。'
  };
  function generate(s,p){
    const observations=s.observations[p.id], lastWrong=observations.filter(o=>o.verdict==='wrong').at(-1);
    if(lastWrong)return {text:p.name+'在本讲第 '+(lastWrong.index+1)+' 题的第一行写出“'+lastWrong.firstLine+'”。老师记录的错因为“'+lastWrong.cause+'”。下次复测先独立写第一行，再逐项核对。',practice:retests[lastWrong.cause]||'重做第 '+(lastWrong.index+1)+' 题：'+lastWrong.question+' 对照“'+lastWrong.cause+'”重新写出第一行，并解释每一项的变化。'};
    const last=observations.at(-1), next=selectedPacket(s).individual[p.id].post;
    return {text:last?p.name+'在第 '+(last.index+1)+' 题写出“'+last.firstLine+'”，本次第一行经老师核对正确。下次用一道变式检查能否独立迁移。':'本节课还没有'+p.name+'的逐题课堂记录。沿用本讲原复测计划，下次收集第一行后再判断掌握情况。',practice:next};
  }
  function feedback(s){
    if(s.phase!=='ended'){
      root().innerHTML='<div class="lp">'+title('七年级数学 / 第 9 讲','课后题与家长反馈','本讲结束后，可按学生作答生成并确认反馈。',link('session/eq9','课次全流程')+link('classroom',s.phase==='live'?'继续课堂记录':'进入课堂',true))+'</div>';
      return;
    }
    const p=person(s), obs=s.observations[p.id],published=s.feedbackByStudent[p.id],data=s.feedbackDrafts[p.id] || published;
    root().innerHTML='<div class="lp">'+title('七年级数学 / 第 9 讲','课后题与家长反馈','模拟生成会读取本机保存的课堂记录，老师确认后写入学生档案。',link('session/eq9','课次全流程')+link('classroom','课堂回顾'))+'<div class="lp-cols"><section class="card lp-panel"><div class="lp-section"><h2>课堂依据</h2>'+studentPicker(s,'学生')+'</div>'+(obs.length?obs.map(o=>'<article class="lp-item"><small>第 '+(o.index+1)+' 题 · '+(o.verdict==='correct'?'正确':'有误')+'</small><h3>'+esc(o.firstLine)+'</h3><p>'+esc(o.cause||'第一行已核对正确。')+'</p></article>').join(''):'<p class="lp-why">尚无该学生的课堂记录。</p>')+'</section><section class="card lp-panel"><div class="lp-section"><h2>个性复测与反馈</h2><span class="pill">'+(s.feedbackDrafts[p.id]?'待确认':published?'已确认':'待生成')+'</span></div><div class="buttons">'+btn('generate',data?'根据记录重新生成':'生成模拟建议',!data)+'</div>'+(data?'<form id="lp-feedback" class="lp-form"><label>调整后的课后题<textarea name="practice" required maxlength="3000">'+esc(data.practice)+'</textarea></label><label>给家长的反馈<textarea name="text" required maxlength="3000">'+esc(data.text)+'</textarea></label><div class="buttons"><button class="btn primary">确认并写入档案</button></div></form>':'<p class="muted">生成后可修改课后题与反馈用语。</p>')+'</section></div></div>';
    pickStudent(s,()=>feedback(s));
    use('generate',()=>{s.feedbackDrafts[p.id]=generate(s,p);W.save();feedback(s);});
    const f=val('lp-feedback');
    if(f){const fields=()=>({practice:f.elements.namedItem('practice').value.trim(),text:f.elements.namedItem('text').value.trim()});
      f.oninput=()=>{s.feedbackDrafts[p.id]=fields();f.closest('section').querySelector('.pill').textContent='待确认';W.save();};
      f.onsubmit=e=>{e.preventDefault();const v=fields();if(!v.practice||!v.text)return;s.feedbackByStudent[p.id]={...v,confirmed:true};delete s.feedbackDrafts[p.id];W.save();feedback(s);W.toast('已写入'+p.name+'的档案');};}
  }
  function render(section,parts=[]){
    const s=state();
    if(section==='prep'){prep(s,parts);return;}
    if(section==='feedback'){feedback(s);return;}
    if(!s.roomPacket){s.roomPacket=copy(s.packet);s.phase='live';W.save();}
    liveView(s,section);
  }
  function previewPlan() {
    const s = state();
    const p = selectedPacket(s);
    const questions = p.common.map((question, i) => '<article class="lp-item"><small>共同题 ' + (i + 1) +
      '</small><h3>' + esc(question.text) + '</h3><p>' + esc(question.method) + '</p><p class="lp-why">' +
      esc(question.why) + '</p></article>').join('');
    root().innerHTML = '<div class="lp">' + title('七年级方程班 · 陈老师', lessonName,
      '本机构备课预览 · 由任课老师维护', link('session/eq9', '课次全流程')) +
      '<div class="lp-cols"><section class="card lp-panel"><h2>本讲目标</h2><ol class="lp-goals">' + lines(p.goals) +
      '</ol><h2>教学步骤</h2><ol class="lp-steps">' + lines(p.steps) + '</ol></section>' +
      '<section class="card lp-panel"><h2>已确认的全班共同题</h2>' + questions + '</section></div></div>';
  }
  window.DemoLesson={render, previewPlan};
})();

(() => {
  'use strict';

  const teachers = [
    {id:'chen', name:'陈老师', course:'七年级方程班', rate:26000},
    {id:'sun', name:'孙老师', course:'七年级基础班', rate:22000},
    {id:'zhou', name:'周老师', course:'八年级几何班', rate:30000}
  ];
  const units = {
    chen:[
      ['2026-09-09','用字母表示数'],['2026-09-16','方程与等式'],
      ['2026-10-14','认识一元一次方程'],['2026-10-21','检验方程的解'],['2026-10-28','等式的变形'],
      ['2026-11-04','等式的性质'],['2026-11-11','移项与合并同类项']
    ],
    sun:[
      ['2026-09-05','有理数的意义'],['2026-09-12','数轴与绝对值'],
      ['2026-10-10','用数轴比较大小'],['2026-10-17','有理数加减法'],
      ['2026-11-07','整式的加减'],['2026-11-14','去括号法则']
    ],
    zhou:[
      ['2026-09-06','三角形的三边'],['2026-09-13','三角形的内角'],
      ['2026-10-11','三角形的外角'],['2026-10-18','对应边与对应角'],
      ['2026-11-08','全等三角形'],['2026-11-15','角平分线的性质']
    ]
  };
  const statuses = {none:'待编制',pending:'待本人核对',checked:'已核对 · 待结算',settled:'已结算'};
  const money = cents => '¥'+(cents/100).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});
  const esc = value => W.esc(String(value ?? ''));
  const sortedLast = array => [...array].sort().at(-1);
  const actor = () => W.state.role === 'admin' ? 'chen' : 'sun';
  const isAdmin = () => W.state.role === 'admin';
  function unitRows(id,month) {
    const candidates=units[id].filter(([date])=>date.slice(0,7)===month);
    if(id==='chen' && month==='2026-11' && W.state.lesson?.phase==='ended'){
      candidates.push(['2026-11-18','第 9 讲 · 解一元一次方程：去分母']);
    }
    return candidates;
  }
  const payTotal = st => st ? st.dates.length*st.rule.rate : 0;
  const ledgerKey = (id,month) => id+'/'+month;
  const monthOK = month => /^20\d\d-(0[1-9]|1[0-2])$/.test(month);
  const validDate = date => /^20\d\d-\d\d-\d\d$/.test(date) && Number.isFinite(Date.parse(date+'T12:00:00Z')) && new Date(date+'T12:00:00Z').toISOString().slice(0,10)===date;
  const fmtMonth = month => Number(month.slice(0,4))+' 年 '+Number(month.slice(5))+' 月';
  const today = () => sortedLast(['2026-11-19',new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date())]);
  function shifted(month,change) {
    const [y,m]=month.split('-').map(Number);
    const next=new Date(Date.UTC(y,m-1+change,1)).toISOString().slice(0,7);
    return monthOK(next)?next:month;
  }
  function ruleFor(pay,id,month) {
    return pay.rules[id].filter(r=>r.from<=month).sort((a,b)=>b.from.localeCompare(a.from)||b.version-a.version)[0]||null;
  }
  function newStatement(rule,dates) {
    return {rule:{...rule},dates:[...dates],status:'pending',version:1};
  }
  function getPay() {
    if(W.state.pay?.rules && W.state.pay?.books)return W.state.pay;
    const p={month:'2026-11',filter:'',selected:'chen',rules:{},books:{}};
    for(const t of teachers){
      const rule={version:1,from:'2026-09',rate:t.rate,note:'按已完成并纳入结算的授课课次计算。',by:'陈老师',at:'2026-09-01'};
      p.rules[t.id]=[rule];
      for(const month of ['2026-10','2026-11']){
        const st=newStatement(rule,units[t.id].filter(([date])=>date.startsWith(month)).map(u=>u[0]));
        if(month==='2026-10'||t.id==='zhou'){
          st.status='checked';
          st.check={by:t.name,at:month==='2026-10'?'2026-10-30':'2026-11-17'};
        }
        if(month==='2026-10'){
          st.status='settled';
          st.payment={by:'陈老师',at:'2026-10-31',amount:payTotal(st),note:'10 月教学课酬模拟登记'};
        }
        p.books[ledgerKey(t.id,month)]=st;
      }
    }
    W.state.pay=p;
    W.save();
    return p;
  }
  function snapshot(pay,t,month) {
    return {t,month,rule:ruleFor(pay,t.id,month),history:pay.rules[t.id],st:pay.books[ledgerKey(t.id,month)],units:unitRows(t.id,month)};
  }
  function visibleTeacher(pay) {
    if(!isAdmin())return teachers[1];
    return teachers.find(t=>t.id===(pay.filter||pay.selected))||teachers[0];
  }
  function action(key,label,primary=false) {
    return '<button type="button" data-pay-action="'+key+'" class="btn'+(primary?' primary':'')+'">'+label+'</button>';
  }
  function badge(status) {
    return '<span class="pay-badge pay-status-'+status+'">'+statuses[status]+'</span>';
  }
  function breakdown(row) {
    const {t,st}=row;
    const rows=st?row.units.filter(([d])=>st.dates.includes(d)):row.units;
    if(!rows.length)return '<p class="pay-empty">该教师本月暂无已完成的模拟课次。</p>';
    return '<div class="pay-scroll"><table class="pay-detail-table"><caption class="pay-sr">计费课次明细</caption><thead><tr><th>授课日期</th><th>班级与课次</th><th>计费单价</th></tr></thead><tbody>'+rows.map(([date,title])=>'<tr><td>'+esc(date)+'</td><td><strong>'+esc(title)+'</strong><small>'+t.course+'</small></td><td>'+((st?.rule||row.rule)?money((st?.rule||row.rule).rate):'—')+'</td></tr>').join('')+'</tbody></table></div>';
  }
  function cardDetail(row) {
    const {t,st,rule,history}=row;
    const actions=[];
    if(isAdmin() && (st?.status==='pending'||!st) && row.units.length && (rule||st))actions.push(action('units',st?'调整计费课次':'编制月结单'));
    if(st?.status==='pending' && t.id===actor())actions.push(action('check','本人核对课酬',true));
    if(isAdmin() && st?.status==='checked')actions.push(action('settle','登记模拟结算',true));
    const audit=[st?.check ? '本人核对 · '+esc(st.check.by)+' · '+esc(st.check.at) : '',st?.payment?'结算登记 · '+esc(st.payment.by)+' · '+esc(st.payment.at)+' · '+money(st.payment.amount)+(st.payment.note?' · '+esc(st.payment.note):''):''].filter(Boolean);
    return '<section class="card pay-detail"><header><div><span class="eyebrow">月结单明细</span><h2>'+t.name+' <small> / '+esc(row.month)+'</small></h2></div><div class="buttons">'+actions.join('')+'</div></header>'+
      (st?'<div class="pay-equation"><span>本单计费</span><strong>'+st.dates.length+' 课次 × '+money(st.rule.rate)+' = '+money(payTotal(st))+'</strong><small>采用规则 V'+st.rule.version+' · '+esc(st.rule.from)+' 起生效</small></div>':'<p class="pay-empty">尚未编制月结单。可按本月已完成课次和生效规则建单。</p>')+
      breakdown(row)+(audit.length?'<ul class="pay-audit">'+audit.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'')+
      '<div class="pay-rule"><div class="pay-rule-head"><h3>本月适用的课酬规则</h3>'+(isAdmin()?action('rule','编辑课酬规则'):'<span class="pay-dim">仅管理员可编辑</span>')+'</div>'+
      (rule?'<p><b>'+money(rule.rate)+'</b> / 已授课课次 · '+esc(rule.from)+' 起生效</p><div class="pay-dim">'+esc(rule.note)+'</div>':'<p class="pay-dim">该月份尚无生效规则。</p>')+
      '<details><summary>查看规则变更记录（'+history.length+'）</summary><ol class="pay-history">'+[...history].reverse().map(r=>'<li><strong>V'+r.version+' · '+esc(r.from)+' 起 · '+money(r.rate)+' / 课次</strong><span>'+esc(r.by)+' · '+esc(r.at)+'</span>'+(r.note?'<p>'+esc(r.note)+'</p>':'')+'</li>').join('')+'</ol></details></div></section>';
  }
  function parseRate(value){
    const amount=value.trim();
    if(!/^(?:0|[1-9]\d{0,5})(?:\.\d{1,2})?$/.test(amount))throw Error('单价应为大于零的金额，最多保留两位小数。');
    const [integer,fraction='']=amount.split('.');
    const cents=Number(integer)*100+Number(fraction.padEnd(2,'0'));
    if(!cents)throw Error('单价应大于零。');
    return cents;
  }
  function modalFor(type,pay,row) {
    const {t,st,month,rule}=row;
    if(type==='check'?(actor()!==t.id||st?.status!=='pending'):!isAdmin())return;
    if(type==='settle'&&st?.status!=='checked')return;
    if(type==='units'&&(st&&st.status!=='pending'||!row.units.length||!st&&!rule))return;
    const used=st?.rule||rule, oldVersion=st?.version||0, oldRuleVersion=pay.rules[t.id].at(-1).version, openRole=W.state.role;
    const modes={
      rule:['编辑课酬规则','保存规则'],
      units:[st?'调整计费课次':'编制月结单',st?'保存已选课次':'生成月结单'],
      check:['本人核对课酬','确认本人已核对'],
      settle:['登记模拟结算','确认登记']
    };
    if(!modes[type])return;
    const field=(name,label,body)=>'<label class="pay-field"><span>'+label+'</span>'+body+'</label>';
    let content='';
    if(type==='rule')content=field('from','生效月份','<input type="month" name="from" value="'+esc(month)+'" required min="2000-01" max="2099-12">')+field('rate','每个授课课次的单价（元）','<input name="rate" type="text" inputmode="decimal" required value="'+(rule?(rule.rate/100).toFixed(2):'')+'">')+field('note','计费说明','<textarea name="note" rows="2" maxlength="180">'+esc(rule?.note||'')+'</textarea>')+'<p class="pay-dim">新规则适用于生效月份起新编制的课酬单。已有单据沿用建单时的单价。</p>';
    if(type==='units')content='<fieldset class="pay-unit-choices"><legend>纳入本单的实际授课课次</legend>'+row.units.map(([date,title])=>'<label><input type="checkbox" name="units" value="'+date+'"'+(!st||st.dates.includes(date)?' checked':'')+'/><span><strong>'+esc(title)+'</strong><small>'+date+' · '+t.course+'</small></span></label>').join('')+'</fieldset><p class="pay-equation" data-pay-estimate></p>';
    if(type==='check')content=breakdown(row)+'<p class="pay-equation">本单 '+st.dates.length+' 课次，合计 '+money(payTotal(st))+'。确认后交由管理员登记结算。</p>';
    if(type==='settle')content='<p class="pay-equation">本人已核对 '+st.dates.length+' 课次，金额 '+money(payTotal(st))+'。</p>'+field('at','模拟结算日期','<input type="date" name="at" value="'+today()+'" min="'+sortedLast(st.dates)+'" max="'+today()+'" required>')+field('note','登记备注（选填）','<input name="note" maxlength="160" placeholder="例如 11 月授课课酬">');
    const html='<form id="pay-dialog-form" class="pay-form" novalidate><div class="pay-context">'+t.name+' · '+esc(month)+'</div>'+content+'<p role="alert" class="pay-error"></p><div class="buttons"><button type="button" class="btn" data-pay-cancel>取消</button><button type="submit" class="btn primary">'+modes[type][1]+'</button></div></form>';
    W.modal(modes[type][0],html);
    const form=document.getElementById('pay-dialog-form');
    if(!form)return;
    const input=name=>form.querySelector('[name="'+name+'"]');
    const checked=()=>Array.from(form.querySelectorAll('[name="units"]')).filter(el=>el.checked).map(el=>el.value);
    if(type==='units'){
      const estimate=()=>{const count=checked().length;form.querySelector('[data-pay-estimate]').textContent='已选 '+count+' 课次 × '+money(used.rate)+' = '+money(used.rate*count);};
      form.addEventListener('change',estimate);estimate();
    }
    form.querySelector('[data-pay-cancel]').onclick=()=>W.closeModal();
    form.onsubmit=ev=>{
      ev.preventDefault();
      const error=form.querySelector('.pay-error');
      try{
        if(W.state.role!==openRole || (type==='check'?actor()!==t.id:!isAdmin()))throw Error('身份已切换，请重新打开月结单。');
        const fresh=getPay(),key=ledgerKey(t.id,month),current=fresh.books[key],versions=fresh.rules[t.id];
        const stale=()=>{throw Error('该记录已更新，请重新打开后核对。');};
        if(type==='rule'){
          if(versions.at(-1).version!==oldRuleVersion)stale();
          const from=input('from').value;
          if(!monthOK(from))throw Error('请选择有效生效月份。');
          const cents=parseRate(input('rate').value);
          versions.push({version:oldRuleVersion+1,from,rate:cents,note:input('note').value.trim().slice(0,180),by:'陈老师',at:today()});
        }else{
          if((current?.version||0)!==oldVersion)stale();
          if(type==='units'){
            if(current?.status==='checked'||current?.status==='settled'||!current&&versions.at(-1).version!==oldRuleVersion)stale();
            const available=new Set(row.units.map(x=>x[0]));
            const dates=checked().filter(d=>available.has(d));
            if(!dates.length)throw Error('请至少选择一个授课课次。');
            if(current){current.dates=dates;current.version++;}
            else fresh.books[key]=newStatement(used,dates);
          }else if(type==='check'){
            if(current?.status!=='pending')stale();
            current.status='checked';current.version++;current.check={at:today(),by:t.name};
          }else{
            if(current?.status!=='checked')stale();
            const at=input('at').value;
            if(!validDate(at)||at<sortedLast(current.dates)||at>today()||at<current.check.at)throw Error('结算日期应在本人核对之后（含当日），且不能晚于今天。');
            current.status='settled';current.version++;current.payment={at,amount:payTotal(current),by:'陈老师',note:input('note').value.trim().slice(0,160)};
          }
        }
        W.save();W.closeModal();W.toast({rule:'课酬规则已保存',units:'已更新本月计费课次',check:'本人核对已记录',settle:'模拟结算已登记'}[type]);render('pay');
      }catch(err){error.textContent=err.message;}
    };
  }
  function render(section) {
    if(section!=='pay')return;
    const root=document.getElementById('view'),pay=getPay(),admin=isAdmin();
    const month=monthOK(pay.month)?pay.month:'2026-11';
    const t=visibleTeacher(pay);
    const list=(admin?teachers:[t]).filter(person=>!admin||!pay.filter||pay.filter===person.id).map(person=>snapshot(pay,person,month));
    const detail=snapshot(pay,t,month);
    const sum=(pred)=>list.filter(r=>pred(r.st)).reduce((a,r)=>a+payTotal(r.st),0);
    const kpi=(label,value,hint)=>'<div><span>'+label+'</span><strong>'+money(value)+'</strong><small>'+hint+'</small></div>';
    root.innerHTML='<div class="pay-page"><div class="page-head"><div><p class="eyebrow">财务管理</p><h1>教师课酬</h1><p class="muted">'+(admin?'全机构教师的计费规则、课次和结算进度。':'查看我的计费规则、课次和结算进度。')+'金额均为模拟数据，操作仅保存在本浏览器。</p></div></div>'+
      '<div class="pay-toolbar"><div class="pay-month"><button class="btn" data-month-shift="-1" aria-label="上个月">‹</button><input type="month" aria-label="结算月份" value="'+esc(month)+'" min="2000-01" max="2099-12"><button class="btn" data-month-shift="1" aria-label="下个月">›</button></div>'+
      (admin?'<label class="pay-teacher-pick">查看教师 <select aria-label="筛选教师" data-pay-filter><option value="">全部教师</option>'+teachers.map(p=>'<option value="'+p.id+'"'+(p.id===pay.filter?' selected':'')+'>'+p.name+'</option>').join('')+'</select></label>':'<span class="pay-scope">孙老师 · 我的课酬</span>')+'</div>'+
      '<div class="pay-kpis">'+kpi('当月已编制课酬',sum(()=>true),'按本月已编制的课次统计')+kpi('待结算金额',sum(st=>st?.status!=='settled'),'含待本人核对的课酬')+kpi('已结算金额',sum(st=>st?.status==='settled'),'已完成模拟结算登记')+'</div>'+
      '<section class="card pay-overview"><header><h2>教师月结单</h2><span class="pay-dim">'+fmtMonth(month)+'</span></header><div class="pay-scroll"><table class="pay-table"><thead><tr><th>教师</th><th>本月适用单价</th><th>已计费课次</th><th>本单金额</th><th>结算状态</th><th><span class="pay-sr">查看详情</span></th></tr></thead><tbody>'+
      list.map(r=>'<tr class="'+(r.t.id===t.id?'pay-current':'')+'"><td><strong>'+r.t.name+'</strong><small>'+r.t.course+'</small></td><td>'+(r.rule?money(r.rule.rate):'待设置')+'</td><td>'+(r.st?r.st.dates.length+' 节':'—')+'</td><td>'+money(payTotal(r.st))+'</td><td>'+badge(r.st?.status||'none')+'</td><td><button type="button" data-pay-teacher="'+r.t.id+'" class="pay-link" aria-label="查看'+r.t.name+'月结明细">查看明细</button></td></tr>').join('')+'</tbody></table></div></section>'+cardDetail(detail)+'</div>';
    root.querySelectorAll('[data-month-shift]').forEach(btn=>btn.onclick=()=>{pay.month=shifted(month,Number(btn.dataset.monthShift));W.save();render('pay');});
    root.querySelector('input[type=month]').onchange=e=>{if(monthOK(e.target.value)){pay.month=e.target.value;W.save();}render('pay');};
    const filter=root.querySelector('[data-pay-filter]');
    if(filter)filter.onchange=()=>{pay.filter=filter.value;pay.selected=filter.value||pay.selected;W.save();render('pay');};
    root.querySelectorAll('[data-pay-teacher]').forEach(btn=>btn.onclick=()=>{
      pay.selected=btn.dataset.payTeacher;W.save();render('pay');document.querySelector('.pay-detail')?.scrollIntoView?.({behavior:'smooth',block:'start'});
    });
    root.querySelectorAll('[data-pay-action]').forEach(btn=>btn.onclick=()=>modalFor(btn.dataset.payAction,pay,detail));
  }
  window.DemoPay={render};
})();

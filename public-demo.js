(() => {
  'use strict';
  const questions = [
    {point:'有理数加减法', stem:'计算 −6 − (−4) + 3。', answer:'−6 + 4 + 3 = 1',
      finding:'减去负数转化为加上 4，再相加得到 1。', status:'本次答对'},
    {point:'去括号法则', stem:'化简 5 − (2x − 3)。', answer:'5 − 2x − 3 = 2 − 2x',
      finding:'括号前的减号作用到括号内的两项。小满把 2x 写成了 −2x，却保留了 −3。第二项应变成 +3，化简得 8 − 2x。', status:'待订正'},
    {point:'去分母时逐项同乘', stem:'解方程 x/3 + 2 = 5，写出去分母后的第一行。', answer:'x + 6 = 15\nx = 9',
      finding:'等号两边各项都乘了 3，整数 2 也变成了 6。这一行与 11 月 4 日漏乘整数项的作答形成对照。', status:'观察到进步'},
    {point:'列一元一次方程', stem:'3 本同价练习本和一支 5 元的笔共 26 元。每本练习本多少元？请用 x 表示每本的价格，并列出方程。', answer:'3x + 5 = 26\n3x = 21，x = 7',
      finding:'用 3x 表示三本练习本的价格，加上笔的 5 元正好是 26 元。求得每本 7 元。', status:'本次答对'}
  ];
  const sample='./materials/grade7-exam-sample.pdf';
  let activeQuestion=1, audience='teacher';
  function loginAnchor(label){
    const returnTo='/'+location.search+location.hash;
    return '<a class="btn primary" target="_top" href="https://shuxu-math-studio-261118.braveryshuyang.chatgpt.site/signin-with-chatgpt?return_to='+encodeURIComponent(returnTo)+'">'+label+' <span aria-hidden="true">→</span></a>';
  }
  function render(){
    const root=document.getElementById('content');
    const entry=location.hash.split('/')[0], isUpload=entry==='#upload', isJoin=entry==='#join';
    root.innerHTML='<div class="pub-wrap"><header class="pub-head"><span class="pub-brand"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>数序 <span>数学教学工作台</span></span>'+loginAnchor('登录工作台')+'</header>'+
      (isUpload||isJoin?'<section class="pub-invite"><div><h1>'+(isJoin?'教师邀请':'家庭学习资料')+'</h1><p>'+(isJoin?'登录后可查看教师邀请，核对机构后加入。':'登录后可打开此学生的专属资料入口，上传作业或试卷。')+'</p></div>'+loginAnchor(isJoin?'登录查看邀请':'登录打开资料入口')+'</section>':'')+
      '<div class="pub-intro"><p>长沙知行学堂 · 公开教学演示</p><'+(isUpload||isJoin?'h2':'h1')+'>数与方程随堂小测</'+(isUpload||isJoin?'h2':'h1')+'><span>七年级数学 · 4 道题 · 2026 年 11 月 18 日</span></div>'+
      '<div class="pub-grid"><section class="pub-paper"><header><h2>小满的模拟作答卷</h2><a href="'+sample+'" target="_blank" rel="noopener">打开原卷 PDF ↗</a></header><a class="pub-sheet" href="'+sample+'" target="_blank" rel="noopener"><img src="./materials/grade7-exam-preview.jpg" alt="七年级随堂小测原卷，一页四题，蓝色笔迹为模拟学生作答"></a></section>'+
      '<section class="pub-reading" aria-label="样卷解读"><div class="pub-modes" role="group" aria-label="选择阅读视角"><button type="button" data-public-mode="teacher">逐题批阅</button><button type="button" data-public-mode="family">家长反馈</button></div><div data-public-panel></div></section></div></div>';
    const panel=root.querySelector('[data-public-panel]');
    function display(){
      root.querySelectorAll('[data-public-mode]').forEach(button=>{
        button.setAttribute('aria-pressed',String(audience===button.dataset.publicMode));
        button.onclick=()=>{audience=button.dataset.publicMode;display();};
      });
      if(audience==='family'){
        panel.innerHTML='<div class="pub-family"><h2>小满的试卷反馈</h2><section><h3>这次的进步</h3><p>11 月 4 日，小满把 x/4 + 1 = 3 的第一行写成 x + 1 = 12，漏乘了整数项。这次做第 3 题时，他写出了 x + 6 = 15，等号两边的每一项都乘了 3。</p><button type="button" class="pub-evidence" data-paper-question="2">对照第 3 题作答 →</button></section><section><h3>下一次复测</h3><p>第 2 题漏改了括号里第二项的符号。下次用一道括号前为负号的变式，请小满逐项写出符号，再代入一个数核验。</p><button type="button" class="pub-evidence" data-paper-question="1">查看第 2 题错因 →</button></section></div>';
      }else{
        const q=questions[activeQuestion];
        const choices=questions.map((q,i)=>'<button type="button" aria-pressed="'+(i===activeQuestion)+'" data-paper-question="'+i+'">第 '+(i+1)+' 题</button>').join('');
        panel.innerHTML='<div class="pub-choices" role="group" aria-label="逐题查看">'+choices+'</div><article class="pub-question"><div class="pub-topic"><span>'+q.point+'</span><strong>'+q.status+'</strong></div><h2>'+q.stem+'</h2><h3>卷面原作答</h3><p class="pub-answer">'+q.answer+'</p><h3>老师批注</h3><p class="pub-comment">'+q.finding+'</p></article>';
      }
      panel.querySelectorAll('[data-paper-question]').forEach(button=>{
        button.onclick=()=>{
          audience='teacher';activeQuestion=Number(button.dataset.paperQuestion);display();
          panel.querySelector('[data-paper-question="'+activeQuestion+'"]').focus({preventScroll:true});
        };
      });
    }
    display();
  }
  window.addEventListener('hashchange',render);
  render();
})();

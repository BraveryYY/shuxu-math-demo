(() => {
  'use strict';
  const key='shuxu:pages:studio:v1';
  const defaultState=()=>({version:1,role:'admin',lesson:{},month:'2026-11',layout:'cards',orgName:'长沙知行学堂'});
  function read(){
    try {const data=JSON.parse(localStorage.getItem(key));if(data?.version===1)return {...defaultState(),...data};}catch{}
    return defaultState();
  }
  const students=[
    {id:'he',name:'何子涵',weak:'去括号时负号分配',focus:'括号前负号'},
    {id:'lin',name:'林可欣',weak:'去分母时漏乘整数项',focus:'逐项同乘'},
    {id:'zhou',name:'周予安',weak:'选择最小公分母',focus:'最小公分母'}
  ];
  const paths={
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-14 4h2m3 0h2m-7 3h2"/>',
    book:'<path d="M3 4c3-1 6-1 9 1 3-2 6-2 9-1v15c-4-1-6-1-9 1-3-2-6-2-9-1zM12 5v15"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0m0-15a3.5 3.5 0 0 1 0 7m3 3a5 5 0 0 1 3 5"/>',
    coins:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h18m-6 5h3"/>',
    settings:'<path d="M4 6h7m4 0h5M4 12h2m4 0h10M4 18h11m4 0h1"/><circle cx="13" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>', chevron:'<path d="m9 5 7 7-7 7"/>', left:'<path d="m15 5-7 7 7 7"/>',down:'<path d="m5 9 7 7 7-7"/>',
    stack:'<path d="m3 8 9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13m-17-12h1m-1 6h1m-1 6h1"/>',table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 9v11"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>', pin:'<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 0 1 14 0z"/><circle cx="12" cy="10" r="2"/>',
    edit:'<path d="m4 15 11-11 4 4L8 19l-5 1zM12 7l5 5"/>',play:'<path d="m7 4 13 8-13 8z"/>',check:'<path d="m4 12 5 5L20 6"/>',
    board:'<path d="M3 4h18v3H3zM5 7v10h14V7m-7 10v4m-4 0 4-3 4 3"/>', menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
    file:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8m-8 4h6"/>', refresh:'<path d="M20 11a8 8 0 1 0-1.5 6M20 4v6h-6"/>',
    spark:'<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>', mobile:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 5h4m-3 13.5h2"/>'
  };
  const alias={archive:'file',layers:'stack',money:'coins',students:'users',user:'users',cash:'coins',wallet:'coins',phone:'mobile',sparkles:'spark',arrowRight:'arrow',chevronRight:'chevron',chevronLeft:'left',back:'left',chevronDown:'down',monitor:'board',clipboard:'file',location:'pin',time:'clock',lesson:'book',pencil:'edit',school:'book',print:'file',info:'file'};
  function icon(name,size=18){return '<svg aria-hidden="true" focusable="false" class="w-icon" viewBox="0 0 24 24" width="'+Number(size)+'" height="'+Number(size)+'" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||paths[alias[name]]||paths.file)+'</svg>';}
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let toastTimer;
  function toast(msg){
    const node=document.getElementById('toast');node.textContent=msg;node.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2800);
  }
  function save(){try{localStorage.setItem(key,JSON.stringify(W.state));return true;}catch{toast('浏览器存储空间不足，本次操作仅在当前标签页有效。');return false;}}
  function closeModal(){const dlg=document.getElementById('dialog');if(dlg.open)dlg.close();}
  function modal(title,html,onOpen){
    closeModal();const dlg=document.getElementById('dialog'),body=document.getElementById('dialog-body');
    document.getElementById('dialog-title').textContent=title;body.innerHTML=html;dlg.showModal();if(onOpen)onOpen(body);return body;
  }
  function go(path){path=String(path||'schedule').replace(/^#/,'');if(location.hash==='#'+path)W.render();else location.hash=path;}
  const W=window.W={state:read(),students,esc,icon,modal,closeModal,toast,save,go,reset(){this.state=defaultState();save();}};
  window.addEventListener('storage',e=>{if(e.key!==key)return;W.state=read();if((!location.hash || /^#(project|classroom|record|tasks|schedule)(\/|$)/.test(location.hash))&&!document.querySelector('dialog[open]')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))W.render();});
})();

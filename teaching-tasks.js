(() => {
  'use strict';

  const filters = [
    ['all', '全部'], ['prepare', '课前准备'], ['classroom', '课堂授课'], ['follow', '课后跟进']
  ];
  const phaseOrder = {live: 0, ready: 1, ended: 2};
  const {esc, icon} = W;

  function beforeClass(row, status) {
    const path = 'session/' + row.id + '/before';
    if (!status.prepared) {
      const draft = row.id === 'eq9' || W.state.sessionWork?.[row.id]?.prep?.status === 'draft';
      return {
        note: draft ? '教案草稿待确认' : '教学设计与题包待准备',
        label: draft ? '继续备课' : '去备课',
        path: row.id === 'eq9' ? 'prep' : 'prepare/' + row.id
      };
    }
    if (!status.reminded) return {note: '学生与家长的上课提醒待登记', label: '登记提醒', path};
    if (!status.practice) return {note: '题包已确认，课前练习待核对', label: '核对课前练习', path};
    return null;
  }

  function afterClass(row, status) {
    const path = 'session/' + row.id + '/';
    if (!status.homework) return {note: '课后作业与订正待核对', label: '核对作业', path: path + 'after'};
    if (!status.feedback) {
      return {note: status.feedbackLabel, label: '确认家长反馈', path: row.id === 'eq9' ? 'feedback' : path + 'after'};
    }
    const follow = W.state.sessionWork?.[row.id]?.follow || {};
    if (!follow.contact) return {note: '家长反馈已确认，回访待登记', label: '登记家长回访', path: path + 'follow'};
    if (!follow.result) {
      return follow.plan ?
        {note: '复测已安排，结果待记录', label: '记录复测结果', path: path + 'follow'} :
        {note: '已登记家长回访，复测待安排', label: '安排复测', path: path + 'follow'};
    }
    if (!status.reminded || !status.practice) {
      return {note: '结项前还需补齐课前登记', label: '补记提醒与练习', path: path + 'before'};
    }
    if (row.id === 'eq9' && !status.prepared) {
      return {note: '结项前需复核本讲题包', label: '复核题包', path: 'prep'};
    }
    return {note: '回访与复测均已记录，待结项', label: '确认结项', path: path + 'follow'};
  }

  function nextTask(row, filter) {
    const status = SessionJourney.status(row);
    if (status.closed) return null;
    let action;
    let stage;
    if (status.phase === 'ended') {
      stage = 'follow';
      if (filter === 'all' || filter === stage) action = afterClass(row, status);
    } else {
      if (status.phase === 'ready' && (filter === 'prepare' || filter === 'all')) {
        action = beforeClass(row, status);
        stage = 'prepare';
      }
      if (!action && (filter === 'classroom' || filter === 'all') && (status.prepared || status.phase === 'live')) {
        const live = status.phase === 'live';
        stage = 'classroom';
        action = {
          note: live ? '正在授课，继续记录学生表现' : '题包已确认，等待授课',
          label: live ? '继续授课' : '查看授课安排',
          path: live && row.id === 'eq9' ? 'classroom' : 'session/' + row.id + '/delivery'
        };
      }
    }
    return action ? {row, phase: status.phase, stage, ...action} : null;
  }

  function byLesson(a, b) {
    const phase = phaseOrder[a.phase] - phaseOrder[b.phase];
    if (phase) return phase;
    const order = (a.row.date + a.row.time).localeCompare(b.row.date + b.row.time);
    return a.phase === 'ended' ? -order : order;
  }

  function displayTask(task) {
    const {row, stage, phase} = task;
    const [, month, day] = row.date.split('-');
    const group = filters.find(([key]) => key === stage)[1];
    return '<li class="task-row" data-task-session="' + esc(row.id) + '" data-task-stage="' + stage + '">' +
      '<div class="task-time"><time datetime="' + esc(row.date) + '">' + Number(month) + ' 月 ' + Number(day) + ' 日</time>' +
      '<span>' + esc(row.day + ' · ' + row.time) + '</span></div>' +
      '<div class="task-desc"><h3>' + esc(row.name + ' · ' + row.teacher) + '</h3><p>第 ' + esc(row.n) + ' 讲 · ' +
      esc(row.title) + '</p></div><div class="task-status"><span class="task-tag task-' + stage + '">' +
      (phase === 'live' ? '授课中' : group) + '</span><p>' + esc(task.note) + '</p></div>' +
      '<a class="btn small task-open" href="#' + esc(task.path) + '">' + esc(task.label) + icon('chevron', 13) + '</a></li>';
  }

  function render(parts = []) {
    const filter = filters.some(([key]) => key === parts[0]) ? parts[0] : 'all';
    const canManage = W.state.role === 'admin';
    const allTeachers = canManage && W.state.taskScope === 'all';
    const mine = DemoSchedule.teacherName();
    const tasks = DemoSchedule.sessions.filter(row => allTeachers || row.teacher === mine)
      .map(row => nextTask(row, filter)).filter(Boolean).sort(byLesson);
    const root = document.getElementById('view');
    const scope = canManage ? '<label class="task-scope" for="task-scope">查看范围<select id="task-scope">' +
      '<option value="mine"' + (allTeachers ? '' : ' selected') + '>我的待办</option>' +
      '<option value="all"' + (allTeachers ? ' selected' : '') + '>全机构待办</option></select></label>' : '';
    const tabs = filters.map(([key, label]) => '<a href="#tasks' + (key === 'all' ? '' : '/' + key) + '"' +
      (key === filter ? ' aria-current="page"' : '') + '>' + label + '</a>').join('');
    const audience = allTeachers ? '全机构' : mine;
    const empty = filter === 'classroom' ? '当前没有题包已确认的待授课次或进行中的课堂。' :
      filter === 'prepare' ? '当前没有需要准备教案、登记提醒或核对课前练习的课次。' :
      filter === 'follow' ? '当前没有待登记反馈、回访或复测的课次。' : '当前没有待处理的课次。';
    root.innerHTML = '<header class="page-head"><div><p class="eyebrow">' + esc(W.state.orgName) + '</p>' +
      '<h1>教学待办</h1><p>按课次处理备课、授课和课后跟进。</p></div>' + scope + '</header>' +
      '<section class="task-panel" aria-label="按教学阶段查看待办"><nav class="task-filters" aria-label="待办阶段">' + tabs +
      '</nav><div class="task-summary"><h2>' + esc(audience) + '的待办</h2><span>' + tasks.length + ' 个课次</span></div>' +
      (tasks.length ? '<ul class="task-list">' + tasks.map(displayTask).join('') + '</ul>' :
        '<div class="task-empty"><p>' + empty + '</p><a href="#schedule">查看教学安排 →</a></div>') + '</section>';
    const picker = root.querySelector('#task-scope');
    if (picker) picker.onchange = () => {
      W.state.taskScope = picker.value === 'all' ? 'all' : 'mine';
      W.save();
      render(parts);
      root.querySelector('#task-scope')?.focus();
    };
  }

  window.TeachingTasks = {render};
})();

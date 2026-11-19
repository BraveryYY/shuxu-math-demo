(() => {
  'use strict';

  const special = row => row.id === 'eq9';
  const archived = row => !special(row) && row.date < '2026-11-18';
  const canEdit = row => W.state.role === 'admin' || (W.state.role === 'teacher' && row.teacher === '孙老师');
  const work = row => W.state.sessionWork?.[row.id] || {};
  const lesson = () => W.state.lesson || {};
  const esc = value => W.esc(value);
  const roster = row => (row.students || []).map(id => W.students.find(person => person.id === id)).filter(Boolean);

  function phase(row) {
    if (archived(row)) return 'ended';
    const value = special(row) ? lesson().phase : work(row).delivery?.phase;
    return ['live', 'ended'].includes(value) ? value : 'ready';
  }

  function facts(row) {
    const saved = work(row);
    const history = archived(row);
    const notes = history ? {
      diagnosis: '先用上节课的独立练习核对解题步骤，再进入「' + row.title + '」。',
      prework: {exercise: '课前练习已在上课前核对，课堂从学生的解题步骤切入。'},
      delivery: {notes: '全班完成「' + row.title + '」的共同练习，并对照板书讲解了关键步骤。'},
      post: {homework: '已批阅本讲课后练习，订正时要求标出原解答中需要修改的一步。', feedback: '已整理本讲共同练习和订正要求，下次复测关注学生能否独立写出完整步骤。'}
    } : {};
    const merge = key => ({...notes[key], ...saved[key]});
    return {
      diagnosis: saved.diagnosis ?? notes.diagnosis ?? '',
      prework: merge('prework'), delivery: merge('delivery'),
      post: merge('post'), follow: saved.follow || {}
    };
  }

  function status(row) {
    const f = facts(row);
    const s = lesson();
    const pupils = roster(row);
    const school = phase(row);
    const prepared = special(row) ? s.confirmed !== false : work(row).prep?.status === 'confirmed' || (archived(row) && !work(row).prep);
    const reminded = W.state.reminders?.[row.id] ?? (archived(row) || special(row));
    const reviewed = special(row) ? pupils.filter(p => s.feedbackByStudent?.[p.id]?.confirmed).length : 0;
    const feedback = special(row) ? pupils.length > 0 && reviewed === pupils.length : Boolean(f.post.feedback);
    const homework = Boolean(f.post.homework);
    const practice = Boolean(f.prework.exercise);
    const feedbackLabel = special(row) ? '家长反馈 ' + reviewed + '/' + pupils.length + ' 已确认' : feedback ? '家长反馈已确认' : '家长反馈待确认';
    return {phase:school, prepared, reminded:Boolean(reminded), practice, homework, feedback, feedbackLabel, closed:Boolean(f.follow.closed), reviewed};
  }

  function summary(row) {
    const s = status(row);
    if (s.closed) return '已结项 · 复测与回访可查';
    if (s.phase === 'ended') return s.feedbackLabel + ' · ' + (work(row).follow?.contact ? '回访已登记' : '待跟进回访');
    if (s.phase === 'live') return '授课进行中 · ' + (s.prepared ? '题包已确认' : '题包待确认');
    return (s.prepared ? '题包已确认' : work(row).prep ? '备课草稿待确认' : '待备课') + ' · ' + (s.reminded ? '提醒已登记' : '提醒待登记');
  }

  function entry(label, content, empty = '待登记') {
    return '<div class="sj-entry"><dt>' + esc(label) + '</dt><dd>' + (content ? esc(content) : '<span class="sj-muted">' + esc(empty) + '</span>') + '</dd></div>';
  }
  function action(key, label) {
    return '<button type="button" class="btn small" data-sj-action="' + key + '">' + esc(label) + '</button>';
  }
  function link(hash, label) {
    return '<a class="btn small" href="#' + esc(hash) + '">' + esc(label) + '</a>';
  }
  function perStudent(items) {
    if (!items.length) return '';
    return '<ul class="sj-pupils">' + items.map(([name, text]) => '<li><strong>' + esc(name) + '</strong><span>' + esc(text) + '</span></li>').join('') + '</ul>';
  }

  function stageList(row) {
    const f = facts(row), s = status(row);
    const isSpecial = special(row), edit = canEdit(row), completed = s.phase === 'ended';
    const l = lesson(), saved = work(row), pupils = roster(row);
    const prep = isSpecial ? (l.roomPacket || l.draft || l.packet || {}) : {...window.SessionPrep?.defaults(row), ...saved.prep};
    const editAction = (key, label) => edit ? action(key, label) : '';
    const plan = isSpecial ? 'prep' : 'prepare/' + row.id;
    const planLink = link(plan, (completed || !edit) ? '查看教学设计' : s.prepared ? '复核备课' : '进入备课');
    const packetCount = prep.common?.length ?? (isSpecial ? 4 : null);
    const planLabel = s.prepared ? '题包已确认' : saved.prep || l.draft && isSpecial ? '备课草稿待确认' : '待制定教案';
    const observations = pupils.map(p => {
      const entries = (l.observations?.[p.id] || []);
      const last = entries.at(-1);
      return [p.name, last ? '已记录 ' + entries.length + ' 题，最近一题' + (last.verdict === 'correct' ? '第一行正确' : '的错因是' + (last.reason || last.cause || '待补充')) + (last.firstLine ? '。第一行写为 ' + last.firstLine : '') : '暂无作答记录'];
    });
    const observedCount = pupils.reduce((n, p) => n + (l.observations?.[p.id]?.length || 0), 0);
    const normalObservations = pupils.filter(p => f.delivery.byStudent?.[p.id]).map(p => [p.name, f.delivery.byStudent[p.id]]);
    const confirmedFeedback = pupils.map(p => {
      const record = l.feedbackByStudent?.[p.id];
      return [p.name, record?.confirmed ? record.text + (record.practice ? '\n课后题　' + record.practice : '') : '等待老师确认'];
    });
    const live = s.phase === 'live';
    let teachingActions = '';
    if (isSpecial && edit && !completed && (s.prepared || live)) teachingActions = link('classroom', live ? '继续授课与记录' : '进入授课');
    if (!isSpecial && s.phase === 'ready' && s.prepared) teachingActions = editAction('start', '开始上课');
    if (!isSpecial && s.phase === 'ready' && !s.prepared && edit) teachingActions = link(plan, '先确认题包');
    if (!isSpecial && s.phase !== 'ready') teachingActions = editAction('notes', live ? '记录课堂表现' : '补充课堂记录') + (live ? editAction('end', '确认下课') : '');
    const postComplete = completed && s.homework && s.feedback;
    const canClose = s.prepared && s.reminded && s.practice && postComplete && f.follow.contact && f.follow.result;
    const steps = [
      {
        key:'prepare', name:'课前诊断与备课', done:s.prepared, active:Boolean(f.diagnosis || saved.prep),
        summary:planLabel + (packetCount ? ' · ' + packetCount + ' 道共同题' : ''),
        body:'<dl>' + entry('课前诊断', f.diagnosis, '可补充上次作答中的薄弱点或本节要核对的步骤') + entry('本讲目标', prep.goals || (isSpecial ? '逐项去分母，保留分子括号并回代检验。' : '')) +
          (prep.exercise ? entry('共同练习', prep.exercise) : '') + '</dl>',
        actions:planLink + editAction('diagnosis', f.diagnosis ? '修改诊断' : '记录诊断')
      },
      {
        key:'before', name:'上课提醒与课前练习', done:s.reminded && s.practice, active:s.reminded || s.practice,
        summary:(s.reminded ? '提醒已登记' : '提醒待登记') + ' · ' + (s.practice ? '课前练习已核对' : '课前练习待核对'),
        body:'<dl>' + entry('通知对象', '学生与家长 · ' + row.date + ' ' + row.time + ' · ' + row.room) +
          entry('提醒登记', s.reminded ? '已登记提醒状态' : '', '尚未登记提醒状态') + entry('练习核对记录', f.prework.exercise) + '</dl>',
        actions:editAction('before', '登记提醒与练习')
      },
      {
        key:'delivery', name:'课堂授课与作答记录', done:completed, active:live,
        summary:(completed ? '已下课' : live ? '上课中' : '待上课') + (isSpecial ? ' · ' + observedCount + ' 条课堂作答' : normalObservations.length ? ' · ' + normalObservations.length + ' 名学生有课堂记录' : ''),
        body:(isSpecial ? perStudent(observations) : '<dl>' + entry('课堂记录', f.delivery.notes, live ? '授课中可随时补记' : '上课后记录讲解与作答情况') + '</dl>' + perStudent(normalObservations)),
        actions:teachingActions
      },
      {
        key:'after', name:'课后作业、订正与家长反馈', done:postComplete, active:completed,
        summary:(s.homework ? '作业与订正已核对' : '作业待核对') + ' · ' + s.feedbackLabel,
        body:'<dl>' + entry('作业与订正', f.post.homework, '下课后登记批改、错因及订正结果') + (isSpecial ? '' : entry('家长反馈', f.post.feedback, '下课后可拟定并确认家长可见的反馈')) + '</dl>' + (isSpecial ? perStudent(confirmedFeedback) : ''),
        actions:completed ? editAction('post', s.homework ? '修改课后记录' : '核对课后作业') + (isSpecial && edit ? link('feedback', '查看与确认家长反馈') : '') : ''
      },
      {
        key:'follow', name:'课后服务与结项', done:s.closed, active:completed && Boolean(f.follow.contact || f.follow.plan || f.follow.result),
        summary:s.closed ? '已结项 · 回访与复测可查' : (f.follow.contact ? '回访已登记' : '家长回访待登记') + ' · ' + (f.follow.result ? '复测已记录' : f.follow.plan ? '已安排复测' : '待安排复测'),
        body:'<dl>' + entry('家长回访', f.follow.contact, '可登记沟通日期、方式及家长意见') + entry('复测安排', f.follow.plan) + entry('复测结论', f.follow.result) + '</dl>' +
          (completed && !s.closed && !canClose ? '<p class="sj-hint">前四个阶段完成，并登记回访和复测结论后，可结项。</p>' : ''),
        actions:completed ? (s.closed ? editAction('reopen', '重新开启跟进') : editAction('follow', '登记回访与复测') + (canClose ? editAction('close', '确认结项') : '')) : ''
      }
    ];
    if (!edit) {
      // 他班教师可见教学计划和阶段进度，学生记录与沟通原文由负责教师维护。
      const publicDetails = [
        entry('本讲目标', prep.goals || (isSpecial ? '逐项去分母，保留分子括号并回代检验。' : '')),
        entry('上课安排', row.date + ' ' + row.time + ' · ' + row.room),
        entry('课堂记录', isSpecial ? '全班已记录 ' + observedCount + ' 条作答' : f.delivery.notes || normalObservations.length ? '已有课堂记录' : '暂无课堂记录'),
        entry('家长反馈进度', s.feedbackLabel),
        entry('跟进进度', (f.follow.contact ? '回访已登记' : '待回访') + ' · ' + (f.follow.result ? '复测结论已记录' : '待记录复测结论'))
      ];
      steps.forEach((stage, index) => { stage.body = '<dl>' + publicDetails[index] + '</dl>'; });
    }
    return steps;
  }

  function render(row, container) {
    const stages = stageList(row);
    const count = stages.filter(stage => stage.done).length;
    const phaseKey = phase(row);
    const current = phaseKey === 'live' ? 'delivery' : phaseKey === 'ended' ? (stages[3].done ? 'follow' : 'after') : stages.find(s => !s.done)?.key;
    const readOnly = !canEdit(row);
    container.innerHTML = '<section class="sj-panel" aria-label="本课次全流程"><div class="sj-heading"><div><h2>课次全流程</h2><p>' +
      (archived(row) ? '历史课次含示例教学记录，回访与复测可继续补录。' : '查看本讲的交付进度，展开阶段可复核记录。') + '</p></div><span class="sj-progress">' + count + ' / ' + stages.length + ' 阶段完成</span></div>' +
      (readOnly ? '<p class="sj-access">当前为只读视图，由' + esc(row.teacher) + '或机构管理员维护本讲记录。</p>' : '') +
      '<ol class="sj-timeline">' + stages.map((stage, i) => {
        const kind = stage.done ? 'done' : stage.active ? 'active' : 'todo';
        const label = stage.done ? '已完成' : stage.active ? '进行中' : '待办';
        return '<li class="sj-stage sj-' + kind + '"><span aria-hidden="true" class="sj-marker">' + (stage.done ? W.icon('check', 13) : i + 1) +
          '</span><details' + (stage.key === current ? ' open' : '') + '><summary><div class="sj-stage-title"><h3>' + esc(stage.name) + '</h3><span class="sj-state">' + label +
          '</span></div><span class="sj-description">' + esc(stage.summary) + '</span><span class="sj-chevron">' + W.icon('down', 15) +
          '</span></summary><div class="sj-body">' + stage.body + (stage.actions ? '<div class="buttons sj-actions">' + stage.actions + '</div>' : '') +
          '</div></details></li>';
      }).join('') + '</ol></section>';
    container.querySelectorAll('[data-sj-action]').forEach(button => {
      button.onclick = () => editStage(row, button.dataset.sjAction);
    });
  }

  function fieldsModal(title, intro, fields, submitText, onSave) {
    function fieldMarkup(field) {
      const name = esc(field.key);
      if (field.type === 'check') return '<label class="sj-check"><input type="checkbox" name="' + name + '"' + (field.value ? ' checked' : '') + '>' + esc(field.label) + '</label>';
      return '<label>' + esc(field.label) + '<textarea name="' + name + '" rows="' + (field.rows || 2) + '" maxlength="2000"' +
        (field.required ? ' required' : '') + ' placeholder="' + esc(field.hint || '') + '">' + esc(field.value || '') + '</textarea></label>';
    }
    W.modal(title, '<form class="sj-form"><p>' + esc(intro) + '</p>' + fields.map(fieldMarkup).join('') +
      '<div class="buttons"><button type="button" class="btn" data-sj-cancel>取消</button><button type="submit" class="btn primary">' + esc(submitText) + '</button></div></form>', body => {
      const form = body.querySelector('form');
      form.querySelector('[data-sj-cancel]').onclick = () => W.closeModal();
      form.onsubmit = event => {
        event.preventDefault();
        const values = {};
        for (const field of fields) {
          const input = form.elements.namedItem(field.key);
          values[field.key] = field.type === 'check' ? input.checked : input.value.trim();
          if (field.required && !values[field.key]) { input.focus(); return; }
        }
        onSave(values);
      };
    });
  }

  function editStage(row, key) {
    if (!canEdit(row)) return;
    const f = facts(row), s = status(row), isSpecial = special(row);
    function commit(update, message) {
      if (!canEdit(row)) return;
      W.state.sessionWork ||= {};
      const saved = W.state.sessionWork[row.id] ||= {};
      update(saved);
      const persisted = W.save();
      W.closeModal();
      W.render();
      if (persisted !== false) W.toast(message);
    }
    const merge = (saved, block, values) => { saved[block] = {...saved[block], ...values}; };
    const text = (key, label, value = '', hint = '', required = false) => ({key, label, value, hint, required});
    const detail = row.name + ' · 第 ' + row.n + ' 讲 · ' + row.title;
    if (key === 'diagnosis') {
      fieldsModal('记录课前诊断', detail, [text('diagnosis','诊断依据与本讲调整',f.diagnosis,'例如，上一次作答中出现了什么问题？本讲准备如何检查？',true)], '保存诊断', values => {
        commit(saved => { saved.diagnosis = values.diagnosis; }, '已保存本讲诊断');
      });
    }
    if (key === 'before') {
      fieldsModal('登记提醒与课前练习', '按实际情况登记。此演示仅在当前浏览器保存，不会发送消息。', [
        {type:'check',key:'reminder',label:'已向学生与家长提醒上课时间和地点',value:s.reminded},
        text('exercise', '已核对的课前练习', f.prework.exercise, '填写提交情况或要在课堂上关注的问题，可稍后补记')
      ], '保存登记', values => {
        commit(saved => {
          W.state.reminders ||= {};
          W.state.reminders[row.id] = values.reminder;
          merge(saved, 'prework', {exercise:values.exercise});
        }, '已保存提醒与练习登记');
      });
    }
    if (key === 'start' && !isSpecial && s.phase === 'ready' && s.prepared) {
      fieldsModal('开始本讲授课', detail + '。确认后课表将显示上课中。', [], '确认开始上课', () => {
        if (phase(row) !== 'ready' || !status(row).prepared) return;
        commit(saved => merge(saved, 'delivery', {phase:'live'}), '本讲已开始');
      });
    }
    if ((key === 'notes' || key === 'end') && !isSpecial && s.phase !== 'ready' && (key !== 'end' || s.phase === 'live')) {
      const ending = key === 'end';
      const pupils = roster(row);
      fieldsModal(ending ? '确认下课' : '课堂记录', detail, [
        text('notes', '班级课堂记录', f.delivery.notes, '记录讲解进度、共同问题或下次要复查的内容', ending || !pupils.length),
        ...pupils.map(p => text('pupil-' + p.id, p.name + '的课堂表现', f.delivery.byStudent?.[p.id], '可填写作答步骤、错因与讲解结果'))
      ], ending ? '保存并下课' : '保存课堂记录', values => {
        if (!values.notes && pupils.every(p => !values['pupil-' + p.id])) return W.toast('请先填写班级记录或一名学生的课堂表现');
        commit(saved => {
          const byStudent = {};
          pupils.forEach(p => { if (values['pupil-' + p.id]) byStudent[p.id] = values['pupil-' + p.id]; });
          merge(saved, 'delivery', {notes:values.notes, byStudent, ...(ending ? {phase:'ended'} : {})});
        }, ending ? '本讲已下课，可登记课后作业与反馈' : '已保存课堂记录');
      });
    }
    if (key === 'post' && s.phase === 'ended') {
      const fields = [text('homework', '作业批改与订正记录', f.post.homework, '哪些题已批改，哪些错误已订正？', isSpecial || s.closed)];
      if (!isSpecial) fields.push(text('feedback', '已确认的家长反馈', f.post.feedback, '填写供家长查看的进展与下一步练习，可稍后确认', s.closed));
      fieldsModal('课后作业与反馈', '保存填写的记录即表示老师已核对内容。家长反馈可在本讲详情中复看。', fields, '确认课后记录', values => {
        if (!values.homework && !values.feedback) return W.toast('请先填写作业核对记录或家长反馈');
        commit(saved => merge(saved, 'post', values), '已确认本讲课后记录');
      });
    }
    if (key === 'follow' && s.phase === 'ended' && !f.follow.closed) {
      fieldsModal('登记回访与复测', detail + '。可先安排复测，完成后再补记结论。', [
        text('contact', '家长回访记录', f.follow.contact, '沟通日期、方式及家长意见'),
        text('plan', '复测时间与内容', f.follow.plan, '下次要检查哪个知识点，用什么题检查？'),
        text('result', '复测结论及后续安排', f.follow.result, '根据实际作答记录已掌握项和仍需巩固的步骤')
      ], '保存跟进', values => {
        if (!Object.values(values).some(Boolean)) return W.toast('请先填写一项跟进记录');
        commit(saved => merge(saved, 'follow', values), '已保存回访与复测记录');
      });
    }
    if (key === 'close' && s.phase === 'ended' && s.prepared && s.reminded && s.practice && s.homework && s.feedback && f.follow.contact && f.follow.result && !s.closed) {
      fieldsModal('确认本讲结项', '本讲的课后作业、家长反馈、回访和复测均已登记，确认后可继续复看完整记录。', [], '确认结项', () => {
        commit(saved => merge(saved, 'follow', {closed:true}), '本讲已结项');
      });
    }
    if (key === 'reopen' && s.closed) {
      fieldsModal('重新开启跟进', '已有记录将保留，可继续补充家长回访或复测安排。', [], '重新开启', () => {
        commit(saved => merge(saved, 'follow', {closed:false}), '本讲已重新开启跟进');
      });
    }
  }
  window.SessionJourney = {render, phase, summary, status};
})();

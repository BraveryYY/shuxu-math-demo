(() => {
  'use strict';
  const {esc} = W;
  // Each example follows the scheduled lesson and stays local to the public demo.
  const examples = {
    eq1: ['用一个含字母的式子表示总价，并解释字母的单位。', '一本书 a 元，一支笔 3 元。买两本书和一支笔要多少元？', '2a + 3 元。2a 是两本书的价格。', '若笔改为每支 b 元，写出两本书和三支笔的总价。'],
    eq2: ['辨认含未知数的等式，区分方程和一般等式。', '3 + 4 = 7、2x + 1 = 7、x + 2 三个式子中，哪个是方程？', '2x + 1 = 7 同时具备未知数和等号。', '各写一个方程和一个不含未知数的等式，并说明判断依据。'],
    eq4: ['从未知数的个数、次数判断一元一次方程。', '判断 2x + 3 = 7 和 x² = 4 中哪个是一元一次方程。', '2x + 3 = 7。它只含一个未知数，且未知数的次数为 1。', '把“某数的三倍减二等于十”写成一元一次方程。'],
    eq5: ['把给定数分别代入方程两边，检验它是不是方程的解。', 'x = 4 是方程 3x − 1 = 2x + 3 的解吗？', '是。左边为 11，右边也为 11。', '检验 x = 2 和 x = 3 是否为 2x + 5 = 11 的解。'],
    eq6: ['写出保持等式成立的变形，并注明两边同时进行的运算。', '由 4x + 2 = 14 求 x，写出每一步运算。', '两边同时减 2 得 4x = 12，再同时除以 4 得 x = 3。', '解 5y − 3 = 17，并用一句话说明每次变形。'],
    eq7: ['运用等式的性质判断变形是否等价。', '若 a = b，a − 3 = b − 3 和 2a = b 都一定成立吗？', '前者一定成立，因为两边同时减 3。后者未对两边做相同运算。', '从 3x + 1 = 7 出发，用等式性质求出 x。'],
    eq8: ['移项时保留各项系数并正确变号，再合并同类项。', '解 5x − 4 = 2x + 8，并写出移项后的第一行。', '5x − 2x = 8 + 4，所以 3x = 12，x = 4。', '解 6y + 2 = 3y − 7，并圈出移项后改变符号的项。'],
    eq10: ['从题干提取等量关系，列一元一次方程，并用原条件检验答案。', '甲组有 x 人，乙组比甲组多 6 人，两组共有 30 人。两组各有多少人？', 'x + (x + 6) = 30，解得 x = 12。甲组 12 人，乙组 18 人，相加为 30 人。', '两根绳子共长 42 米，长绳比短绳长 8 米。设未知数、列方程，并用两根绳子的长度检验。'],
    eq11: ['写出两种收费方案的费用式，通过相等费用找到分界点。', '租车 A 方案收 10 元起步费，每小时 4 元。B 方案每小时 6 元。租整小时，两种方案何时同价？', '设租 x 小时，10 + 4x = 6x，得 x = 5。两种方案均为 30 元。', '用同一组收费规则比较租 3 小时和 8 小时的总价，分别推荐方案并写明依据。'],
    ba1: ['用正数、负数和零描述相对于基准的量。', '以海平面为 0 米，写出高出海平面 15 米和低于海平面 6 米的高度。', '+15 米与 −6 米。', '给一个运动情境规定正方向，再用带符号的数记录两次相反的运动。'],
    ba2: ['在数轴上定位负数，并用到原点的距离表示绝对值。', '在数轴标出 −4 和 3，哪个点离原点更远？', '−4 离原点更远，因为 |−4| = 4，|3| = 3。', '在数轴上找出与原点相距 2.5 个单位的两个点。'],
    ba3: ['用数轴上点的左右位置比较有理数的大小。', '将 −1、−3、0、2 在数轴上标出并从小到大排列。', '−3 < −1 < 0 < 2。', '比较 −1.5 与 −2，并在数轴上标注判断依据。'],
    ba4: ['把减法转成加法并保留相反数的符号。', '计算 −5 − (−3) + 4，写出改写为加法的一行。', '−5 + 3 + 4 = 2。', '计算 2 − (−6) − 9，写出每一步。'],
    ba5: ['识别同类项，合并系数并保留字母和指数。', '化简 3a + 2b − a + b。', '2a + 3b。', '化简 4x² − 3x + 2x² + x，并标出两组同类项。'],
    ba6: ['根据括号前的符号逐项展开，核对每项的符号。', '去括号并化简 3x − (x − 4)。', '3x − x + 4 = 2x + 4。', '比较 2a + (a − 3) 与 2a − (a − 3) 的结果。'],
    ba7: ['先去括号、合并同类项，再代入负数求值，并用原式核验。', '当 a = −2 时，先化简 3(a − 1) − (2a + 4)，再求值。', '3a − 3 − 2a − 4 = a − 7。代入 a = −2，得 −9。', '当 x = −3 时，先化简 2(x + 4) − (x − 1)，再求值，并代入原式验算。'],
    ba8: ['把文字中的数量关系写成整式，并解释每一项的实际意义。', '每盒有 x 支铅笔，购入 3 盒后送出 5 支，还剩多少支铅笔？', '3x − 5 支。3x 表示购入的数量，5 表示送出的数量。', '每盒有 a 支笔，新买 2 盒，原有 7 支，又用去 3 支。写出剩余数量并化简。'],
    ba9: ['综合使用分配律与合并同类项，核对负号和常数项。', '化简 2(3x − 2) − (4x + 1)，再求 x = −1 时的值。', '6x − 4 − 4x − 1 = 2x − 5。代入 x = −1，得 −7。', '化简 3(2a − 1) − 2(a + 4)，并用 a = 2 检查结果。'],
    gm1: ['用三角形两边之和大于第三边判断三边能否围成三角形。', '长 2、3、5 厘米的三根线段能否首尾相连围成三角形？', '不能，因为 2 + 3 = 5，两短边之和必须大于最长边。', '两边分别为 3 和 7 厘米，写出第三边长度的范围。'],
    gm2: ['用三角形内角和求未知角，并检验三角之和。', '三角形两个内角分别为 45°、65°，求第三个内角。', '180° − 45° − 65° = 70°。', '等腰三角形的顶角为 40°，求两个底角。'],
    gm3: ['利用三角形外角与不相邻内角的关系计算角度。', '三角形的一个外角是 125°，一个不相邻内角是 55°，求另一个不相邻内角。', '125° − 55° = 70°。', '画一个三角形并延长一条边，用符号写出外角与内角的关系。'],
    gm4: ['从三角形名称的顺序判断对应顶点、对应边与对应角。', '已知 △ABC ≌ △DEF，写出 AC 的对应边及 ∠B 的对应角。', 'AC 对应 DF，∠B 对应 ∠E。', '若 △PQR ≌ △XYZ，按顺序写出三组对应边。'],
    gm5: ['利用全等三角形的性质，把已知边长或角度转移到对应位置。', '△ABC ≌ △DEF，AB = 5 厘米、∠C = 50°。求 DE 和 ∠F。', 'DE = 5 厘米，∠F = 50°，分别对应 AB 和 ∠C。', '已知 △PQR ≌ △XZY，列出三组对应角，检查字母顺序。'],
    gm6: ['使用角平分线上的点到角两边距离相等，并标出垂足。', 'P 在 ∠AOB 的角平分线上，PM ⟂ OA，PN ⟂ OB，PM = 4 厘米。求 PN。', 'PN = PM = 4 厘米，两条垂线段分别表示 P 到两边的距离。', '沿用本题条件，若 PM + PN = 14 厘米，求两段长度并说明理由。'],
    gm7: ['标出两组对应角及其夹边，用角边角判定全等，并按对应顶点顺序书写。', '在 △ABC 和 △DEF 中，∠A = ∠D，AB = DE，∠B = ∠E。说明两三角形全等的理由。', 'AB 和 DE 分别是已知两角的夹边，由角边角（ASA）得 △ABC ≌ △DEF。', '在 △ABC 与 △PQR 中，∠A = ∠P，∠C = ∠R。补充一条边的条件，使两三角形可用角边角判定全等，并写出理由。'],
    gm8: ['将已知条件、判定理由与待证结论组织成完整的证明。', '已知 AB = AC，D 为 BC 的中点。连接 AD，证明 ∠BAD = ∠CAD。', 'D 为中点，得 BD = CD。又 AB = AC，AD = AD，由边边边得 △ABD ≌ △ACD，故对应角 ∠BAD = ∠CAD。', '沿用本题条件，进一步证明 AD ⟂ BC，各写出推理依据。'],
    gm9: ['从待证结论倒推所需的全等条件，并区分判定与性质。', '已知 AB = AC，点 D、E 分别在 AB、AC 上，且 AD = AE。连接 BE、CD，证明 BE = CD。', '∠BAE 与 ∠CAD 是同一个角，结合 AB = AC、AE = AD，由边角边得 △ABE ≌ △ACD，因此 BE = CD。', '依据本题的对应关系，再写出两组相等的角并说明理由。']
  };
  const upcomingSteps = {
    eq10: '用线段图标出“两组共 30 人”，学生先口述等量关系。\n设甲组为 x，独立填写两组人数，再同桌核对方程。\n将解代回总人数和人数差两个条件，讨论怎样发现设元错误。',
    eq11: '分别用式子表示两种方案的总价，先标明单位。\n建立同价方程，投屏讲解等式的含义。\n将 3、5、8 小时代入并比较，解释各方案适用的时长。',
    ba7: '比较先代入与先化简两种解法，标出括号前的负号。\n学生独立写出去括号的第一行，逐项核对常数项符号。\n合并、代入并用原式核验，交流出现不同结果的原因。',
    ba8: '用实物盒示意“每盒”和“盒数”，让学生说出总数。\n把买入和送出对应到加减运算，再逐项解释字母和常数。\n变更盒数和送出量，让同桌对照新情境修改式子。',
    ba9: '先标注分配律涉及的各项，再独立写出展开式。\n用两种记号区分含 x 的项与常数项，再分别合并。\n将同一个负数分别代入原式和化简式，比对结果。',
    gm7: '分别画出两个三角形，用相同弧线标出两组相等的角。\n连接每组三角形中两个已知角的顶点，找出夹边。\n依据角边角判定写出全等式，让同桌检查对应顶点的顺序。',
    gm8: '画出图形，将中点条件改写为两条线段相等。\n从目标角寻找对应三角形，补齐公共边并选定判定定理。\n按“条件—判定—结论”完成证明，互查每个等号的理由。',
    gm9: '在同一张图中分别描出两个待比较的三角形。\n围绕待证边相等，找出已知边与公共角，写出全等条件。\n按顶点顺序验证对应边，并由全等性质得出结论。'
  };
  const fields = [
    ['goals', '本讲目标', 2], ['steps', '教学步骤', 4],
    ['exercise', '课堂共同题', 3], ['answer', '参考解答与讲解要点', 3], ['homework', '课后练习', 3]
  ];
  function defaults(row) {
    const sample = examples[row.id];
    if (!sample) return {goals: row.goal || '', steps: '', exercise: '', answer: '', homework: ''};
    const [goals, exercise, answer, homework] = sample;
    const steps = upcomingSteps[row.id] || ['围绕“' + row.title + '”辨认题中已知条件。', '请学生独立完成本课共同题，说明每一步的理由。', '展示参考解答并比较解法，最后用课后练习复查掌握情况。'].join('\n');
    return {goals, steps, exercise, answer, homework};
  }
  function editPermission(row) {
    return W.state.role === 'admin' || (W.state.role === 'teacher' && row.teacher === '孙老师');
  }
  function phase(row) {
    if (window.SessionJourney) return window.SessionJourney.phase(row);
    return W.state.sessionWork?.[row.id]?.delivery?.phase || (row.date < '2026-11-18' ? 'ended' : 'ready');
  }
  function readOnly(row) {
    return phase(row) !== 'ready' || !editPermission(row);
  }
  function render(row) {
    const view = document.getElementById('view');
    const link = '#session/' + encodeURIComponent(row.id);
    const saved = W.state.sessionWork?.[row.id]?.prep;
    const lessonPhase = phase(row);
    const historical = lessonPhase === 'ended';
    const editable = !readOnly(row);
    const header = '<a class="page-back" href="' + link + '">← 课次详情</a><header class="page-head"><div><p class="eyebrow">' + esc(row.name) + ' · ' + esc(row.teacher) + '</p><h1>第 ' + esc(row.n) + ' 讲 · ' + esc(row.title) + '</h1><p>' + esc(row.date) + '　' + esc(row.time) + '　' + esc(row.room) + '</p></div></header>';
    if (lessonPhase !== 'ready' && !saved) {
      view.innerHTML = header + '<section class="card sp-empty"><h2>备课存档</h2><p class="muted">本节课未留存教学目标、讲解步骤和练习。其他教学记录可在课次详情中查看。</p><a class="btn" href="' + link + '">返回课次详情</a></section>';
      return;
    }
    const values = {...defaults(row), ...saved};
    const confirmed = saved?.status === 'confirmed';
    const status = confirmed ? '备课已确认' : saved ? '草稿' : '建议方案';
    function field([key, label, size]) {
      const attributes = 'id="sp-' + key + '" name="' + key + '" rows="' + size + '"';
      const content = esc(values[key]);
      return editable ? '<label class="sp-field" for="sp-' + key + '"><span>' + label + '</span><textarea ' + attributes + '></textarea></label>' :
        '<div class="sp-field"><h3>' + label + '</h3><p class="sp-readonly">' + (content || '尚未填写') + '</p></div>';
    }
    const statusHint = editable ? (saved ? '修改后可保存草稿，或确认本节课的备课内容。' : '根据本讲主题预填了示例内容，可直接修改。') :
      (historical ? '本节课的备课记录已归档。' : lessonPhase === 'live' ? '本节课正在授课，可查看已确认的教学内容。' : '当前为查看模式，本课由' + esc(row.teacher) + '负责。');
    const actions = editable ? '<div class="buttons sp-actions"><button type="button" class="btn" data-sp-save="draft">保存草稿</button><button type="button" class="btn primary" data-sp-save="confirmed">确认备课</button></div>' : '';
    view.innerHTML = header + '<div class="sp-form"><section class="card"><div class="sp-heading"><h2>教学方案</h2><span class="pill ' + (confirmed ? '' : 'amber') + '">' + status + '</span></div><p class="muted">' + statusHint + '</p>' + fields.slice(0, 2).map(field).join('') + '</section><section class="card"><h2>本讲练习</h2>' + fields.slice(2).map(field).join('') + '</section><div role="status" aria-live="polite" class="sp-message"></div>' + actions + '</div>';
    if (!editable) return;
    for (const [key] of fields) view.querySelector('#sp-' + key).value = values[key] || '';
    view.querySelectorAll('[data-sp-save]').forEach(button => {
      button.onclick = () => {
        if (readOnly(row)) { render(row); return; }
        const status = button.dataset.spSave;
        const data = {};
        for (const [key, label] of fields) {
          const input = view.querySelector('#sp-' + key);
          data[key] = input.value.trim();
          if (status === 'confirmed' && !data[key]) {
            view.querySelector('.sp-message').textContent = '请填写“' + label + '”后再确认。';
            input.focus();
            return;
          }
        }
        const work = W.state.sessionWork ||= {};
        const session = work[row.id] ||= {};
        session.prep = {...session.prep, ...data, status, updatedAt: new Date().toISOString()};
        if (!W.save()) {
          view.querySelector('.sp-message').textContent = '备课内容暂存在当前标签页，浏览器持久保存失败。请重试。';
          return;
        }
        W.go('session/' + row.id);
        W.toast(status === 'confirmed' ? '本节课的备课内容已确认' : '已保存本节课的备课草稿');
      };
    });
  }
  window.SessionPrep = {defaults, render};
})();

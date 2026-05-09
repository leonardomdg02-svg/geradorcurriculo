"use strict";

// Objeto de estado global
const state = { step: 1, template: 'classico', habilidades: [], fotoBase64: null, formacoes: 0, experiencias: 0 };

// Inicialização
window.onload = () => { bindEvents(); checkDraft(); updateUI(); };

function bindEvents() {
    document.getElementById('btn-next').addEventListener('click', goNext);
    document.getElementById('btn-prev').addEventListener('click', goPrev);
    document.getElementById('btn-save-draft').addEventListener('click', () => { autoSaveDraft(); showToast("Salvo!"); });
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('add-formacao').addEventListener('click', createFormacao);
    document.getElementById('add-experiencia').addEventListener('click', createExperiencia);
    document.getElementById('add-habilidade').addEventListener('click', addHabilidade);
    document.getElementById('habilidade-input').addEventListener('keypress', e => { if(e.key === 'Enter') { e.preventDefault(); addHabilidade(); } });
    document.getElementById('foto').addEventListener('change', handleFoto);
    document.getElementById('btn-generate-pdf').addEventListener('click', generatePDF);
    document.querySelectorAll('.template-card').forEach(c => c.addEventListener('click', () => selectTemplate(c.dataset.template)));
    document.getElementById('cv-form').addEventListener('input', updatePreview);
}

// Navegação
function goNext() {
    if (validateStep(state.step)) { state.step++; autoSaveDraft(); updateUI(); }
}
function goPrev() {
    if (state.step > 1) { state.step--; updateUI(); }
}

function updateUI() {
    document.querySelectorAll('.step').forEach((s, i) => s.classList.toggle('hidden', i + 1 !== state.step));
    document.querySelectorAll('.step-indicator').forEach((ind, i) => ind.classList.toggle('active', i + 1 === state.step));
    document.getElementById('btn-prev').classList.toggle('hidden', state.step === 1);
    document.getElementById('btn-next').classList.toggle('hidden', state.step === 5);
}

// Validação simplificada (foco na responsabilidade única)
function validateStep(step) {
    let isValid = true;
    if (step === 1) isValid = checkVal('nome', 3) && checkEmail('email') && checkTel('telefone') && checkVal('cidade', 3);
    else if (step === 2) isValid = checkVal('objetivo', 50);
    else if (step === 3) {
        isValid = state.formacoes > 0;
        document.getElementById('formacao-error').innerText = isValid ? '' : 'Adicione 1 formação.';
    } else if (step === 4) {
        isValid = state.experiencias > 0;
        document.getElementById('experiencia-error').innerText = isValid ? '' : 'Adicione 1 experiência.';
    }
    return isValid;
}

function checkVal(id, min) {
    const el = document.getElementById(id);
    const valid = el.value.trim().length >= min;
    const errorEl = el.closest('.input-group').querySelector('.error-msg');
    if (errorEl) errorEl.innerText = valid ? '' : `Mínimo ${min} caracteres.`;
    return valid;
}

function checkEmail(id) {
    const el = document.getElementById(id);
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
    const errorEl = el.closest('.input-group').querySelector('.error-msg');
    if (errorEl) errorEl.innerText = valid ? '' : 'Email inválido.';
    return valid;
}

function checkTel(id) {
    const el = document.getElementById(id);
    const valid = el.value.replace(/\D/g, '').length >= 10;
    const errorEl = el.closest('.input-group').querySelector('.error-msg');
    if (errorEl) errorEl.innerText = valid ? '' : 'Mínimo 10 dígitos numéricos.';
    return valid;
}

// Campos Dinâmicos e Habilidades
function createFormacao() {
    state.formacoes++;
    const div = document.createElement('div');
    div.className = 'dynamic-block';
    div.innerHTML = `<input type="text" placeholder="Curso" required><input type="text" placeholder="Instituição" required><button type="button" class="remove">X</button>`;
    div.querySelector('.remove').addEventListener('click', () => { div.remove(); state.formacoes--; });
    document.getElementById('formacao-container').appendChild(div);
}

function createExperiencia() {
    state.experiencias++;
    const div = document.createElement('div');
    div.className = 'dynamic-block';
    div.innerHTML = `<input type="text" placeholder="Empresa" required><input type="text" placeholder="Cargo" required><button type="button" class="remove">X</button>`;
    div.querySelector('.remove').addEventListener('click', () => { div.remove(); state.experiencias--; });
    document.getElementById('experiencia-container').appendChild(div);
}

function addHabilidade() {
    const v = document.getElementById('habilidade-input').value.trim();
    if (v.length >= 2 && !state.habilidades.includes(v) && state.habilidades.length < 20) {
        state.habilidades.push(v);
        document.getElementById('habilidade-input').value = '';
        renderHabilidades();
    }
}

function renderHabilidades() {
    const c = document.getElementById('habilidades-container');
    c.innerHTML = '';
    state.habilidades.forEach(h => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `${h} <span style="cursor:pointer;font-weight:bold;">X</span>`;
        chip.querySelector('span').addEventListener('click', () => {
            state.habilidades = state.habilidades.filter(i => i !== h);
            renderHabilidades();
        });
        c.appendChild(chip);
    });
}

// Foto, Templates e UI
function handleFoto(e) {
    const file = e.target.files[0];
    if (!file || file.size > 2097152) return alert("Apenas imagens até 2MB");
    const reader = new FileReader();
    reader.onload = ev => {
        state.fotoBase64 = ev.target.result;
        const img = document.getElementById('foto-preview');
        img.src = state.fotoBase64;
        img.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function selectTemplate(t) {
    state.template = t;
    document.querySelectorAll('.template-card').forEach(c => c.classList.toggle('active', c.dataset.template === t));
    updatePreview();
}

function toggleTheme() {
    const root = document.documentElement;
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function showToast(m) {
    const t = document.getElementById('toast');
    t.innerText = m; t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
}

// Rascunho e Preview
function autoSaveDraft() {
    try {
        const data = { nome: document.getElementById('nome').value, hb: state.habilidades, tmpl: state.template };
        localStorage.setItem('curriculo_rascunho', JSON.stringify(data));
    } catch (e) { console.error("Falha ao salvar", e); }
}

function checkDraft() {
    if (localStorage.getItem('curriculo_rascunho')) {
        document.getElementById('restore-banner').classList.remove('hidden');
        document.getElementById('btn-restore').addEventListener('click', () => {
            const d = JSON.parse(localStorage.getItem('curriculo_rascunho'));
            if (d.nome) document.getElementById('nome').value = d.nome;
            if (d.hb) { state.habilidades = d.hb; renderHabilidades(); }
            if (d.tmpl) selectTemplate(d.tmpl);
            document.getElementById('restore-banner').classList.add('hidden');
            updatePreview();
        });
        document.getElementById('btn-clear-draft').addEventListener('click', () => {
            localStorage.removeItem('curriculo_rascunho');
            document.getElementById('restore-banner').classList.add('hidden');
        });
    }
}

function updatePreview() {
    const p = document.getElementById('live-preview');
    p.className = `cv-preview template-${state.template}`;
    p.innerHTML = `<h2>${document.getElementById('nome').value || 'Nome Completo'}</h2><p>${document.getElementById('objetivo').value || ''}</p>`;
}

// Geração de PDF Assíncrona com jsPDF (Tratamento try/catch)
async function generatePDF() {
    if (state.habilidades.length < 3) return alert("Mínimo 3 habilidades!");
    const spin = document.getElementById('pdf-spinner');
    spin.classList.remove('hidden');
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 20;

        // Cabeçalho
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text(document.getElementById('nome').value || "Nome Completo", 15, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        const contactInfo = [
            document.getElementById('email').value,
            document.getElementById('telefone').value,
            document.getElementById('cidade').value,
            document.getElementById('linkedin').value
        ].filter(Boolean).join("  |  ");
        doc.text(contactInfo, 15, y);
        y += 12;
        doc.setTextColor(0);

        // Objetivo
        const objetivo = document.getElementById('objetivo').value;
        if (objetivo) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("Objetivo Profissional", 15, y);
            y += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            const objLines = doc.splitTextToSize(objetivo, 180);
            doc.text(objLines, 15, y);
            y += (objLines.length * 5) + 8;
        }

        // Experiência
        const exps = document.querySelectorAll('#experiencia-container .dynamic-block');
        if (exps.length > 0) {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("Experiência Profissional", 15, y);
            y += 6;
            exps.forEach(exp => {
                if (y > 270) { doc.addPage(); y = 20; }
                const inputs = exp.querySelectorAll('input');
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.text(inputs[1] ? inputs[1].value : '', 15, y);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.text(inputs[0] ? inputs[0].value : '', 15, y + 5);
                y += 12;
            });
            y += 4;
        }

        // Formação
        const forms = document.querySelectorAll('#formacao-container .dynamic-block');
        if (forms.length > 0) {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("Formação Acadêmica", 15, y);
            y += 6;
            forms.forEach(form => {
                if (y > 270) { doc.addPage(); y = 20; }
                const inputs = form.querySelectorAll('input');
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.text(inputs[0] ? inputs[0].value : '', 15, y);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.text(inputs[1] ? inputs[1].value : '', 15, y + 5);
                y += 12;
            });
            y += 4;
        }

        const habs = state.habilidades.map(h => [h]);
        if (habs.length > 0) {
            doc.autoTable({ 
                startY: y, 
                head: [['Habilidades']], 
                body: habs,
                theme: 'grid',
                headStyles: { fillColor: [108, 63, 197] }, // Cor primária
                styles: { fontSize: 11, cellPadding: 3 }
            });
        }
        
        let safeName = (document.getElementById('nome').value || 'curriculo').toLowerCase().replace(/\s+/g, '-');
        const filename = `curriculo_${safeName}_${Date.now()}.pdf`;
        
        // Método à prova de falhas para Chrome/Edge
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        
        // Aciona o download nativamente
        a.click();
        
        // Remove o elemento com atraso grande para não interromper a leitura do nome do arquivo
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 10000);
        
        showToast("Gerado com sucesso!");
        
    } catch (e) {
        console.error("Erro ao gerar PDF", e);
        alert("Erro na geração do arquivo. Verifique o console.");
    } finally {
        const spin = document.getElementById('pdf-spinner');
        if(spin) spin.classList.add('hidden');
    }
}

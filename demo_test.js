<script>
(function() {
  const form = document.getElementById('demoForm');
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const imageFile = document.getElementById('imageFile');
  const imageBase64 = document.getElementById('imageBase64');
  const modelSelect = document.getElementById('modelSelect');
  const scaleSelect = document.getElementById('scaleSelect');
  const outputSelect = document.getElementById('outputSelect');
  const inputPreview = document.getElementById('inputPreview');
  const outputPreview = document.getElementById('outputPreview');
  const responseViewer = document.getElementById('responseViewer');
  const responseBody = document.getElementById('responseBody');
  const loader = document.getElementById('loader');
  const curlExample = document.getElementById('curlExample');
  const jsonExample = document.getElementById('jsonExample');
  const endpoint = '/api/upscale';

  function updateExamples() {
    const model = modelSelect.value;
    const scale = scaleSelect ? scaleSelect.value : '';
    const output = outputSelect.value;
    const q = (scale ? `?model=${model}&scale=${scale}&output=${output}` : `?model=${model}&output=${output}`);

    curlExample.textContent = `curl -X POST http://localhost:3000${endpoint}${q} \\
  -F "image=@/path/to/image.png"`;

    jsonExample.textContent = JSON.stringify({
      image: 'data:image/png;base64,iVBORw0KGgo...',
      model: model,
      scale: scale || undefined,
      output: output,
    }, null, 2);
  }

  modelSelect.addEventListener('change', () => {
    const selected = modelSelect.value;
    const modelData = [{"id":"esrgan-slim","name":"ESRGAN Slim","package":"@upscalerjs/esrgan-slim","scales":["2x","3x","4x","8x"]},{"id":"esrgan-medium","name":"ESRGAN Medium","package":"@upscalerjs/esrgan-medium","scales":["2x","3x","4x"]},{"id":"esrgan-thick","name":"ESRGAN Thick","package":"@upscalerjs/esrgan-thick","scales":["2x","3x","4x"]},{"id":"esrgan-legacy","name":"ESRGAN Legacy","package":"@upscalerjs/esrgan-legacy","scales":["2x","3x","4x"]},{"id":"default-model","name":"Default Model","package":"@upscalerjs/default-model","scales":[]}].find(m => m.id === selected);
    if (scaleSelect && modelData && modelData.scales.length > 0) {
      scaleSelect.innerHTML = modelData.scales.map(s => `<option value="${s}">${s}</option>`).join('');
    }
    updateExamples();
  });

  if (scaleSelect) scaleSelect.addEventListener('change', updateExamples);
  outputSelect.addEventListener('change', updateExamples);
  updateExamples();

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  imageFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    inputPreview.innerHTML = `<img src="${url}" alt="input">`;
  });

  imageBase64.addEventListener('input', () => {
    const val = imageBase64.value.trim();
    if (!val) {
      inputPreview.innerHTML = 'No image selected';
      inputPreview.className = 'placeholder';
      return;
    }
    inputPreview.innerHTML = `<img src="${val.startsWith('data:') ? val : 'data:image/png;base64,' + val}" alt="input">`;
    inputPreview.className = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loader.style.display = 'inline-block';
    outputPreview.innerHTML = 'Processing...';
    outputPreview.className = 'placeholder';
    responseViewer.classList.add('hidden');

    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const model = modelSelect.value;
    const scale = scaleSelect ? scaleSelect.value : '';
    const output = outputSelect.value;
    const url = `${endpoint}?model=${encodeURIComponent(model)}&output=${encodeURIComponent(output)}${scale ? '&scale=' + encodeURIComponent(scale) : ''}`;

    try {
      let res;
      if (activeTab === 'file') {
        const fd = new FormData();
        fd.append('image', imageFile.files[0]);
        fd.append('model', model);
        if (scale) fd.append('scale', scale);
        fd.append('output', output);
        res = await fetch(url, { method: 'POST', body: fd });
      } else {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imageBase64.value.trim(),
            model,
            scale: scale || undefined,
            output,
          }),
        });
      }

      if (output === 'base64') {
        const data = await res.json();
        responseBody.textContent = JSON.stringify(data, null, 2);
        responseViewer.classList.remove('hidden');
        if (data.image) {
          outputPreview.innerHTML = `<img src="${data.image}" alt="output">`;
          outputPreview.className = '';
        }
      } else {
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        outputPreview.innerHTML = `<img src="${objUrl}" alt="output">`;
        outputPreview.className = '';
        responseBody.textContent = `Status: ${res.status} ${res.statusText}\nContent-Type: ${res.headers.get('content-type')}\nSize: ${blob.size} bytes`;
        responseViewer.classList.remove('hidden');
      }
    } catch (err) {
      outputPreview.innerHTML = `<span class="text-danger">Error: ${err.message}</span>`;
      outputPreview.className = 'placeholder';
    } finally {
      loader.style.display = 'none';
    }
  });
})();
</script>

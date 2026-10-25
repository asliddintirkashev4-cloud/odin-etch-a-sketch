const grid = document.querySelector('#grid');
const sizeField = document.querySelector('#size');
const modeField = document.querySelector('#mode');
const colorField = document.querySelector('#color');
const message = document.querySelector('#message');
let size = 16;
let activeIndex = 0;

function setActive(index) {
  const old = grid.querySelector('.active-cell');
  if (old) old.classList.remove('active-cell');
  activeIndex = index;
  if (document.activeElement === grid) grid.children[index].classList.add('active-cell');
}

function createGrid(newSize) {
  size = newSize;
  activeIndex = 0;
  const cells = document.createDocumentFragment();
  for (let index = 0; index < size * size; index += 1) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = index;
    cell.style.width = `${100 / size}%`;
    cell.style.height = `${100 / size}%`;
    cells.appendChild(cell);
  }
  grid.replaceChildren(cells);
  sizeField.value = size;
  document.querySelector('#dimensions').textContent = `${size} × ${size} · ${size * size} squares`;
  grid.setAttribute('aria-label', `${size} by ${size} drawing grid. Arrow keys move, space paints.`);
}

function paint(cell) {
  if (!cell || !cell.classList.contains('cell')) return;
  const mode = modeField.value;
  if (mode === 'eraser') {
    cell.style.backgroundColor = '#ffffff';
    delete cell.dataset.shade;
  } else if (mode === 'rainbow') {
    const channel = () => Math.floor(Math.random() * 256);
    cell.style.backgroundColor = `rgb(${channel()}, ${channel()}, ${channel()})`;
    delete cell.dataset.shade;
  } else if (mode === 'shade') {
    const shade = nextShade(cell.dataset.shade || 0);
    cell.dataset.shade = shade;
    cell.style.backgroundColor = `rgba(0, 0, 0, ${shade})`;
  } else {
    cell.style.backgroundColor = colorField.value;
    delete cell.dataset.shade;
  }
}

grid.addEventListener('pointerover', event => {
  if (event.pointerType !== 'touch') paint(event.target);
});
grid.addEventListener('pointerdown', event => { paint(event.target); grid.focus({preventScroll:true}); });
grid.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch' && event.buttons) {
    const cell = document.elementFromPoint(event.clientX,event.clientY);
    if (grid.contains(cell)) paint(cell);
  }
});
grid.addEventListener('focus', () => setActive(activeIndex));
grid.addEventListener('blur', () => { const cell=grid.querySelector('.active-cell'); if(cell) cell.classList.remove('active-cell'); });
grid.addEventListener('keydown', event => {
  if (['ArrowRight','ArrowLeft','ArrowDown','ArrowUp',' ','Enter'].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowRight') setActive(Math.min(size*size-1,activeIndex+1));
  if (event.key === 'ArrowLeft') setActive(Math.max(0,activeIndex-1));
  if (event.key === 'ArrowDown') setActive(Math.min(size*size-1,activeIndex+size));
  if (event.key === 'ArrowUp') setActive(Math.max(0,activeIndex-size));
  if (event.key === ' ' || event.key === 'Enter') paint(grid.children[activeIndex]);
});
const sizeDialog = document.createElement('dialog');
sizeDialog.setAttribute('aria-labelledby', 'grid-dialog-title');
sizeDialog.innerHTML = `<form id="grid-size-form"><h2 id="grid-dialog-title">Resize drawing grid</h2><p>Enter a whole number from 1 to 100. Resizing clears the canvas.</p><label for="new-grid-size">Squares per side</label><input id="new-grid-size" inputmode="numeric" autocomplete="off"><p id="grid-size-error" role="alert"></p><button type="submit">Create grid</button> <button type="button" id="cancel-grid-size">Cancel</button></form>`;
document.body.appendChild(sizeDialog);
const dialogSize = sizeDialog.querySelector('#new-grid-size');
const dialogError = sizeDialog.querySelector('#grid-size-error');
document.querySelector('#resize').addEventListener('click', () => {
  dialogSize.value = sizeField.value;
  dialogError.textContent = '';
  sizeDialog.showModal();
  dialogSize.focus();
  dialogSize.select();
});
sizeDialog.querySelector('#grid-size-form').addEventListener('submit', event => {
  event.preventDefault();
  const next = parseGridSize(dialogSize.value);
  if (next === null) { dialogError.textContent = 'Use a whole number between 1 and 100. Your drawing is unchanged.'; return; }
  createGrid(next);
  message.textContent = `New ${size} by ${size} grid created.`;
  sizeDialog.close();
});
sizeDialog.querySelector('#cancel-grid-size').addEventListener('click', () => { sizeField.value = size; sizeDialog.close(); });
sizeDialog.addEventListener('cancel', () => { sizeField.value = size; });
document.querySelector('#clear').addEventListener('click', () => { createGrid(size);message.textContent='Canvas cleared.'; });
sizeField.addEventListener('change', () => {
  const next = parseGridSize(sizeField.value);
  if (next === null) {
    sizeField.value = size;
    message.textContent = 'Use a whole number between 1 and 100. Your drawing is unchanged.';
    return;
  }
  createGrid(next);
  message.textContent = `New ${size} by ${size} grid created.`;
});
createGrid(16);

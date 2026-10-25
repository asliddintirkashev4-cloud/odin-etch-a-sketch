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
document.querySelector('#resize').addEventListener('click', () => {
  const answer = prompt('Squares per side? Enter a whole number from 1 to 100.',sizeField.value);
  if (answer === null) return;
  const next = parseGridSize(answer);
  if (next === null) { message.textContent='Use a whole number between 1 and 100. Your drawing is unchanged.'; return; }
  createGrid(next);
  message.textContent=`New ${size} by ${size} grid created.`;
});
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

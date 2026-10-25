# Etch-a-Sketch

The Odin Project Foundations project by Asliddin Tirkashev, RNU group 4230Z.

[Live project](https://asliddintirkashev4-cloud.github.io/odin-etch-a-sketch/) · [Assignment](https://www.theodinproject.com/lessons/foundations-etch-a-sketch)

## Run

Serve this folder with `python3 -m http.server 8765` and open http://localhost:8765. No build step or external dependencies are needed.

Run the logic tests with `npm test` or `node --test grid.test.cjs`.

## Files

`index.html` defines the interface. `style.css` uses Flexbox for the layout. The logic file contains the rules and validation; `app.js` connects them to DOM events and rendering.

## Plan

Validate a size from 1 to 100, create size squared divs, size them as a percentage and arrange them with Flexbox. Pointer events paint the target square. Rebuilding the grid keeps the same canvas dimensions. Rainbow, progressive darkening and eraser modes are included.

## Check in the browser

Draw with each mode. Resize to 64, then 100, then try invalid input. The canvas should stay the same size. Ten visits in darken mode should make a cell black. Clear the canvas and try arrow keys plus Space.

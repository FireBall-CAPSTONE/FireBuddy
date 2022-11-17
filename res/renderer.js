import init, {App} from "./pkg/fire_buddy_renderer.js";

// let timer = document.getElementById('fps');
let canvas = document.getElementById('canvas');

async function run() {
    await init();


    // start();

    let app = new App('canvas');
    
    var lastDrawTime = Date.now();
    var delta = 0.001;

    // app.render();

    function render() {
        
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;


        canvas.width = (window.innerWidth * .95) - 32;
        canvas.height = window.innerHeight * .88;
        
        app.update(delta/1000.0, canvas.height, canvas.width);
        app.render();

        const currTime = Date.now();
        delta = ((currTime - lastDrawTime));

        lastDrawTime = currTime;
        // timer.innerHTML = `${delta} ms`;

        requestAnimationFrame(render);
    }

    render();
}

await run();
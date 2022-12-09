import init, {App} from "./pkg/fire_buddy_renderer.js";

let canvas = document.getElementById('canvas');

async function run() {
    await init(); // Initialize the wasm package

    // Create a new renderer application instance
    // Pass in the ID of the canvas
    let app = new App('canvas');
    
    var lastDrawTime = Date.now();
    var delta = 0.001;

    // Rendering loop function
    function render() {
        
        // Get the new height and width for the canvas
        canvas.width = (window.innerWidth * .95) - 32;
        canvas.height = window.innerHeight * .88;
        
        // Call update and then render
        app.update(delta/1000.0, canvas.height, canvas.width);
        app.render();

        // Update delta time
        const currTime = Date.now();
        delta = ((currTime - lastDrawTime));
        lastDrawTime = currTime;

        // Next frame
        requestAnimationFrame(render);
    }

    // Populate the data
    $.ajax({
        url: 'https://ssd-api.jpl.nasa.gov/fireball.api',
        type: "GET",
        dataType: "json",
        data: {
        },
        success: function (result) {
            let numRendered = 0;
            console.log(result.data.length);
            for( let i = 0; i < result.data.length; i++ )
            {
                let lat = result.data[i][3];
                let south = result.data[i][4] == 'S';
                let lon = result.data[i][5];
                let west = result.data[i][6] == 'W';
                let alt = result.data[i][8];
                if(alt != null)
                {
                    let smod = -1;
                    let wmod = -1;
                    if (south)
                        smod = 1;
                    if (west)
                        wmod = 1;
                    app.add_fireball(lat * wmod, lon * smod, alt * 0.01);

                    numRendered ++;
                }
                    
            }
            console.log(numRendered);
        },
        error: function () {
            // do nothing for now
        }
    });

    render();
}

await run();
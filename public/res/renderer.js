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
    // for( let i = 0; i < 100; i ++ ) {
    //     //               // Lat                      // Long                      // Altitude
    //     app.add_fireball((Math.random() * 180) - 90, (Math.random() * 360) - 180, (Math.random() * .035) + .005);
    // }

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

    // Populate the data
    $.ajax({
        url: 'https://ssd-api.jpl.nasa.gov/fireball.api',
        type: "GET",
        dataType: "json",
        data: {
        },
        success: function (result) {
            for( let i = 0; i < result.data.length; i++ )
            {
                console.log(result.data[i]);
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
                }
                    
            }
        },
        error: function () {
            // do nothing for now
        }
    });

    render();
}

await run();
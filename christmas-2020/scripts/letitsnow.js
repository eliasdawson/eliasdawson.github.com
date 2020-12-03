(function() {
    let animationRequestId;

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function resetCanvas(ctx) {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    function makeGradient(ctx, size) {
        const n = size / 2;
        let gradient = ctx.createRadialGradient(n, n, 0, n, n, n);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        return gradient;
    }

    function makeSnowFlake(ctx, xOffset) {
        const size = getRandomIntInclusive(6, 12);
        const gradient = makeGradient(ctx, size);
        const ySpeed = getRandomIntInclusive(100, 500)/ 1000;
        const xSpeed = getRandomIntInclusive(-30, 30)/ 1000;
        let yOffset = getRandomIntInclusive(-ctx.canvas.height, -size);

        if (typeof xOffset !== 'number') {
            xOffset = getRandomIntInclusive(0, ctx.canvas.width - size);
        }

        return {
            size,
            gradient,
            ySpeed,
            xSpeed,
            xOffset,
            yOffset,
        };
    }

    function makeSnowFlakes(ctx) {
        const flakeCount = 1000;
        let snowFlakes = [];
        let xIncrement = ctx.canvas.width / flakeCount;
        for (let i=0;  i < flakeCount; i += 1) {
            snowFlakes.push(makeSnowFlake(ctx, xIncrement * i.toPrecision(2)));
        }
        return snowFlakes;
    }

    function isFlakeOnScreen(flake) {
        return (flake.yOffset > 0 - flake.size && flake.xOffset > 0 - flake.size)
    }

    function updateFlake(ctx, flake) {
        flake.yOffset += flake.ySpeed;
        flake.xOffset += flake.xSpeed;

        if (flake.yOffset > ctx.canvas.height) {
            flake.yOffset = -flake.size;
        }

        if (flake.xSpeed > 0) {
            if (flake.xOffset > ctx.canvas.width + flake.size) {
                flake.xOffset = 0;
            }
        } else if (flake.xSpeed < 0) {
            if (flake.xOffset < 0 - flake.size) {
                flake.xOffset = ctx.canvas.width + flake.size;
            }
        }
    }

    function draw(ctx, snowFlakes) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        snowFlakes.forEach(function(flake) {
            ctx.save();
            ctx.translate(flake.xOffset, flake.yOffset);
            if (isFlakeOnScreen(flake)) {
                ctx.fillStyle = flake.gradient;
                ctx.fillRect(0, 0, flake.size, flake.size);
            }
            updateFlake(ctx, flake);
            ctx.restore();
        });

        animationRequestId = window.requestAnimationFrame(draw.bind(null, ctx, snowFlakes));
    }

    function startSnowing(ctx) {
        if (animationRequestId !== undefined) {
            window.cancelAnimationFrame(animationRequestId);
        }

        resetCanvas(ctx);
        let snowFlakes = makeSnowFlakes(ctx);
        draw(ctx, snowFlakes);
    }

    function makeContainer() {
        const output = document.createElement('canvas');
        output.style.position = 'fixed';
        output.style.width = '100%';
        output.style.height = '100%';
        output.style.top = 0;
        output.style.left = 0;
        return output;
    }

    function letItSnow() {
        const output = makeContainer();
        document.body.appendChild(output);

        let ctx = output.getContext('2d');

        setTimeout(function() {
            window.addEventListener('resize', startSnowing.bind(null, ctx));
            startSnowing(ctx);
        }, 2000);
    }

    if (document.readyState !== 'loading') {
        letItSnow();
    } else {
        window.document.addEventListener('DOMContentLoaded', letItSnow);
    }
})();

const targets = [];
const data = [];
const CONNECT_DIST = 100;
const SILVER = getComputedStyle(document.documentElement).getPropertyValue("--silver");
const B64_CHARS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];

class TitleData {
    constructor(ctx, headingEffect) {
        this.ctx = ctx;
        this.particles = [];
        this.heading = ctx.canvas.nextElementSibling;
        
        for(let i = 0; i < (this.ctx.canvas.width + CONNECT_DIST * 2) * (this.ctx.canvas.height + CONNECT_DIST * 2) * 0.0001; i++) {
            this.particles.push(new TitleParticle(this.ctx));
        }
        
        if(headingEffect) {
            let originalStr = this.heading.innerHTML;
            for(let i = 0; i < originalStr.length; i++) {
                this.heading.innerHTML = this.heading.innerHTML.replaceAt(i, B64_CHARS[Math.floor(Math.random() * 64)]);
            }
            
            this.renderHeadingChar(0, originalStr, 0);
        }
    }
    
    update() {
        this.particles.forEach((p) => p.update());
    }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.particles.forEach((p) => p.render(this.particles));
    }
    renderHeadingChar(i, originalStr, depth) {
        let isDone = Math.random() < 0.2 || depth >= 10;
        
        let newI, newDepth;
        if(isDone) {
            this.heading.innerHTML = this.heading.innerHTML.replaceAt(i, originalStr[i]);
            
            if(i === originalStr.length - 1) return;
            newI = i + 1;
            newDepth = 0;
        }
        else {
            this.heading.innerHTML = this.heading.innerHTML.replaceAt(i, B64_CHARS[Math.floor(Math.random() * 64)]);
            newI = i;
            newDepth = depth + 1;
        }
        
        setTimeout(() => this.renderHeadingChar(newI, originalStr, newDepth), 20);
    }
}
class TitleParticle {
    constructor(ctx) {
        this.ctx = ctx;
        this.z = Math.random() * 0.2 + 0.2; //0.2 <= n < 0.4
        this.pos = {
            x: Math.random() * (this.ctx.canvas.width + CONNECT_DIST * 2) - CONNECT_DIST,
            y: Math.random() * (this.ctx.canvas.height + CONNECT_DIST * 2) - CONNECT_DIST
        };
        this.dir = {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1
        };
    }
    update() {
        this.pos.x += this.dir.x * 1.2;
        this.pos.y += this.dir.y * 1.2;
        
        if(this.pos.x < -CONNECT_DIST) this.pos.x += this.ctx.canvas.width + CONNECT_DIST * 2;
        if(this.pos.x > this.ctx.canvas.width + CONNECT_DIST) this.pos.x -= this.ctx.canvas.width + CONNECT_DIST * 2;
        if(this.pos.y < -CONNECT_DIST) this.pos.y += this.ctx.canvas.height + CONNECT_DIST * 2;
        if(this.pos.y > this.ctx.canvas.height + CONNECT_DIST) this.pos.y -= this.ctx.canvas.height + CONNECT_DIST * 2;
    }
    render(particles) {
        this.ctx.globalAlpha = this.z;
        
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = SILVER;
        this.ctx.fill();
        
        this.ctx.globalAlpha = 0.1;
        this.ctx.strokeStyle = SILVER;
        this.ctx.beginPath();
        for(let p of particles) {
            if(p === this || p.pos.x < this.pos.x - CONNECT_DIST || p.pos.x > this.pos.x + CONNECT_DIST || p.pos.y < this.pos.y - CONNECT_DIST || p.pos.y > this.pos.y  + CONNECT_DIST) continue;
            
            if(Math.pow(this.pos.x - p.pos.x, 2) + Math.pow(this.pos.y - p.pos.y, 2) > CONNECT_DIST * CONNECT_DIST) continue;
            
            this.ctx.moveTo(this.pos.x, this.pos.y);
            this.ctx.lineTo(p.pos.x, p.pos.y);
        }
        this.ctx.stroke();
    }
}

for(const t of document.getElementsByClassName("titleBG")) {
    t.width = parseInt(getComputedStyle(t).getPropertyValue("width").replace("px", ""));
    t.height = parseInt(getComputedStyle(t).getPropertyValue("height").replace("px", ""));
    
    let ctx = t.getContext("2d");
    targets.push(ctx);
    data.push(new TitleData(ctx, true));
}

function update() {
    for(const d of data) {
        d.update();
    }
    
    requestAnimationFrame(() => {requestAnimationFrame(() => {update(); render();});});
}
function render() {
    for(let i = 0; i < targets.length; i++) {
        data[i].render();
    }
}

requestAnimationFrame(() => {update(); render();});

window.addEventListener("resize", () => {
    for(let i = 0; i < targets.length; i++) {
        let canvas = targets[i].canvas;
        
        canvas.width = parseInt(getComputedStyle(canvas).getPropertyValue("width").replace("px", ""));
        canvas.height = parseInt(getComputedStyle(canvas).getPropertyValue("height").replace("px", ""));
        
        data[i] = new TitleData(targets[i], false);
    }
})

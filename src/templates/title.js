const targets = [];
const data = [];
const CONNECT_DIST = 100;
const SILVER = getComputedStyle(document.documentElement).getPropertyValue("--silver");

class TitleData {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
        
        for(let i = 0; i < (this.ctx.canvas.width + CONNECT_DIST * 2) * (this.ctx.canvas.height + CONNECT_DIST * 2) * 0.00015; i++) {
            this.particles.push(new TitleParticle(this.ctx));
        }
    }
    
    update() {
        this.particles.forEach((p) => p.update());
    }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.particles.forEach((p) => p.render(this.particles));
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
    data.push(new TitleData(ctx));
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

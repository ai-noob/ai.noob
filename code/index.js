const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
var balls, c, v, r, color = "rgba(255, 255, 255, 1)", lines, mouseLines

var mouse = {
    x: 0,
    y: 0
}

canvas.height = window.innerHeight
canvas.width  = window.innerWidth

window.addEventListener('resize', e=> {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    init()
})

window.addEventListener('mousemove', e=>{
    mouse.x = e.x
    mouse.y = e.y
})

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
    )
}

class Circle {
    constructor(centre, radius, velocity, color, ctx, canv){
        this.centre = centre
        this.radius = radius
        this.velocity = velocity
        this.color = color   
        this.ctx = ctx
        this.canvas = canv
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.centre.x, this.centre.y, this.radius, 0, 2 * Math.PI, true)
        this.ctx.fillStyle = this.color
        this.ctx.fill()
        this.ctx.closePath()
    }

    update() {
        if(this.centre.x <= this.radius || this.centre.x >= this.canvas.width - r){
            this.velocity.x *= -1
        }

        if (this.centre.y <= this.radius || this.centre.y >= this.canvas.height - r) {
            this.velocity.y *= -1
        }

        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y

        this.draw()
    }

}

class Line {
    constructor(p1, p2, clr, ctx){
        this.p1 = p1
        this.p2 = p2
        this.color = clr
        this.ctx = ctx
        this.opacity = 0.1
    }

    draw() {
        this.ctx.lineWidth = 3
        this.ctx.beginPath()
        this.ctx.moveTo(this.p1.x, this.p1.y)
        this.ctx.lineTo(this.p2.x, this.p2.y)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
        this.ctx.closePath()
    }

    getLength() {
        return distance(this.p1, this.p2)
    }
}

function connect(obj_array, ctx){
    let line_array = []

    for(var i = 0; i < obj_array.length; i++){
        for(var j=i+1; j < obj_array.length; j++){
            line_array.push(new Line(obj_array[i].centre, obj_array[j].centre, color, ctx))
            
        }
    }

    return line_array
}

function mouseConnect(m, obj_array, ctx) {
    let l_arr = []
    obj_array.forEach(obj => {
        l_arr.push(new Line(m, obj.centre, color, ctx))
    })
    return l_arr
}


function init(){
    balls = []
    r = 5

    for (var i = 0; i < 40; i++) {
        c = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }
        v = { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 }
        balls.push(new Circle(c, r, v, "#ffffff", context, canvas))
    }

    lines = connect(balls, context)
    mouseLines = mouseConnect(mouse, balls, context)
}

function animate(){
    context.clearRect(0, 0, canvas.width, canvas.height)

    balls.forEach(ball => {
        ball.update()
    })

    lines.forEach(line=>{
        if(line.getLength() > 150 && line.opacity > 0){
            line.opacity -= 0.01
            line.color = "rgba(255, 255, 255, "+line.opacity+")"
        } 
        else if (line.getLength() < 150 && line.opacity < 1){
            // console.log("true")
            line.opacity += 0.01
            line.color = "rgba(255, 255, 255, " + line.opacity + ")"
        }
        line.draw()
    })

    mouseLines.forEach(line => {
        if (line.getLength() > 100 && line.opacity > 0) {
            line.opacity -= 0.03
            line.color = "rgba(255, 255, 255, " + line.opacity + ")"
        }
        else if (line.getLength() < 100 && line.opacity < 1) {
            // console.log("true")
            line.opacity += 0.04
            line.color = "rgba(255, 255, 255, " + line.opacity + ")"
        }
        line.draw()
    })

    connect(balls, context)
    window.requestAnimationFrame(animate)
}


init()
animate()
const app = Vue.createApp({
    data() {
        return {
            innerLabels: [6, 12, 19, 25, 31, 38],
            labels: {
                6: "B",
                12: "C",
                19: "D",
                25: "E",
                31: "F",
                38: "A"
            },
            spinTimes: 20,
            spinSpeed: '10s',
            spinToDegree: 0,
            rotate: 0,

            canvas: null,
            littleCanvas: null,
            
            segments: 38,
            depth: 200,

            lotto: 10,

        }
    },
    methods: {
        showLabel(index) {
            return this.innerLabels.includes(index)
        },

        spinWheel() {  

            let tilt = this.mapNumberToWheel( this.lotto )
            tilt = this.fallWithinRange(tilt - (360/38/2), tilt + (360/38/2))
    
            this.rotate += Math.ceil(tilt);
            this.spinToDegree = this.rotate;
            this.rotate += Math.ceil(360 * this.spinTimes + (360 - tilt));
        },

        mapNumberToWheel(number) {
            return Math.abs(38 - number) * (360 / 38)
        },

        fallWithinRange(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
        },
        
        drawWheel(canvas, depth, colors, stroke=false, inner=false) {

            const context = canvas.getContext('2d')
            const x = canvas.width / 2;
            const y = canvas.height / 2;

            this.drawSegments(context, depth, {x: x, y: y}, colors, stroke, inner)
        },

        drawSegments(context, depth, center, colors, stroke=false, inner=false) {

            let start = 0
            // Array(this.segments).keys().forEach(function (_, i) 
            for(let i = 0; i < this.segments; i++) {

                context.beginPath()
                context.moveTo(center.x, center.y)
                context.arc(center.x, center.y, depth, start, start + this.angle, false)
                context.fillStyle = i % 2 === 0 ? colors[0] : colors[1]

                if(inner) {
                    context.fillStyle = (i >= 0 && i < 6) || (i >= 13 && i < 19) || (i > 25 && i < 32) ? 
                                    colors[0] : colors[1];
                    context.lineWidth = 1.5;
                    context.strokeStyle = (i >= 0 && i < 6) || (i >= 13 && i < 19) || (i > 25 && i < 32) ? 
                                    colors[0] : colors[1];
                    console.log(colors[0])
                    context.stroke();
                }

                if(i === 6 || i === 25) {
                    context.fillStyle = inner ? '#b47935' : 'green';
                    context.lineWidth = 1.5;
                    context.strokeStyle = inner ? '#b47935' : 'green';
                    context.stroke(); 
                }

                context.fill();

                if(stroke) {
                    context.lineWidth = 2;
                    context.strokeStyle = '#444';
                    context.stroke();
                }

                start += this.angle
            }
        }
    },

    computed: {
        angle: function() {
            return 2 * Math.PI / this.segments
        }
    },

    created() {
        this.rotate = Math.ceil(360 * this.spinTimes)
    },

    mounted() {

        this.canvas = this.$refs['big-wheel']
        this.littleCanvas = this.$refs['little-wheel']

        console.log(this.canvas.width, "canvas")
    
        this.drawWheel(this.canvas, this.depth, ['red', 'black'])
        this.drawWheel(this.littleCanvas, this.depth - 105, ['#d0b58f', '#f6e9e0'], stroke=false, inner=true)

    }
})
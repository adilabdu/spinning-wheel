const app = Vue.createApp({
    data() {
        return {
            numbers: [
                30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 
                3, 24, 36, 13, 1, 0, 27, 10, 25, 29, 
                12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 
                23, 35, 14, 2, 0, 28, 9, 26
            ],
            innerLabels: [6, 12, 19, 25, 31, 38],
            labels: {
                6: "B",
                12: "C",
                19: "D",
                25: "E",
                31: "F",
                38: "A"
            },
            displayNumber: 30,

            spinTimes: 30,
            spinSpeed: 10,
            spinToDegree: 0,
            rotate: 0,

            deckSize: window.innerHeight > window.innerWidth ?
                window.innerWidth - 10 :
                window.innerHeight - 10,
            canvas: null,
            littleCanvas: null,
            
            segments: 38,
            depth: Number,
            littleDepth: 0,

            lotto: 20,   // Pass the winner number to this data.
                        // It accepts all integers, but returns unpredictable
                        // results for numbers outside [0, 36] range
                        // Pass 0 to fall under one of the green zones.

        }
    },

    methods: {
        showLabel(index) {
            return this.innerLabels.includes(index)
        },

        spinWheel() {  

            let tilt = this.mapNumberToWheel( 
                this.lotto === 0 ? 
                    this.numbers.indexOf(
                        this.lotto, 
                        [0, 20][this.fallWithinRange(0, 1)]) + 1 : 
                    this.numbers.indexOf(this.lotto) + 1 
                )

            tilt = this.fallWithinRange(tilt - (360 / this.segments / 2), tilt + (360 / this.segments / 2))
    
            this.rotate += Math.ceil(tilt);
            this.spinToDegree = this.rotate;
            this.rotate += Math.ceil(360 * this.spinTimes + (360 - tilt));
            this.spinNumber()
        },

        async spinNumber() {

            for(_ in [...Array(this.spinTimes).keys()]) {
                for(i in this.numbers) {
                    this.displayNumber = this.numbers[i]
                    await this.timeout(this.spinSpeed / this.segments / this.spinTimes * 1000)
                }
            }

        },

        timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        greenZone(index) {

            return index === 0
        },

        mapNumberToWheel(number) {

            return Math.abs(this.segments - number) * (360 / this.segments)
        },

        fallWithinRange(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        
        drawWheel(canvas, depth, colors, stroke=false, inner=false) {

            const context = canvas.getContext('2d')
            const x = canvas.width / 2;
            const y = canvas.height / 2;

            this.drawSegments(context, depth, {x: x, y: y}, colors, stroke, inner)
        },

        drawSegments(context, depth, center, colors, stroke=false, inner=false) {

            let start = 0
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

    watch: {
    },

    created() {
        this.rotate = Math.ceil(360 * this.spinTimes)
    },

    mounted() {
        this.canvas = this.$refs['big-wheel']
        this.littleCanvas = this.$refs['little-wheel']

        this.depth = this.deckSize / 2.5
        this.littleDepth = this.depth / 2
    
        this.drawWheel(this.canvas, this.depth, ['black', 'red'])
        this.drawWheel(this.littleCanvas, this.littleDepth, ['#d0b58f', '#f6e9e0'], stroke=false, inner=true)
    }
})
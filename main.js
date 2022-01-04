const app = Vue.createApp({
    data() {
        return {
            greetings: "Hello Vue!",
            innerLabels: [6, 12, 19, 25, 31, 38],
            labels: {
                6: "B",
                12: "C",
                19: "D",
                25: "E",
                31: "F",
                38: "A"
            }
        }
    },
    methods: {
        showLabel(index) {
            return this.innerLabels.includes(index)
        }
    }
})
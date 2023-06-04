## Setup code

Time {{ time }}

:: setup { lazy="true" }
import { ref } from 'vue'
import moment from "npm:moment"

const time = ref(moment().format('YYYY-MM-DD HH:mm:ss'))

function setTime(){
    time.value = moment().format('YYYY-MM-DD HH:mm:ss')
}

setInterval(setTime, 1000)
::
 
# Headings

# Heading 1

## Heading 2

### Heading 3

#### Heading 4
 
## Paragraph

Hello word
 
## Code

:: script
for (let i = 0;i < 10; i++) {
    console.log('count', i)
}
::

 
## Buttons

:: button
    Default
::

:: button { color="warn" }
    Warning
::

:: button { color="danger" }
    Danger
::
 
## Charts
 
:: chart
import { useChart } from 'app:chart'

const chart = useChart()

const data = [20,30,60,80,90,145]

chart.type = 'bar'

chart.data = {
    labels: data,
    datasets: [
        {
            label: 'Update titles',
            data,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(201, 203, 207, 1)'
            ]
        }
    ]
}
::



:: chart {
    align="center"
}
import { useChart } from 'app:chart'

const chart = useChart()

const data = [20,30,60,80,90,145]

chart.type = 'pie'

chart.data = {
    labels: data,
    datasets: [
        {
            label: 'Update titles',
            data,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(201, 203, 207, 1)'
            ]
        }
    ]
}
::


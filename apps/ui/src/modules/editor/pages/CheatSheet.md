# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
 
## Paragraph

Normal text

*Italic text*

**Bold text**

~~Strikethrough text~~

<u>Underline text</u>

 
## Text Colorful

[accent]{ style="color: rgb(var(--accent))" }
[info]{ style="color: rgb(var(--info))" }
[danger]{ style="color: rgb(var(--danger))" }
[warn]{ style="color: rgb(var(--warn))" }
[custom]{ style="color: #8b5cf6" }
 
## Text Colorful with bold

[accent with **bold**]{ style="color: rgb(var(--accent))" }
[info with **bold**]{ style="color: rgb(var(--info))" }
[danger with **bold**]{ style="color: rgb(var(--danger))" }
[warn with **bold**]{ style="color: rgb(var(--warn))" }
[custom with **bold**]{ style="color: #8b5cf6" }
 
## Code

:: script
for await (const i of [...Array(5).keys()]) {
    console.log('count', i)    
    await new Promise(resolve => setTimeout(resolve, 500))
}
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
    width="300"
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


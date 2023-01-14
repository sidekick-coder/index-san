<s-chart height="300">

```ts
setResult({
    type: 'bar',
    data: {
        labels: Moment.months(),
        datasets: [
            {
                label: 'Dataset',
                data: Moment.months().map(() => Math.random() * 100),
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
    },
})
```
</s-chart>

<br />

<s-chart height="300">

```ts
setResult({
    type: 'pie',
    data: {
        labels: ['Red', 'Orange', 'yellow', 'blue'],
        datasets: [
            {
                label: 'Dataset',
                data: [20, 20, 10, 40],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ]
            }
        ]
    },
})
```
</s-chart>

<br />

<s-chart height="300">

```ts
const repository = await Facades.item
    .createRepositoryFromWorkspace(Workspace, 'todos')

const items = await repository.list()

const done = items.filter(i => i.done)

setResult({
    type: 'pie',
    data: {
        labels: ['Done', 'Todo'],
        datasets: [
            {
                label: 'Dataset',
                data: [done.length, items.length - done.length],
                backgroundColor: [
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)'
                ]
            }
        ]
    },
})
```
</s-chart>

<br />
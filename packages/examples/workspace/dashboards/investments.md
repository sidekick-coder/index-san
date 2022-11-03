# Investments
Investments management template

## Extract
This shows the lasts entries

<br>

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
>
    <is-table :limit="5"  :aggregations="['count', null, null, 'sum']" />
</is-collection>

## Portfolios
Items chart separated by portfolio

<br>

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
    class="d-flex w-full"
>
    <is-chart
        title="investments"
        group-by="portfolio"
        group-by-value="value"
       class="w-2/12"
        type="pie"
    />
</is-collection>


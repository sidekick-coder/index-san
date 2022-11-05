# Investments
Investments management template

## Extract
<is-collection
    workspace-id="example"
    collection-id="investments-extract"
>
    <is-table :limit="5"  :aggregations="['count', null, null, 'sum']" />
</is-collection>

## Assets

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
    class="flex w-full bg-zinc-800 rounded p-4"
    style="max-width:1000px"  
>
    <is-chart-pie 
        value-key="value"
        value-suffix="%" 
        group-by="asset"
        percentage
        width="30%" 
         :show-legend="false"
    />
    <is-chart-bar value-key="value" group-by="asset" width="70%" />
</is-collection>

## Portfolios

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
   class="flex w-full bg-zinc-800 rounded p-4"
    style="max-width:1000px"  
>
    <is-chart-pie
        value-key="value"
        value-suffix="%"
        group-by="portfolio"
        percentage width="30%"
        :show-legend="false"
    />
    <is-chart-bar value-key="value" group-by="portfolio" width="70%" />
</is-collection>


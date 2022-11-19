# Investments
Investments management template

## Extract
<is-collection
    workspace-id="example"
    collection-id="investments-extract"
    view-id="extract"
>
    <is-table :limit="5" />
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
    view-id="portifolio"
   class="flex w-full bg-zinc-800 rounded p-4"
    style="max-width:1000px"  
>
    <is-chart-pie
        value-key="value"
        value-suffix="%"
        group-by="portfolio"
        percentage
        width="30%"
        :show-legend="false"
    />
    <is-chart-bar value-key="value" group-by="portfolio" width="70%" />
</is-collection>


## Real state

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
    view-id="real-state"
   class="flex w-full bg-zinc-800 rounded p-4"
    style="max-width:500px"  
>
    <is-chart-pie value-key="value" group-by="asset" width="100%" />
</is-collection>

## Crypto

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
    view-id="crypto"
   class="flex w-full bg-zinc-800 rounded p-4"
    style="max-width:500px"  
>
    <is-chart-pie value-key="value" group-by="asset" width="50%" />
    <is-chart-pie value-key="value" group-by="asset" percentage value-suffix="%" width="50%" />
</is-collection>
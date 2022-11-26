# Chart Pie

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
    class="flex w-full bg-b-primary rounded p-4"
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
</is-collection>

# Chart bar

<is-collection
    workspace-id="example"
    collection-id="investments-extract"
    class="flex w-full bg-b-primary rounded p-4"
    style="max-width:1000px"  
>
    <is-chart-bar value-key="value" group-by="asset" width="100%" />
</is-collection>
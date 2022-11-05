<script lang="ts">
export default {
    name: 'IsCollectionFilter',
    props: {
        field: {
            type: String,
            required: true
        },
        value: {
            type: String,
            default: ''
        },
    }
}

</script>
import { ref } from 'vue'
import useCase from 'composables/use-case'

export default {
  props: {
    item: {
      type: Object,
    },
  },
  template: `
        <w-data-table
            :items='items'
            :columns='columns'
            :modify="modify"
            enable-navigation
            navigation-cell-selector=".cell"
        >

        <template #item-name="{ item: i }">
            <input
                :value="i.name"
                class="cell px-4 bg-white h-full w-full outline-none focus:bg-accent/10 focus:border-accent border-[transparent] border border-b-gray-200"
                type="text"
            />
        </template>
        
        </w-data-table>
    `,
  setup(props) {
    const items = ref([])

    const columns = [
      {
        name: 'name',
        label: 'Name',
        width: '100px',
        field: 'name',
      },
    ]

    function setItems() {
      useCase('list-items', {
        workspaceId: props.item.workspaceId,
        path: props.item.path,
      }).then((data) => (items.value = data))
    }

    function modify(builder) {
      builder.child('td').remove('p-2').remove('border-b').static('p-0 h-[40px]')
      builder.child('th').remove('p-2').static('px-4 h-[40px]')
    }

    setItems()

    return {
      modify,
      columns,
      items,
    }
  },
}

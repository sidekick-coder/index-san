import { useVueWind } from 'vue-wind'

const VWind = useVueWind()

export default ({ app }) => {
  app.use(VWind)
}

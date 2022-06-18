export interface MetaRelation {
  type: 'belongs-to' | 'has-many'
  name: string
  where?: { [key: string]: any }
}
export default class Metadata {
  [key: string]: any
  public relations?: MetaRelation[] = []
}

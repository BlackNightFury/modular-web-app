import Antd from '@/components/EliasMwaComponents/DataCollection/Pages/UntaggedAssets'
import SpaceGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/SpaceGQLWrapper'

export default SpaceGQLWrapper(Antd, false, { untagged: true })

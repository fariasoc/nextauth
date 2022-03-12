import { setupAPIClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"
import decode from 'jwt-decode'

export default function Metrics() {

  return (
    <>
    <h1>Métrics</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')
  console.log(response.data)



  return {
    props: {}
  }
})
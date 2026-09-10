import { Loader } from "@medusajs/framework/types"
import setupShippingCustomCronJobs from "./cron-jobs"

const shippingCustomLoader: Loader = async ({ container }) => {
  await setupShippingCustomCronJobs({ container })
}

export default shippingCustomLoader
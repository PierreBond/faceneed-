import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const adminGuard = async (req: MedusaRequest, res: MedusaResponse, next: () => void) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const authIdentity = req.auth_identity

  if (!authIdentity?.actor_id) {
    return res.status(401).json({ error: "Authentication required" })
  }

  try {
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "metadata"],
      filters: { id: authIdentity.actor_id },
    })

    const customer = customers[0]
    
    if (!customer || customer.metadata?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" })
    }

    req.adminUser = customer
    next()
  } catch (error) {
    console.error("Admin guard error:", error)
    return res.status(500).json({ error: "Authorization check failed" })
  }
}

export const optionalAdmin = async (req: MedusaRequest, res: MedusaResponse, next: () => void) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const authIdentity = req.auth_identity

  if (authIdentity?.actor_id) {
    try {
      const { data: customers } = await query.graph({
        entity: "customer",
        fields: ["id", "email", "metadata"],
        filters: { id: authIdentity.actor_id },
      })

      const customer = customers[0]
      if (customer?.metadata?.role === "admin") {
        req.adminUser = customer
      }
    } catch (error) {
      console.error("Optional admin check error:", error)
    }
  }

  next()
}
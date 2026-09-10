import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const fileModule = req.scope.resolve("file")
  const { id } = req.params

  try {
    // In Medusa v2, files are typically uploaded via presigned URLs
    // This endpoint generates a presigned URL for direct upload to storage
    
    const { files } = req.body as { files: Array<{ filename: string; content_type: string }> }
    
    if (!files || !files.length) {
      return res.status(400).json({ error: "No files provided" })
    }

    const uploadUrls = await Promise.all(
      files.map(async (file) => {
        const upload = await fileModule.createUploadUrls([{
          filename: file.filename,
          contentType: file.content_type,
          access: "public",
        }])
        return upload[0]
      })
    )

    res.json({ upload_urls: uploadUrls })
  } catch (error) {
    console.error("Error creating upload URLs:", error)
    res.status(500).json({ error: "Failed to create upload URLs" })
  }
}
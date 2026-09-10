import Resend from "resend"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export class NotificationService {
  private resend: Resend | null = null
  private fromEmail: string

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    this.fromEmail = process.env.RESEND_FROM_EMAIL || "Faceneed <orders@faceneed.com>"
    
    if (apiKey) {
      this.resend = new Resend(apiKey)
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.resend) {
      console.warn("Resend not configured, skipping email:", options.subject)
      return false
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      return false
    }
  }

  async notifyFeeUpdate(window: { id: string; district: string; order_ids: string[] }, finalFee: number): Promise<void> {
    const feeGhs = (finalFee / 100).toFixed(2)
    const baseFeeGhs = 15.00
    const isHigher = finalFee > 1500

    const subject = `Your Faceneed Shared Delivery Fee: ₵${feeGhs}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; border-radius: 12px; padding: 32px;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Shared Delivery Update</h1>
            
            <p style="font-size: 16px; margin-bottom: 24px;">Your shared delivery to <strong>${window.district}</strong> has been finalized.</p>
            
            <div style="background: white; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #6b7280;">Final Shared Delivery Fee</span>
                <span style="font-size: 28px; font-weight: 700; color: #1a1a1a;">₵${feeGhs}</span>
              </div>
              <p style="font-size: 13px; color: #6b7280; margin-top: 8px;">
                ${isHigher 
                  ? `The fee is slightly higher than the minimum ₵${baseFeeGhs.toFixed(2)} due to logistics costs for ${window.order_ids.length} orders.`
                  : `You're paying the minimum shared delivery fee of ₵${baseFeeGhs.toFixed(2)}!`
                }
              </p>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">What happens next:</p>
            <ul style="font-size: 14px; color: #4b5563; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Your order will be grouped with ${window.order_ids.length - 1} other order(s) to ${window.district}</li>
              <li style="margin-bottom: 8px;">Our logistics team will coordinate pickup and delivery</li>
              <li style="margin-bottom: 8px;">You'll receive tracking information once dispatched</li>
            </ul>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
            
            <p style="font-size: 13px; color: #9ca3af; text-align: center;">
              Questions? Reply to this email or contact support@faceneed.com
            </p>
          </div>
        </body>
      </html>
    `

    for (const orderId of window.order_ids) {
      // In production, fetch customer email from order
      // For now, we'd need to integrate with Medusa's order service
      // This is a placeholder - actual implementation would fetch real emails
      console.log(`Would send fee update email for order ${orderId} to ${window.district}`)
    }
  }

  async notifyWindowOpened(district: string, customerEmails: string[]): Promise<void> {
    const subject = `Shared Delivery Available to ${district} - Join Now!`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f0fdf4; border-radius: 12px; padding: 32px; border: 1px solid #bbf7d0;">
            <h1 style="color: #166534; font-size: 24px; margin-bottom: 16px;">🚚 Shared Delivery Open!</h1>
            
            <p style="font-size: 16px; margin-bottom: 24px;">A shared delivery window to <strong>${district}</strong> is now open.</p>
            
            <div style="background: white; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <p style="font-size: 14px; color: #374151; margin-bottom: 12px;">
                Join <strong>5+ orders</strong> to unlock shared delivery from <strong>₵15.00</strong> (vs ₵40.00 express)
              </p>
              <p style="font-size: 13px; color: #6b7280;">Window closes in 24 hours. The more orders, the lower the fee per person!</p>
            </div>

            <a href="https://faceneed.com/checkout" 
               style="display: inline-block; background: #166534; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Complete Your Order
            </a>

            <hr style="border: none; border-top: 1px solid #dcfce7; margin: 24px 0;">
            
            <p style="font-size: 13px; color: #9ca3af; text-align: center;">
              Faceneed - Beauty delivered
            </p>
          </div>
        </body>
      </html>
    `

    for (const email of customerEmails) {
      await this.sendEmail({ to: email, subject, html })
    }
  }

  async notifyInsufficientOrders(district: string, customerEmails: string[]): Promise<void> {
    const subject = `Update: Your Shared Delivery to ${district}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #fef2f2; border-radius: 12px; padding: 32px; border: 1px solid #fecaca;">
            <h1 style="color: #991b1b; font-size: 24px; margin-bottom: 16px;">Shared Delivery Not Available</h1>
            
            <p style="font-size: 16px; margin-bottom: 24px;">We didn't reach the minimum 5 orders for shared delivery to <strong>${district}</strong>.</p>
            
            <div style="background: white; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <p style="font-size: 14px; color: #374151; margin-bottom: 12px;">
                Your order has been automatically upgraded to <strong>Express Delivery (₵40.00)</strong> at no extra charge.
              </p>
              <p style="font-size: 13px; color: #6b7280;">You'll receive your order faster with express shipping!</p>
            </div>
          </div>
        </body>
      </html>
    `

    for (const email of customerEmails) {
      await this.sendEmail({ to: email, subject, html })
    }
  }
}
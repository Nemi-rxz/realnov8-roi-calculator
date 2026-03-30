const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function isEmailJSConfigured() {
  return Boolean(serviceId && templateId && publicKey)
}

export async function sendLeadCaptureEmails(templateParams) {
  const { userTemplateParams, agentTemplateParams } = templateParams

  if (!isEmailJSConfigured()) {
    return {
      success: true,
      degraded: true,
    }
  }

  const emailjs = await import('@emailjs/browser')

  await Promise.all([
    emailjs.default.send(serviceId, templateId, userTemplateParams, { publicKey }),
    emailjs.default.send(serviceId, templateId, agentTemplateParams, { publicKey }),
  ])

  return {
    success: true,
    degraded: false,
  }
}

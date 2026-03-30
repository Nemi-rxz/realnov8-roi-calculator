export async function exportPDFReport({
  element,
  fileName = 'realnov8-property-investment-analysis.pdf',
}) {
  if (!element) {
    throw new Error('A report element is required for PDF export.')
  }

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(element, {
    backgroundColor: '#faf7f2',
    scale: 2,
    useCORS: true,
  })

  const imageData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imageWidth = pageWidth
  const imageHeight = (canvas.height * imageWidth) / canvas.width

  let heightLeft = imageHeight
  let position = 0

  pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imageHeight
    pdf.addPage()
    pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
    heightLeft -= pageHeight
  }

  pdf.save(fileName)
}

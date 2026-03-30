import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import LeadCaptureModal from './LeadCaptureModal'

vi.mock('../utils/emailService', () => ({
  sendLeadCaptureEmails: vi.fn().mockResolvedValue({ success: true, degraded: false }),
}))

import { sendLeadCaptureEmails } from '../utils/emailService'

describe('LeadCaptureModal', () => {
  it('submits distinct user and agent email payloads and shows success', async () => {
    render(
      <LeadCaptureModal
        agentConfig={{
          agentEmail: 'agent@example.com',
          agentName: 'Ada Agent',
          companyName: 'Acme Realty',
        }}
        isOpen
        propertyData={{
          annualROI: '8.5%',
          capRate: '6.2%',
          grossYield: '10.1%',
          monthlyCashFlow: '$450',
          monthlyRent: '$2,200',
          purchasePrice: '$250,000',
        }}
        onClose={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Buyer' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jordan@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Buyer' },
    })

    fireEvent.click(screen.getByRole('button', { name: /send results/i }))

    await waitFor(() => {
      expect(sendLeadCaptureEmails).toHaveBeenCalledTimes(1)
    })

    expect(sendLeadCaptureEmails).toHaveBeenCalledWith({
      userTemplateParams: expect.objectContaining({
        to_name: 'Jordan Buyer',
        to_email: 'jordan@example.com',
        agent_name: 'Ada Agent',
        agent_email: 'agent@example.com',
        user_phone: '1234567890',
        user_type: 'Buyer',
      }),
      agentTemplateParams: expect.objectContaining({
        to_name: 'Ada Agent',
        to_email: 'agent@example.com',
        agent_name: 'Ada Agent',
        agent_email: 'agent@example.com',
        user_phone: '1234567890',
        user_type: 'Buyer',
      }),
    })

    expect(await screen.findByText(/thank you/i)).toBeTruthy()
  })
})

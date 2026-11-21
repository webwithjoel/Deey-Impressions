import { formatNaira } from './formatNaira'

export function buildWhatsAppMessage({ name, phone, notes, groups, grandTotal }) {
  const lines = ['Hello Deey Catering! I would like to place an order.', '', `*Name:* ${name}`, `*Phone:* ${phone}`, '']
  groups.forEach((group, index) => {
    const event = group.event
    lines.push(`*EVENT ${index + 1}: ${event.name}*`)
    lines.push(`Type: ${event.type}`)
    lines.push(`Date and time: ${event.date} at ${event.time}`)
    lines.push(`Venue: ${event.venue}, ${event.city}`)
    lines.push(`Guests: ${event.guests}`)
    lines.push('Items:')
    group.items.forEach((item, itemIndex) => lines.push(`${itemIndex + 1}. ${item.name} - ${item.summary} - ${formatNaira(item.total)}`))
    lines.push(`Delivery: ${formatNaira(group.delivery)}`)
    lines.push(`Event subtotal: ${formatNaira(group.subtotal)}`)
    lines.push('')
  })
  lines.push(`*Estimated grand total:* ${formatNaira(grandTotal)}`, '', `*Notes:* ${notes || 'None'}`, '', 'Please confirm availability and payment details. Thank you!')
  return lines.join('\n')
}

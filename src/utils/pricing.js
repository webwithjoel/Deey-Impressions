import { prices } from '../data/prices'

export function eventDelivery(event) {
  if (!event) return 0
  const fee = prices.delivery[event.city] || 0
  return fee + (Number(event.guests) >= 200 ? prices.delivery.largeEvent : 0)
}

export function riceMealsPrice(c = {}) {
  const base = prices.riceBases[c.base] || 2200
  const addOns = (c.moiMoi || 0) * prices.riceAddons.moiMoi + (c.plantain || 0) * prices.riceAddons.plantain + (c.coleslaw || 0) * prices.riceAddons.coleslaw
  const proteins = (c.beef || 0) * prices.proteins.beef + (c.fish || 0) * prices.proteins.fish + (c.chicken || 0) * prices.proteins.chicken + (c.gizzard || 0) * prices.proteins.gizzard + (c.egg || 0) * prices.proteins.egg
  const plate = base + addOns + proteins
  const plates = Math.max(10, Number(c.plates) || 10)
  let total = plate * plates
  const guests = c.guests || plates
  if (c.serving === 'Buffet on chafing dishes') total += Math.ceil(plates / 25) * prices.serving.buffetDish
  if (c.serving === 'Live food station') total += prices.serving.liveStation
  if (c.serving === 'Plated and served by waiters') total += plates * prices.serving.platedPerPlate
  total += (c.servers || 0) * prices.extras.server + (c.disposable ? guests * prices.extras.disposable : 0)
  total += (c.chafing || 0) * prices.extras.chafing + (c.coolers || 0) * prices.extras.cooler
  if (c.goldSetup) total += prices.extras.goldSetup
  total += (c.crates || 0) * prices.extras.crates
  return total
}

export function grillsPrice(c = {}) {
  const pieces = (c.chicken || 0) * prices.proteins.chicken + (c.fish || 0) * prices.proteins.fish + (c.beef || 0) * prices.proteins.beef + (c.gizzard || 0) * prices.proteins.gizzard
  const count = (c.chicken || 0) + (c.fish || 0) + (c.beef || 0) + (c.gizzard || 0)
  let total = pieces + (count > 0 ? Math.ceil(count / 40) * prices.tray.trayFeePer40 : 2500)
  if (c.serving === 'Buffet on chafing dishes') total += Math.ceil(count / 25) * prices.serving.buffetDish
  if (c.serving === 'Live food station') total += prices.serving.liveStation
  if (c.serving === 'Plated and served by waiters') total += count * prices.serving.platedPerPlate
  const guests = c.guests || count
  total += (c.servers || 0) * prices.extras.server + (c.disposable ? guests * prices.extras.disposable : 0)
  total += (c.chafing || 0) * prices.extras.chafing + (c.coolers || 0) * prices.extras.cooler
  if (c.goldSetup) total += prices.extras.goldSetup
  total += (c.crates || 0) * prices.extras.crates
  return total
}

export function bowlsPrice(c = {}) {
  const bowl = prices.stewBowls[c.bowl] || 3200
  const side = (c.rice ? prices.stewSides['White rice portion'] : 0) + (c.plantain ? prices.stewSides['Fried plantain'] : 0)
  const bowls = Math.max(10, Number(c.bowls) || 10)
  let total = (bowl + side) * bowls
  if (c.serving === 'Buffet on chafing dishes') total += Math.ceil(bowls / 25) * prices.serving.buffetDish
  if (c.serving === 'Live food station') total += prices.serving.liveStation
  if (c.serving === 'Plated and served by waiters') total += bowls * prices.serving.platedPerPlate
  const guests = c.guests || bowls
  total += (c.servers || 0) * prices.extras.server + (c.disposable ? guests * prices.extras.disposable : 0)
  total += (c.chafing || 0) * prices.extras.chafing + (c.coolers || 0) * prices.extras.cooler
  if (c.goldSetup) total += prices.extras.goldSetup
  total += (c.crates || 0) * prices.extras.crates
  return total
}

export function gizzardPrice(c = {}) {
  return (c.small || 0) * prices.gizzardSizes['Small cup'] + (c.medium || 0) * prices.gizzardSizes['Medium tray'] + (c.large || 0) * prices.gizzardSizes['Large tray']
}

export function smallChopsPrice(c = {}) {
  const cups = c.cups || 0
  const platters = c.platters || 0
  const trays = c.trays || 0
  let total = cups * prices.smallChops.cup + platters * prices.smallChops.platter + trays * prices.smallChops.tray
  total += (c.puffPuff || 0) * prices.smallChopsAddons.puffPuff + (c.samosa || 0) * prices.smallChopsAddons.samosa + (c.springRolls || 0) * prices.smallChopsAddons.springRolls + (c.gizzardCups || 0) * prices.smallChopsAddons.gizzardCup
  if (c.display === 'Gold plates and bowls on a trolley') total += cups * 250 + platters * 3000 + trays * 5000
  if (c.serving === 'Buffet on chafing dishes') total += Math.ceil(cups / 25) * prices.serving.buffetDish
  if (c.serving === 'Live food station') total += prices.serving.liveStation
  if (c.serving === 'Plated and served by waiters') total += cups * prices.serving.platedPerPlate
  const guests = c.guests || cups
  total += (c.servers || 0) * prices.extras.server + (c.disposable ? guests * prices.extras.disposable : 0)
  total += (c.chafing || 0) * prices.extras.chafing + (c.coolers || 0) * prices.extras.cooler
  if (c.goldSetup) total += prices.extras.goldSetup
  total += (c.crates || 0) * prices.extras.crates
  return total
}

export function barPrice(c = {}) {
  const glasses = (c.mocktails || 0) + (c.cocktails || 0)
  let total = (c.mocktails || 0) * prices.bar.mocktail + (c.cocktails || 0) * prices.bar.cocktail
  if (c.labels) total += glasses * prices.bar.label
  if (c.liveBar) total += (c.bars || 1) * prices.bar.liveService
  return total
}

export function packPrice(c = {}) {
  const baseKey = c.pack === 'Premium Lunch Pack' ? 'premium' : c.pack === 'After-Party Eats Pack' ? 'afterParty' : 'office'
  let subtotal = (c.quantity || 10) * prices.packs[baseKey]
  if (baseKey !== 'afterParty') {
    if (c.protein === 'Chicken') subtotal += (c.quantity || 10) * 1500
    if (c.protein === 'Fish') subtotal += (c.quantity || 10) * 1000
  }
  if (c.labels) subtotal += (c.quantity || 10) * prices.packs.sticker
  const quantity = c.quantity || 10
  const discountRate = quantity >= 200 ? 0.10 : quantity >= 50 ? 0.05 : 0
  return subtotal - subtotal * discountRate
}

export function liveStationPrice(c = {}) {
  const guests = Math.max(50, Number(c.guests) || 50)
  const dishes = c.dishes?.length || 4
  const upgrades = Math.max(0, dishes - 4) * prices.liveStation.extraDish
  let proteinUpgrade = 0
  if (c.protein === 'Fried fish') proteinUpgrade = prices.liveStation.fish
  if (c.protein === 'Chicken') proteinUpgrade = prices.liveStation.chicken
  if (c.extraProteins) proteinUpgrade += prices.liveStation.extraProtein * (c.extraProteins || 0)
  let total = (prices.liveStation.perGuest + upgrades + proteinUpgrade) * guests
  total += (c.stations || 1) * prices.liveStation.station
  total += (c.servers || 0) * prices.extras.server + (c.disposable ? guests * prices.extras.disposable : 0)
  total += (c.chafing || 0) * prices.extras.chafing + (c.coolers || 0) * prices.extras.cooler
  if (c.goldSetup) total += prices.extras.goldSetup
  total += (c.crates || 0) * prices.extras.crates
  return total
}

export function productPrice(productId, choices) {
  const calculators = { rice: riceMealsPrice, grills: grillsPrice, bowls: bowlsPrice, gizzard: gizzardPrice, chops: smallChopsPrice, bar: barPrice, packs: packPrice, station: liveStationPrice }
  return calculators[productId]?.(choices) || 0
}

export function cartTotals(cart, events) {
  let grand = 0
  const eventTotals = {}
  cart.forEach(item => {
    const event = events.find(e => e.id === item.eventId)
    const delivery = eventDelivery(event)
    eventTotals[item.eventId] = (eventTotals[item.eventId] || 0) + item.total
    grand += item.total
  })
  Object.entries(eventTotals).forEach(([eventId, subtotal]) => {
    const event = events.find(e => e.id === eventId)
    grand += eventDelivery(event)
  })
  return { grand, eventTotals }
}

// [tag, problem]. Tags: home travel food tech social work shopping health
const raw = {
  male: [
    ['tech', 'Your phone update demands 4GB of free space and you have 3.9'],
    ['tech', 'Your Bluetooth headphones keep connecting to a stranger\'s car'],
    ['tech', 'The smart TV forces an update the second you press play'],
    ['tech', 'Your controller dies in the middle of the boss fight'],
    ['tech', 'Your fitness tracker congratulates you on a rest day you did not take'],
    ['tech', 'Your gaming chair\'s lumbar support has lost the will to live'],
    ['home', 'The robot vacuum ate a sock and has gone on strike'],
    ['home', 'The grill runs out of propane with the steaks half done'],
    ['home', 'The smart thermostat disagrees with you about 71 degrees'],
    ['home', 'Your new mattress is too comfortable and has ruined your mornings'],
    ['home', 'The neighbor\'s lawn service made your lawn look like a confession'],
    ['home', 'The garage door opener now works only from one specific angle'],
    ['food', 'The brewery is out of the one IPA you actually like'],
    ['food', 'The delivery driver left your wings at the wrong door and sent a photo as proof'],
    ['food', 'Your protein shake has formed clumps with a personality'],
    ['food', 'Your favorite burger spot replaced the menu with a QR code'],
    ['food', 'The butcher is out of tomahawk steaks on the one day you needed one'],
    ['food', 'The fancy hot sauce you hoarded has expired'],
    ['work', 'Your office wants you back three days a week'],
    ['work', 'The meeting that could have been an email is now a recurring meeting'],
    ['work', 'The fantasy trade deadline lands during your quarterly review'],
    ['work', 'IT replaced your good mouse with a "standard" one'],
    ['work', 'Someone microwaved fish in the break room again'],
    ['travel', 'The rental car "upgrade" is a worse car with more badges'],
    ['travel', 'Your tee time got moved to 7 a.m.'],
    ['travel', 'The PreCheck line is somehow longer than the regular line'],
    ['travel', 'The airport lounge is out of the good whiskey'],
    ['social', 'Your buddy\'s wedding is a "phones away" ceremony'],
    ['social', 'The group trip Venmo requests keep arriving with emojis'],
    ['social', 'Your brother-in-law beat you at your own barbecue'],
    ['social', 'Someone parked a Tesla across two spots at the gym'],
    ['social', 'Your friend sent a 4-minute voice memo about nothing'],
    ['shopping', 'The limited-edition sneakers sold out in 11 seconds'],
    ['shopping', 'Your free two-day shipping is taking four days'],
    ['health', 'The gym replaced the squat rack with a "wellness zone"'],
    ['health', 'Your doctor suggests you "cut back" on the one thing you enjoy'],
  ],
  female: [
    ['food', 'The café is out of the specific syrup you require'],
    ['food', 'The brunch place lost your reservation and the mimosa special ended'],
    ['food', 'The avocado you waited three days for is brown inside'],
    ['food', 'The delivery app swapped your oat milk for "a similar item"'],
    ['food', 'The restaurant\'s lighting makes every photo look like a hostage video'],
    ['food', 'The matcha place now has a waitlist for the waitlist'],
    ['home', 'Your candle arrived scentless and slightly judgmental'],
    ['home', 'The robot vacuum ran over the charger cable and gave up'],
    ['home', 'Your new couch is the wrong shade of "oatmeal"'],
    ['home', 'The Roomba trapped itself under the bed again'],
    ['home', 'Your plant, which cost $90, is already dying'],
    ['home', 'The Airbnb listing photos lied about the bathroom'],
    ['tech', 'Your phone storage is full of 4,000 near-identical photos'],
    ['tech', 'Your laptop says "update required" an hour before your presentation'],
    ['tech', 'Your AirPods are charged to 100% in one ear only'],
    ['tech', 'The group chat has a poll and you are the only holdout'],
    ['tech', 'Your ring light has given up in the middle of a video call'],
    ['shopping', 'The sale ended at midnight and your cart expired at 11:59'],
    ['shopping', 'Your skincare serum is back-ordered until next month'],
    ['shopping', 'The "one size fits all" dress fits no one, specifically you'],
    ['shopping', 'The pop-up shop requires you to download an app to enter'],
    ['shopping', 'Your return window closed yesterday'],
    ['social', 'Your friend cancelled brunch with a heart emoji'],
    ['social', 'The bridal group chat has reached 600 unread messages'],
    ['social', 'Someone wore your exact outfit and wore it better'],
    ['social', 'Your coworker\'s baby shower has a theme and a dress code'],
    ['social', 'A friend put you on "close friends" for exactly one story'],
    ['health', 'Your yoga studio moved your usual class to 6 a.m.'],
    ['health', 'The Pilates reformer you booked got double-booked'],
    ['health', 'Your wellness app gave you a "low energy" score you disagree with'],
    ['work', 'Your boss said "quick sync" and it was 90 minutes'],
    ['work', 'The conference room with the good chairs is booked all week'],
    ['work', 'The office plant watering rota has become political'],
    ['travel', 'The seat in front of you reclined into your lap'],
    ['travel', 'Your hotel upgraded you to a room with a "city view" of a wall'],
    ['travel', 'Your carry-on doesn\'t fit in the carry-on sizer'],
  ],
  both: [
    ['tech', 'The Wi-Fi password is on a sticker you can\'t read'],
    ['tech', 'The app wants you to rate it right after it crashed'],
    ['tech', 'Your streaming service moved the show to a different, more expensive service'],
    ['tech', 'Two-factor authentication texts the phone you are not holding'],
    ['tech', 'The captcha asks for crosswalks again and you are no longer sure what a crosswalk is'],
    ['home', 'The delivery guy rang the bell and left before you reached the door'],
    ['home', 'The laundry detergent switched to a scent you now hate'],
    ['home', 'The neighbor is renovating at 8 a.m. on a Sunday'],
    ['home', 'The thermostat is a locked 72 and the building knows best'],
    ['food', 'The coffee machine descaling light has come on, ominously'],
    ['food', 'The takeout order arrived with one fry short'],
    ['food', 'The restaurant has gone cashless and you have only cash'],
    ['food', 'The grocery store rearranged everything again'],
    ['food', 'Your favorite snack was "improved" and discontinued'],
    ['work', 'The reply-all chain is now 40 deep'],
    ['work', 'Hot-desking: someone is in your hot desk'],
    ['work', 'The meeting invite has no agenda and a lot of attendees'],
    ['shopping', 'The self-checkout scale detects an unexpected item you didn\'t scan'],
    ['shopping', 'The store brand is out, and the name brand is $4 more'],
    ['shopping', 'The loyalty app wants a phone number for 5 cents off'],
    ['social', 'A friend asks to "pick your brain" for an hour'],
    ['social', 'Someone is playing video on speaker in the quiet car'],
    ['social', 'The group dinner is splitting the bill evenly, including the wine you didn\'t drink'],
    ['social', 'Your plans were rescheduled by someone who still hasn\'t RSVP\'d'],
    ['travel', 'The flight is delayed by 20 minutes, which feels personal'],
    ['travel', 'The parking garage is full and the valet is "closed"'],
    ['travel', 'The rideshare driver is going the other way for a "shortcut"'],
    ['health', 'The pharmacy is "out of stock" and "sorry about that"'],
    ['health', 'Your dentist reminds you that flossing is a lifestyle'],
    ['health', 'The sleep app says you slept 5 hours and you feel personally attacked'],
  ],
};

let n = 0;
export const bank = Object.entries(raw).flatMap(([track, list]) =>
  list.map(([tag, text]) => ({ id: ++n, track, tag, text })));
const byId = new Map(bank.map(p => [p.id, p]));
export const getProblem = id => byId.get(Number(id));

const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);

// Pick `count` unused problems for a track: one in the same setting (continuity), the rest from other settings.
export function pickNext(track, used, currentTag, count) {
  const usedSet = new Set(used.map(Number));
  const pool = shuffle(bank.filter(p => !usedSet.has(p.id) && (track === 'any' || p.track === 'both' || p.track === track)));
  const out = [];
  const same = pool.find(p => p.tag === currentTag);
  if (same) out.push(same);
  for (const p of pool) {
    if (out.length >= count) break;
    if (!out.includes(p) && !out.some(o => o.tag === p.tag)) out.push(p);
  }
  for (const p of pool) { if (out.length >= count) break; if (!out.includes(p)) out.push(p); }
  return shuffle(out);
}

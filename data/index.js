import dataSpells from './spellData.json'
import dataDisciplines from './disciplines.json'
import dataTCOE from './tcoe.json'
import dataEGTW from './egtw.json'
import dataSCC from './scc.json'

const spells = dataSpells.concat(dataDisciplines)

const levelStrs = [
  "Cantrip",
  "1st-level",
  "2nd-level",
  "3rd-level",
  "4th-level",
  "5th-level",
  "6th-level",
  "7th-level",
  "8th-level",
  "9th-level",
]

function processDict (data, page) {
  for (const key in data) {
    if (!key.startsWith("Spells.")) {
      continue
    }
    const {
      Name, CastingTime, Classes, Components, Description, Duration, Level,
      Range, Ritual, School
    } = data[key]

    const cantrip = Level == 0
    const comp_bits = Components.split(" (")
    const components = comp_bits[0]
    const materials = comp_bits.length < 2 ? "" : comp_bits[1].split(")")[0]
    const concentration = Duration.includes("Concentration")
    spells.push({
      "name": Name,
      "desc": Description,
      "page": page,
      "range": Range,
      "components": components,
      "material": materials,
      "duration": Duration,
      "concentration": concentration ? "yes" : "no",
      "ritual": Ritual ? "yes" : "no",
      "school": School,
      "level": levelStrs[parseInt(Level)] || Level,
      "casting_time": CastingTime,
      "class": Classes.join(", "),
    })
  }
}

function process5ETools(data) {

  function renderList(entries, f, separator) {
    const out = []
    for (const entry of entries) {
      out.push(f(entry))
    }
    if (!separator) {
      separator = "\n"
    }
    return out.join(separator)
  }

  function renderEntry(entry) {
    if (typeof entry === 'string') {
      return entry
    } else {
      return entry["name"] + ": " + renderList(entry["entries"] || entry["items"], renderEntry)
    }
  }

  function renderUnit(unit) {
    return (unit["amount"] || unit["number"]) + " " + (unit["type"] || unit["unit"])
  }

  function renderDuration(duration) {
    const type = duration["type"]
    if (type == "timed") {
      return renderUnit(duration["duration"])
    }
    return type
  }

  function renderRange(range) {
    if (!range) {
      return ""
    }
    return renderUnit(range["distance"]) + ", " + range["type"]
  }

  for (const spell of data["spell"]) {
    let entries = []
    if (spell["entries"]) {
      entries = entries.concat(spell["entries"])
    }
    if (spell["entriesHigherLevel"]) {
      entries = entries.concat(spell["entriesHigherLevel"])
    }
    spells.push({
      "name": spell["name"],
      "desc": renderList(entries, renderEntry),
      "page": spell["source"] + " " + spell["page"],
      "range": renderRange(spell["range"]),
      "components": Object.keys(spell["components"]).join(", "),
      "material": spell["components"]["m"],
      "duration": renderDuration(spell["duration"][0]),
      "concentration": spell["duration"][0]["concentration"] ? "yes" : "no",
      "ritual": spell["ritual"],
      "school": spell["school"],
      "level": levelStrs[spell["level"]],
      "casting_time": renderList(spell["time"], renderUnit, ", "),
      "class": spell["class"]
    })
  }
}

processDict(dataTCOE, "tcoe")
processDict(dataEGTW, "egtw")
process5ETools(dataSCC)

function assert(condition, desc, spell) {
  if (!condition) {
    console.log(condition, desc, spell)
    throw desc
  }
}

for (const spell of spells) {
  assert(spell.level, "level", spell)
}

export default spells

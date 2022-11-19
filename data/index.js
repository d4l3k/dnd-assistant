import dataSpells from './spellData.json'
import dataDisciplines from './disciplines.json'
import dataTCOE from './tcoe.json'

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

for (const key in dataTCOE) {
  if (!key.startsWith("Spells.")) {
    continue
  }
  const {
    Name, CastingTime, Classes, Components, Description, Duration, Level,
    Range, Ritual, School
  } = dataTCOE[key]

  const cantrip = Level == 0
  const comp_bits = Components.split(" (")
  const components = comp_bits[0]
  const materials = comp_bits.length < 2 ? "" : comp_bits[1].split(")")[0]
  const concentration = Duration.includes("Concentration")
  spells.push({
    "name": Name,
    "desc": Description,
    "page": "tcoe",
    "range": Range,
    "components": components,
    "material": materials,
    "duration": Duration,
    "concentration": concentration ? "yes" : "no",
    "ritual": Ritual ? "yes" : "no",
    "school": School,
    "level": levelStrs[Level],
    "casting_time": CastingTime,
  })
}

export default spells

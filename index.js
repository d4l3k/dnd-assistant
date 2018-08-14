//require('react-devtools-core').connectToDevTools({host: '192.168.0.15'})

import {Navigation} from './navigation'

import {CharacterScreen, ShareSettingsScreen, AddHealthScreen, CharacterSettingsScreen} from './Character'
import {AddGearScreen, GearScreen, GearSettingsScreen} from './GearScreen'
import {CharacterMenu} from './CharacterMenu'
import {WildMagicScreen} from './WildMagicScreen'
import {DiceScreen, AddDieScreen} from './DiceScreen'
import {KnownSpellsScreen, AddSpellScreen, SpellSettingsScreen, CastSpellScreen} from './SpellBook'
import {AddCustomStatScreen} from './CustomStats'
import {iconsLoaded} from './icons'
import {start} from './App'

Navigation.registerComponent('dnd.CharacterScreen', () => CharacterScreen)
Navigation.registerComponent('dnd.ShareSettingsScreen', () => ShareSettingsScreen)
Navigation.registerComponent('dnd.CharacterSettingsScreen', () => CharacterSettingsScreen)
Navigation.registerComponent('dnd.GearScreen', () => GearScreen)
Navigation.registerComponent('dnd.CharacterMenu', () => CharacterMenu)
Navigation.registerComponent('dnd.KnownSpellsScreen', () => KnownSpellsScreen)
Navigation.registerComponent('dnd.CastSpellScreen', () => CastSpellScreen)
Navigation.registerComponent('dnd.SpellSettingsScreen', () => SpellSettingsScreen)
Navigation.registerComponent('dnd.AddGearScreen', () => AddGearScreen)
Navigation.registerComponent('dnd.AddSpellScreen', () => AddSpellScreen)
Navigation.registerComponent('dnd.DiceScreen', () => DiceScreen)
Navigation.registerComponent('dnd.AddDieScreen', () => AddDieScreen)
Navigation.registerComponent('dnd.CastSpellScreen', () => CastSpellScreen)
Navigation.registerComponent('dnd.WildMagicScreen', () => WildMagicScreen)
Navigation.registerComponent('dnd.AddHealthScreen', () => AddHealthScreen)
Navigation.registerComponent('dnd.GearSettingsScreen', () => GearSettingsScreen)
Navigation.registerComponent('dnd.AddCustomStatScreen', () => AddCustomStatScreen)

iconsLoaded.then(() => {
  start()
})

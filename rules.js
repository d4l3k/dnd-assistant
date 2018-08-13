import React from 'react'
import autobind from 'autobind-decorator'
import {View, StyleSheet} from 'react-native'
import {TextInput} from './TextInput'
import {BaseText, Field, H1, H2} from './styles.js'
import {HealthBar} from './HealthBar'
import {CheckBox} from './CheckBox'
import {MarkdownInput} from './MarkdownInput'
import {ApproachInput, LineInput, StatInput, BoxInput, RelativeInput, ModInput, MultiLineInput} from './characterInputs'
import {CustomStats} from './CustomStats'

export function dnd5e () {
  return <View>
    <View style={styles.row}>
      <LineInput
        name={'Character Name'}
        value={this.state.character_name}
        onChangeText={this.cache(name => this.set({name}))}
      />
      <LineInput
        name={'Class & Level'}
        value={this.state.character_classLevel}
        onChangeText={this.cache(classLevel => this.set({classLevel}))}
      />
    </View>

    <View style={styles.row}>
      <LineInput
        name={'Race'}
        value={this.state.character_race}
        onChangeText={this.cache(race => this.set({race}))}
      />

      <BoxInput
        name={'Experience Points'}
        value={this.state.character_exp}
        onChangeText={this.cache(exp => this.set({exp}))}
      />
    </View>
    <View style={styles.row}>
      <LineInput
        name={'Alignment'}
        value={this.state.character_alignment}
        onChangeText={this.cache(alignment => this.set({alignment}))}
      />
      <LineInput
        name={'Background'}
        value={this.state.character_background}
        onChangeText={this.cache(background => this.set({background}))}
      />
    </View>

    <View style={styles.row}>
      <BoxInput
        name={'Hit Point Maximum'}
        value={this.state.character_hpMax}
        onChangeText={this.cache(hpMax => this.set({hpMax}))}
      />
      <RelativeInput
        name={'Current Hit Points'}
        value={this.state.character_hp}
        onChangeText={this.cache(hp => this.set({hp}))}
        default={this.state.character_hpMax}
        navigator={this.props.navigator}
      />
      <BoxInput
        name={'Temporary Hit Points'}
        value={this.state.character_tempHP}
        onChangeText={this.cache(tempHP => this.set({tempHP}))}
      />
    </View>

    <HealthBar
      max={this.state.character_hpMax}
      current={parseFloat(this.state.character_hp || 0) + parseFloat(this.state.character_tempHP || 0)}
    />

    <View style={styles.row}>
      <View style={styles.columnNarrow}>
        <StatInput
          name={'Strength'}
          value={this.state.character_strength}
          onChangeText={this.cache(strength => this.set({strength}))}
        />
        <StatInput
          name={'Dexterity'}
          value={this.state.character_dexterity}
          onChangeText={this.cache(dexterity => this.set({dexterity}))}
        />
        <StatInput
          name={'Constitution'}
          value={this.state.character_constitution}
          onChangeText={this.cache(constitution => this.set({constitution}))}
        />
        <StatInput
          name={'Intelligence'}
          value={this.state.character_intelligence}
          onChangeText={this.cache(intelligence => this.set({intelligence}))}
        />
        <StatInput
          name={'Wisdom'}
          value={this.state.character_wisdom}
          onChangeText={this.cache(wisdom => this.set({wisdom}))}
        />
        <StatInput
          name={'Charisma'}
          value={this.state.character_charisma}
          onChangeText={this.cache(charisma => this.set({charisma}))}
        />

        <BoxInput
          name={'Passive Wisdom (Perception)'}
          value={this.state.character_passiveWisdom}
          onChangeText={this.cache(passiveWisdom => this.set({passiveWisdom}))}
        />
      </View>
      <View style={styles.column}>
        <View style={styles.rownoflex}>
          <BoxInput
            name={'Inspiration'}
            value={this.state.character_inspiration}
            onChangeText={this.cache(inspiration => this.set({inspiration}))}
          />
          <BoxInput
            name={'Proficiency Bonus'}
            value={this.state.character_proficiency}
            onChangeText={this.cache(proficiency => this.set({proficiency}))}
          />
        </View>

        <Field name='Saving Throws'>
          {
            this.renderSkills([
              ['Strength'],
              ['Dexterity'],
              ['Constitution'],
              ['Intelligence'],
              ['Wisdom'],
              ['Charisma']
            ])
          }
        </Field>

        <Field name='Skills'>
          {
            this.renderSkills([
              ['Acrobatics', 'dexterity'],
              ['Animal Handling', 'wisdom'],
              ['Arcana', 'intelligence'],
              ['Athletics', 'strength'],
              ['Deception', 'charisma'],
              ['History', 'intelligence'],
              ['Insight', 'wisdom'],
              ['Intimidation', 'charisma'],
              ['Investigation', 'intelligence'],
              ['Medicine', 'wisdom'],
              ['Nature', 'intelligence'],
              ['Perception', 'wisdom'],
              ['Performance', 'charisma'],
              ['Persuasion', 'charisma'],
              ['Religion', 'intelligence'],
              ['Slight Of Hand', 'dexterity'],
              ['Stealth', 'dexterity'],
              ['Survival', 'wisdom']
            ])
          }
        </Field>
      </View>
    </View>

    <View style={styles.row}>
      <BoxInput
        name={'Armor Class'}
        value={this.state.character_armorClass}
        onChangeText={this.cache(armorClass => this.set({armorClass}))}
      />
      <ModInput
        name={'Initiative'}
        value={this.state.character_initiative}
        onChangeText={this.cache(initiative => this.set({initiative}))}
      />
      <BoxInput
        name={'Speed'}
        value={this.state.character_speed}
        onChangeText={this.cache(speed => this.set({speed}))}
      />
    </View>

    <View style={styles.row}>
      <View style={styles.column}>
        <Field name='Hit Dice' flex={2}>
          <TextInput
            value={this.state.character_hitDice || ''}
            onChangeText={this.cache(hitDice => this.set({hitDice}))}
          />
        </Field>
      </View>
      <View style={styles.col4}>
        <Field name='Death Saves'>
          <View style={[styles.rowcenter, styles.wrap]}>
            <BaseText>Successes</BaseText>

            <View style={[styles.rowend, styles.wrap]}>
              <CheckBox
                onClick={this.cache(() => this.set({deathSuccess1: !this.state.character_deathSuccess1}))}
                isChecked={this.state.character_deathSuccess1}
              />

              <CheckBox
                onClick={this.cache(() => this.set({deathSuccess2: !this.state.character_deathSuccess2}))}
                isChecked={this.state.character_deathSuccess2}
              />

              <CheckBox
                onClick={this.cache(() => this.set({deathSuccess3: !this.state.character_deathSuccess3}))}
                isChecked={this.state.character_deathSuccess3}
              />
            </View>
          </View>

          <View style={[styles.rowcenter, styles.wrap]}>
            <BaseText>Failures</BaseText>

            <View style={[styles.rowend, styles.wrap]}>
              <CheckBox
                onClick={this.cache(() => this.set({deathFail1: !this.state.character_deathFail1}))}
                isChecked={this.state.character_deathFail1}
              />

              <CheckBox
                onClick={this.cache(() => this.set({deathFail2: !this.state.character_deathFail2}))}
                isChecked={this.state.character_deathFail2}
              />

              <CheckBox
                onClick={this.cache(() => this.set({deathFail3: !this.state.character_deathFail3}))}
                isChecked={this.state.character_deathFail3}
              />
            </View>
          </View>
        </Field>
      </View>
    </View>

    <View style={styles.row}>
      <BoxInput
        name={'Spellcasting Ability'}
        value={this.state.character_spellcastingAbility}
        onChangeText={this.cache(spellcastingAbility => this.set({spellcastingAbility}))}
      />

      <BoxInput
        name={'Spell Save DC'}
        value={this.state.character_spellSaveDC}
        onChangeText={this.cache(spellSaveDC => this.set({spellSaveDC}))}
      />

      <ModInput
        name={'Spell Attack Bonus'}
        value={this.state.character_spellAttackBonus}
        onChangeText={this.cache(spellAttackBonus => this.set({spellAttackBonus}))}
      />
    </View>

    <CustomStats />

    <MarkdownInput
      name={'Features & Traits'}
      value={this.state.character_featuresTraits}
      onChangeText={this.cache(featuresTraits => this.set({featuresTraits}))}
    />

    <MarkdownInput
      name={'Other Proficiencies & Languages'}
      value={this.state.character_proficiencyLanguages}
      onChangeText={this.cache(proficiencyLanguages => this.set({proficiencyLanguages}))}
    />

    <MultiLineInput
      name={'Personality Traits'}
      value={this.state.character_personalityTraits}
      onChangeText={this.cache(personalityTraits => this.set({personalityTraits}))}
    />

    <MultiLineInput
      name={'Ideals'}
      value={this.state.character_ideals}
      onChangeText={this.cache(ideals => this.set({ideals}))}
    />

    <MultiLineInput
      name={'Bonds'}
      value={this.state.character_bonds}
      onChangeText={this.cache(bonds => this.set({bonds}))}
    />

    <MultiLineInput
      name={'Flaws'}
      value={this.state.character_flaws}
      onChangeText={this.cache(flaws => this.set({flaws}))}
    />

    <View style={styles.row}>
      <LineInput
        name={'Age'}
        value={this.state.character_age}
        onChangeText={this.cache(age => this.set({age}))}
      />

      <LineInput
        name={'Height'}
        value={this.state.character_height}
        onChangeText={this.cache(height => this.set({height}))}
      />

      <LineInput
        name={'Weight'}
        value={this.state.character_weight}
        onChangeText={this.cache(weight => this.set({weight}))}
      />
    </View>

    <View style={styles.row}>
      <LineInput
        name={'Eyes'}
        value={this.state.character_eyes}
        onChangeText={this.cache(eyes => this.set({eyes}))}
      />

      <LineInput
        name={'Skin'}
        value={this.state.character_skin}
        onChangeText={this.cache(skin => this.set({skin}))}
      />

      <LineInput
        name={'Hair'}
        value={this.state.character_hair}
        onChangeText={this.cache(hair => this.set({hair}))}
      />
    </View>

    <MarkdownInput
      name={'Backstory'}
      value={this.state.character_backstory}
      onChangeText={this.cache(backstory => this.set({backstory}))}
    />

    <MarkdownInput
      name={'Allies & Organizations'}
      value={this.state.character_alliesOrganizations}
      onChangeText={this.cache(alliesOrganizations => this.set({alliesOrganizations}))}
    />
  </View>
}

export function fateAccelerated () {
  return <View>
    <Section>ID</Section>
    <LineInput
      name='Character Name'
      value={this.state.character_name}
      onChangeText={this.cache(name => this.set({name}))}
    />

    <MultiLineInput
      name='Description'
      value={this.state.character_personalityTraits}
      onChangeText={this.cache(personalityTraits => this.set({personalityTraits}))}
    />

    <View style={styles.row}>
      <BoxInput
        name='Refresh'
        value={this.state.character_refresh}
        onChangeText={this.cache(refresh => this.set({refresh}))}
      />

      <BoxInput
        name='Current Fate Points'
        value={this.state.character_currentFatePoints}
        onChangeText={this.cache(currentFatePoints => this.set({currentFatePoints}))}
      />
    </View>

    <Section>Aspects</Section>
    <MultiLineInput
      name='High Concept'
      value={this.state.character_highConcept}
      onChangeText={this.cache(highConcept => this.set({highConcept}))}
    />
    <MultiLineInput
      name='Trouble'
      value={this.state.character_trouble}
      onChangeText={this.cache(trouble => this.set({trouble}))}
    />
    <MultiLineInput
      value={this.state.character_aspect1}
      onChangeText={this.cache(aspect1 => this.set({aspect1}))}
    />
    <MultiLineInput
      value={this.state.character_aspect2}
      onChangeText={this.cache(aspect2 => this.set({aspect2}))}
    />
    <MultiLineInput
      value={this.state.character_aspect3}
      onChangeText={this.cache(aspect3 => this.set({aspect3}))}
    />

    <Section>Approaches</Section>
    <View style={styles.row}>
      <ApproachInput
        name='Careful'
        value={this.state.character_careful}
        onChangeText={this.cache(careful => this.set({careful}))}
      />
      <ApproachInput
        name='Clever'
        value={this.state.character_clever}
        onChangeText={this.cache(clever => this.set({clever}))}
      />
    </View>
    <View style={styles.row}>
      <ApproachInput
        name='Flashy'
        value={this.state.character_flashy}
        onChangeText={this.cache(flashy => this.set({flashy}))}
      />
      <ApproachInput
        name='Forceful'
        value={this.state.character_forceful}
        onChangeText={this.cache(forceful => this.set({forceful}))}
      />
    </View>
    <View style={styles.row}>
      <ApproachInput
        name='Quick'
        value={this.state.character_quick}
        onChangeText={this.cache(quick => this.set({quick}))}
      />
      <ApproachInput
        name='Sneaky'
        value={this.state.character_sneaky}
        onChangeText={this.cache(sneaky => this.set({sneaky}))}
      />
    </View>

    <Section>Stunts</Section>
    <MultiLineInput
      name='Stunts'
      value={this.state.character_stunts}
      onChangeText={this.cache(stunts => this.set({stunts}))}
    />

    <Section>Stress</Section>
    <View style={styles.row}>
      <BoxInput
        name='1'
        value={this.state.character_stress1}
        onChangeText={this.cache(stress1 => this.set({stress1}))}
      />
      <BoxInput
        name='2'
        value={this.state.character_stress2}
        onChangeText={this.cache(stress2 => this.set({stress2}))}
      />
      <BoxInput
        name='3'
        value={this.state.character_stress3}
        onChangeText={this.cache(stress3 => this.set({stress3}))}
      />
    </View>

    <Section>Consequences</Section>
    <MultiLineInput
      name='2 - Mild'
      value={this.state.character_consequencesMild}
      onChangeText={this.cache(consequencesMild => this.set({consequencesMild}))}
    />
    <MultiLineInput
      name='4 - Moderate'
      value={this.state.character_consequencesModerate}
      onChangeText={this.cache(consequencesModerate => this.set({consequencesModerate}))}
    />
    <MultiLineInput
      name='6 - Severe'
      value={this.state.character_consequencesSevere}
      onChangeText={this.cache(consequencesSevere => this.set({consequencesSevere}))}
    />

  </View>
}

const Section = (props) => {
  return <View style={styles.section}>
    <H2>{props.children}</H2>
  </View>
}

const styles = StyleSheet.create({
  column: {
    flex: 2,
  },
  section: {
    marginLeft: 5,
    marginRight: 5
  },
  columnNarrow: {
    flex: 1,
  },
  rowstart: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  rowcenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  rowcenteritems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowend: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rownoflex: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  wrap: {
    flexWrap: 'wrap'
  },
  col4: {
    flex: 4
  }
})

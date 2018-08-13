import json
import io

def pretty_print(obj):
    print(json.dumps(obj, sort_keys=True, indent=2, separators=(',', ': ')))

with io.open('../../../Downloads/Mystic Final 1.1.json', 'r') as f:
    data = json.load(f)

spells = []

talents = data['sharedclassfeaturemenus'][0]
for entry in talents['entries']:
    out = {
        'name': entry['displayname'],
        'level': talents['name'],
        'desc': entry['previewtext'],
        'class': 'Mystic',
    }
    spells.append(out)

discipline = data['sharedclassfeaturemenus'][1]
for entry in discipline['entries']:
    out = {
        'name': entry['displayname'],
        'level': discipline['name'],
        'school': entry['previewtext'].split('-', 1)[0].strip(),
        'class': 'Mystic',
        'abilities': [],
        'notcastable': True,
    }
    for effect in entry['effects']:
        if 'featuretextwithbullet' in effect:
            parts = effect['featuretextwithbullet'].split(':', 1)
            if len(parts) == 1:
                parts = effect['featuretextwithbullet'].split('.', 1)
            out['desc'] = parts[1].strip()
        if 'featuretext' in effect:
            text = effect['featuretext'].strip()
            name_parts = text.split('(', 1)
            if len(name_parts) != 2:
                continue

            cost_parts = name_parts[1].split(')', 1)
            psi_parts = cost_parts[0].split(';', 1)

            ability = {
                'name': name_parts[0].strip().lstrip('-'),
                'cost': psi_parts[0].strip(),
                'desc': cost_parts[1].strip().lstrip('. '),
                'concentration': 'no'
            }
            if len(psi_parts) == 2:
                for part in psi_parts[1].strip().split(','):
                    part = part.strip()
                    if part == 'conc.':
                        ability['concentration'] = 'yes'
                    else:
                        ability['duration'] = part.rstrip('.')

            out['abilities'].append(ability)

    spells.append(out)

pretty_print(spells)

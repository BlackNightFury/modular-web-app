import randomWords from 'random-words'
import { sentence } from 'txtgen'
import RandExp from 'randexp'
import moment from 'moment'
import { getBrowserLocaledDateTimeString } from './datetime'
import { makeSentenceCase } from './utils'

const CONDITION_DESCRIPTION_MOCK = [
  'No visual defects',
  'Asset is running as intended',
  'There are blanks missing from the distribution board exposing live parts',
  'There is a gas leak on the boiler and flames are gushing out of the unit. The space is on fire and we are all going to die',
]

const NOTE_MOCK = [
  'The barcode was placed on the isolator',
  'Unable to access asset. Details taken from O&M’s',
  'We had no access to the space. Informed by John Smith what was present in the space',
]

const CONDITIONS = ['A', 'B']

const LOCAL_ASSET_DESCRIPTION_MOCK = ['DB 1', 'Wall Mounted AC Unit', 'Boiler No.1', 'Chiller No 3']

const CHECK_VALUES = ['checked', 'unchecked']

const getRandomValue = facetItem => {
  const { type, options, validation } = facetItem

  switch (type) {
    case 'TextBox':
      if (validation.example) {
        return validation.example || randomWords()
      }
      return randomWords()
    case 'MultiLineTextBox':
      return sentence()
    case 'ComboBox':
      return options.map(obj => obj.code)[Math.floor(Math.random() * options.length)]
    case 'ComboBoxYear':
      return getBrowserLocaledDateTimeString(moment())
    case 'CheckBox':
      return CHECK_VALUES[Math.floor(Math.random() * CHECK_VALUES.length)]
    default:
      return null
  }
}

const defaultAssetDetailsGenerator = (facet, manufacturers) => {
  if (!facet) {
    return null
  }

  const initialAsset = {}
  facet.forEach(facetItem => {
    const { key, label, validation, enum: conditions, element } = facetItem

    const newKey = element === 'notes' ? `notes.${key}` : key
    switch (label) {
      case 'Local Asset Description':
        initialAsset[newKey] =
          LOCAL_ASSET_DESCRIPTION_MOCK[
            Math.floor(Math.random() * LOCAL_ASSET_DESCRIPTION_MOCK.length)
          ]
        break
      case 'Barcode':
        if (validation && validation.isRegEx) {
          const randExp = new RandExp(validation.value.split('#')[0], 'i')
          initialAsset[newKey] = randExp.gen()
        } else {
          initialAsset[newKey] = `${Math.floor(1000000 + Math.random() * 9000000)}`
        }
        break
      case 'Condition':
        if (conditions && conditions.length) {
          initialAsset[newKey] = conditions[Math.floor(Math.random() * CONDITIONS.length)]
        } else {
          initialAsset[newKey] = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)]
        }
        break
      case 'Quantity':
        initialAsset[newKey] = '1'
        break
      case 'Manufacturer':
        initialAsset[newKey] = makeSentenceCase(
          manufacturers[Math.floor(Math.random() * manufacturers.length)],
        )
        break
      case 'Condition Description (Must be a sentence)':
        initialAsset[newKey] =
          CONDITION_DESCRIPTION_MOCK[Math.floor(Math.random() * CONDITION_DESCRIPTION_MOCK.length)]
        break
      case 'Notes':
        initialAsset[newKey] = NOTE_MOCK[Math.floor(Math.random() * NOTE_MOCK.length)]
        break
      default:
        initialAsset[newKey] = getRandomValue(facetItem)
        break
    }
  })

  return initialAsset
}

export default defaultAssetDetailsGenerator

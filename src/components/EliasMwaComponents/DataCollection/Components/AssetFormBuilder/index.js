import React from 'react'
import { Button, Checkbox, Input } from 'antd'
import { Storage } from 'aws-amplify'
import PhotoTaker from '../PhotoTaker'
import Form from '../Form'
import AssetFormGQLWrapper from '@/components/EliasMwaComponents/GraphqlAPI/AssetFormGQLWrapper'
import { removeEmptyValues, flattenToObject, updateStorage, flattenToArray } from '@/services/utils'
import { checkCondition } from '@/services/asset-validation'
import ReminderNote from '../ReminderNote'
import ValidationMessage from '../ValidationMessage'

import styles from './style.scss'

const { aws } = window.mwa_config

class AssetFormBuilder extends React.Component {
  static defaultProps = {
    submitBtnLabel: 'Add',
    hasDummyData: false,
    setInitialData: () => {},
  }

  state = {
    selectedPhotos: [],
    isShowBuilder: true,
    isImageRestricted: false,
    imageNote: '',
    condition: '',
    installDate: '',
  }

  componentDidMount() {
    this.updateSelectedPhotos()
    const { notes } = this.props
    if (notes && notes.image) {
      this.setState({ isImageRestricted: true, imageNote: notes.image.description })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { condition, installDate } = this.state
    if (condition !== nextState.condition || installDate !== nextState.installDate) {
      return false
    }
    return true
  }

  componentDidUpdate(prevProps) {
    const { facet, item } = this.props
    if (facet !== prevProps.facet || item !== prevProps.item) {
      this.setState(
        {
          isShowBuilder: false,
        },
        () => {
          this.setState({ isShowBuilder: true })
        },
      )
      this.updateSelectedPhotos()
    }
  }

  updateSelectedPhotos = () => {
    const {
      images,
      user: { currentTenant },
    } = this.props

    const newImages = images || []
    updateStorage(currentTenant, aws.project_region)
    newImages.forEach(image => {
      Storage.get(image.picture.key, { download: true, level: 'public' })
        .then(response => {
          const arrayBufferView = new Uint8Array(response.Body)
          const blob = new Blob([arrayBufferView], { type: response.ContentType })
          const urlCreator = window.URL || window.webkitURL
          const imageUrl = urlCreator.createObjectURL(blob)
          image.dataUri = imageUrl
          this.setState({
            selectedPhotos: newImages,
          })
        })
        .catch(() => {})
    })
    this.setState({
      selectedPhotos: newImages,
    })
  }

  onDummyData = () => {
    const { manufacturers, setInitialData } = this.props
    setInitialData(manufacturers)
  }

  onPhotoSelected = dataUri => {
    const {
      user: { currentTenant: tenant },
    } = this.props
    const { selectedPhotos } = this.state
    const type = dataUri.split(';')[0].split('/')[1]
    const key = `${new Date().getTime()}.${type}`
    this.setState({
      selectedPhotos: [
        ...selectedPhotos,
        {
          dataUri,
          picture: {
            bucket: tenant.assetImagesS3Bucket,
            key,
          },
        },
      ],
    })
  }

  onDeletePhoto = idx => {
    const { selectedPhotos } = this.state
    selectedPhotos.splice(idx, 1)
    this.setState({
      selectedPhotos: [...selectedPhotos],
    })
  }

  onImageValidation = () => {
    let errorMessage = ''
    const { selectedPhotos, isImageRestricted, condition, installDate } = this.state
    const {
      assetDetail: { lifecycle },
    } = this.props

    if (!this.photoValidationMsg || !this.formBuilder) {
      return null
    }

    if (
      !isImageRestricted &&
      selectedPhotos.length === 0 &&
      checkCondition(condition, installDate, lifecycle)
    ) {
      errorMessage = 'You should take at least one photo.'
      this.photoValidationMsg.setErrorMessage(errorMessage)
      this.formBuilder.setAdditionalErrors([
        {
          stack: `Photo: ${errorMessage}`,
        },
      ])
      return errorMessage
    }
    this.photoValidationMsg.setErrorMessage('')
    this.formBuilder.setAdditionalErrors([])
    return this.onImageNoteValidation()
  }

  onImageNoteValidation = () => {
    const { isImageRestricted, imageNote } = this.state
    if (!this.imageNoteValidationMsg) {
      return null
    }
    if (isImageRestricted && !imageNote) {
      const errorMessage = 'Please input the Image note!'
      this.imageNoteValidationMsg.setErrorMessage(errorMessage)
      this.formBuilder.setAdditionalErrors([
        {
          stack: `ImageNote: ${errorMessage}`,
        },
      ])
      return errorMessage
    }
    this.imageNoteValidationMsg.setErrorMessage('')
    this.formBuilder.setAdditionalErrors([])
    return null
  }

  validate = (formData, errors, properties, allowByPass) => {
    const { validate } = this.props
    this.onImageValidation()
    this.isShowValidationError = true

    return validate && validate(formData, errors, properties, allowByPass)
  }

  handleSubmit = (values, allowByPass) => {
    const { selectedPhotos, isImageRestricted, imageNote } = this.state
    const { handleSubmit, item, onManufacturerAdd, manufacturers } = this.props
    const formData = flattenToObject(values.formData)

    let notes = {}

    Object.keys(allowByPass).forEach(key => {
      notes[key] = {
        status: allowByPass[key],
      }
    })

    if (isImageRestricted) {
      notes.image = {
        status: 'Image restricted',
        description: imageNote,
      }
    } else {
      delete notes.image
    }

    if (this.onImageValidation()) {
      this.formBuilder.scrollTo('Photo')
      return
    }

    if (
      formData.manufacturer &&
      manufacturers.indexOf(formData.manufacturer) < 0 &&
      onManufacturerAdd
    ) {
      onManufacturerAdd(formData.manufacturer)
    }

    const newFormData = removeEmptyValues({ ...item, ...formData })

    if (this.reminderNote.getNotes()) {
      notes = { ...notes, reminder: this.reminderNote.getNotes() }
    } else {
      delete notes.reminder
    }

    const data = {}
    Object.keys(newFormData).forEach(obj => {
      if (obj.startsWith('notes.')) {
        data.notes = {
          ...data.notes,
          [obj.replace('notes.', '')]: newFormData[obj],
        }
      } else {
        data.facets = { ...data.facets, [obj]: newFormData[obj] }
      }
    })

    if (data.facets && data.facets.condition) {
      const { schema } = this.props
      const field = flattenToArray(schema).find(obj => obj.key === 'condition' && obj.isFacets)
      if (field && field.options) {
        const obj = field.options.find(obj1 => obj1.code === data.facets.condition)
        data.facets.condition = obj || data.facets.condition
      }
    }

    handleSubmit({
      facets: data.facets,
      notes: { ...notes, ...data.notes },
      images: selectedPhotos,
    })
  }

  onChange = formData => {
    if (formData.Description && formData.Others) {
      this.setState(
        {
          condition: formData.Description.condition,
          installDate: formData.Others['install-date'],
        },
        () => {
          if (this.isShowValidationError) {
            this.onImageValidation()
          }
        },
      )
    }
  }

  onImageRestrictedChange = event => {
    this.setState({ isImageRestricted: event.target.checked }, () => {
      if (this.isShowValidationError) {
        this.onImageValidation()
      }
    })
  }

  onImageNoteChange = event => {
    this.setState({ imageNote: event.target.value }, () => {
      if (this.isShowValidationError) {
        this.onImageNoteValidation()
      }
    })
  }

  render() {
    const { selectedPhotos, isShowBuilder, isImageRestricted, imageNote } = this.state
    const {
      formTitle,
      schema,
      item,
      notes,
      hasDummyData,
      disabled,
      manufacturers,
      alias,
      user,
      formActions,
    } = this.props

    const keys = Object.keys(schema)

    for (let i = 0; i < keys.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      schema[keys[i]] = schema[keys[i]].map(obj => {
        const newObj = obj

        if (obj.key === 'manufacturer') {
          newObj.type = 'ManufacturerAutoBox'
          newObj.manufacturers = manufacturers
          newObj.alias = alias
        } else if (obj.key === 'barcode') {
          newObj.allowByPass = true
          newObj.lastBarcode = user.lastBarcode
        }

        if (obj.type === 'ComboBox') {
          newObj.enum = obj.options && obj.options.map(option => option.code)
        }

        if (!newObj.isFacets) {
          newObj.isFacets = newObj.element === 'facets'
        }
        newObj.element = newObj.element === 'facets' ? undefined : newObj.element

        return newObj
      })
    }

    return (
      <div>
        <div className={styles.formTitle}>{formTitle}</div>
        <div className={styles.content}>
          <div className={styles.photoContainer} id="Photo">
            <PhotoTaker
              photos={selectedPhotos.map(photo => photo.dataUri)}
              onChange={this.onPhotoSelected}
              onDelete={this.onDeletePhoto}
              readOnly={disabled}
            />
          </div>
          <ValidationMessage
            data-test-selector="photo_validation_message"
            ref={ref => {
              this.photoValidationMsg = ref
            }}
          />
          <Checkbox
            checked={isImageRestricted}
            onChange={this.onImageRestrictedChange}
            disabled={disabled}
            data-test-selector="image_restricted_checkbox"
          >
            Image restricted
          </Checkbox>
          {isImageRestricted && (
            <>
              <div className={styles.imageNoteDiv}>
                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                <label htmlFor="image_note">Image note</label>
                <Input
                  id="image_note"
                  type="text"
                  value={imageNote}
                  onChange={this.onImageNoteChange}
                  disabled={disabled}
                  data-test-selector="image_note_input"
                  autoComplete="off"
                />
              </div>
              <ValidationMessage
                data-test-selector="image_note_validation_message"
                ref={ref => {
                  this.imageNoteValidationMsg = ref
                }}
              />
            </>
          )}
          {hasDummyData && (
            <div className={styles.divDummy}>
              <Button
                type="primary"
                className={styles.btnDummy}
                onClick={this.onDummyData}
                data-test-selector="assetform_dummydata"
              >
                Dummy Data
              </Button>
            </div>
          )}
          {isShowBuilder && (
            <Form
              formInfo={schema}
              onSubmit={this.handleSubmit}
              initialValues={item}
              initialNotes={notes}
              disabled={disabled}
              validate={this.validate}
              onChange={this.onChange}
              data-test-selector="assetformbuilder_form"
              useSubmitEmbedded
              formActions={formActions}
              ref={ref => {
                this.formBuilder = ref
              }}
            >
              <ReminderNote
                ref={ref => {
                  this.reminderNote = ref
                }}
                initialValue={notes && notes.reminder}
              />
            </Form>
          )}
        </div>
      </div>
    )
  }
}

export default AssetFormGQLWrapper(AssetFormBuilder)

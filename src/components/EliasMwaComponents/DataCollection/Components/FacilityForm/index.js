import React from 'react'
import { Storage } from 'aws-amplify'
import FormBuilder from '@/components/EliasMwaComponents/Forms/Components/FormBuilder'
import PhotoTaker from '../PhotoTaker'
import ValidationMessage from '../ValidationMessage'
import { commonFormValidation } from '@/services/asset-validation'
import { updateStorage } from '@/services/utils'

import styles from './style.scss'

const { forms, tenants, aws } = window.mwa_config
class FacilityForm extends React.Component {
  state = {
    selectedPhotos: [],
  }

  componentDidMount() {
    const { initialValue } = this.props
    if (initialValue.images) {
      this.updateSelectedPhotos()
    }
  }

  componentDidUpdate(prevProps) {
    const { initialValue } = this.props

    if (initialValue !== prevProps.initialValue && initialValue) {
      this.updateSelectedPhotos()
    }
  }

  updateSelectedPhotos = () => {
    const { initialValue: facility } = this.props
    const images = facility.images || []
    updateStorage(tenants[facility.tenantId], aws.project_region)
    images.forEach(image => {
      Storage.get(image.picture.key, { download: true, level: 'public' }).then(response => {
        const arrayBufferView = new Uint8Array(response.Body)
        const blob = new Blob([arrayBufferView], { type: response.ContentType })
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        image.dataUri = imageUrl
        this.setState({
          selectedPhotos: images,
        })
      })
    })
    this.setState({
      selectedPhotos: images,
    })
  }

  onPhotoSelected = dataUri => {
    const {
      initialValue: { tenantId },
    } = this.props
    const { selectedPhotos } = this.state
    const type = dataUri.split(';')[0].split('/')[1]
    const key = `${new Date().getTime()}.${type}`
    const { assetImagesS3Bucket } = tenants[tenantId]

    this.setState({
      selectedPhotos: [
        ...selectedPhotos,
        {
          dataUri,
          picture: {
            bucket: assetImagesS3Bucket,
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

  handleSubmit = values => {
    const { handleSubmit } = this.props
    const { selectedPhotos } = this.state

    if (!selectedPhotos.length) {
      return
    }
    handleSubmit({
      ...values,
      images: selectedPhotos,
    })
  }

  onImageValidation = () => {
    let errorMessage = ''
    const { selectedPhotos } = this.state

    if (!this.photoValidationMsg || !this.formBuilder || !this.formBuilder.formRef) {
      return null
    }

    if (selectedPhotos.length === 0) {
      errorMessage = 'You should take at least one photo.'
      this.photoValidationMsg.setErrorMessage(errorMessage)
      this.formBuilder.formRef.setAdditionalErrors([
        {
          stack: `Photo: ${errorMessage}`,
        },
      ])
      return errorMessage
    }
    this.photoValidationMsg.setErrorMessage('')
    this.formBuilder.formRef.setAdditionalErrors([])
    return null
  }

  validate = (formData, errors, properties) => {
    this.onImageValidation()
    this.isShowValidationError = true
    return commonFormValidation(formData, errors, properties)
  }

  render() {
    const { initialValue, readOnly, onClose } = this.props
    const { selectedPhotos } = this.state

    return (
      <div>
        <div className={styles.photoContainer} id="Photo">
          <PhotoTaker
            photos={selectedPhotos.map(photo => photo.dataUri)}
            onChange={this.onPhotoSelected}
            onDelete={this.onDeletePhoto}
            readOnly={readOnly}
          />
        </div>
        <ValidationMessage
          data-test-selector="photo_validation_message"
          ref={ref => {
            this.photoValidationMsg = ref
          }}
        />
        <FormBuilder
          form={forms['facility-form']}
          initialValues={initialValue}
          onClose={onClose}
          onSubmit={this.handleSubmit}
          submitBtnText="Save"
          validate={this.validate}
          disabled={readOnly}
          submitDisabled={readOnly}
          submitTestSelector="facility-form-submit"
          ref={ref => {
            this.formBuilder = ref
          }}
          hideSave
        />
      </div>
    )
  }
}

export default FacilityForm

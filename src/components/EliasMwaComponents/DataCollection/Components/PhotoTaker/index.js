import React from 'react'
import { connect } from 'dva'
import { Input, Icon, Modal } from 'antd'
import Webcam from 'react-webcam'
import { Carousel } from 'react-responsive-carousel'
import uuidV4 from 'uuid/v4'

import { hasRole } from '@/services/user'

import ExifImage from '@/components/EliasMwaComponents/Host/ExifImage'
import GetCameraConfig from '@/services/configuration'
import Action from './Action'
import style from './style.scss'
import Validation from './Validation'

const mapStateToProps = ({ user }) => ({ authUser: user })
@connect(mapStateToProps)
class PhotoTaker extends React.Component {
  static defaultProps = {
    onChange: () => {},
    photos: [],
  }

  state = {
    showCameraModal: false,
    hasCamera: false,
    facingMode: { exact: 'environment' },
    selectedIdx: 0,
  }

  constructor() {
    super()
    this.currentIdx = 0
  }

  componentDidMount = () => {
    const self = this

    GetCameraConfig().then(config => {
      const {
        capabilities: { isWindows, hasCamera, facingMode },
      } = config

      self.setState({ isWindows, hasCamera, facingMode })
    })
  }

  capturePhoto = () => {
    const imageScreenShot = this.webcamRef.getScreenshot()

    this.setState(
      {
        showCameraModal: false,
      },
      () => {
        if (imageScreenShot) this.onAddPhoto(imageScreenShot)
      },
    )
  }

  handleCancel = () => {
    this.setState({ showCameraModal: false })
  }

  showImageCaptureModal = () => {
    if (this.photoValidation.handleValidationForAdd()) {
      return
    }
    this.setState({ showCameraModal: true })
  }

  onClickPhotoSelector = e => {
    if (this.photoValidation.handleValidationForAdd()) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      e.target.value = null
    }
  }

  onChange = ev => {
    const file = ev.target.files[0]
    if (!file) {
      return
    }

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      this.onAddPhoto(fileReader.result)
    }
  }

  onAddPhoto = dataURI => {
    const { onChange, photos } = this.props
    onChange(dataURI)
    this.setState({ selectedIdx: photos.length })
  }

  setCurrentIndex = idx => {
    this.currentIdx = idx
  }

  deleteImage = idx => {
    const { onDelete } = this.props
    onDelete(idx)
  }

  onDeleteImage = () => {
    const { photos } = this.props
    this.deleteImage(this.currentIdx)
    this.setState({ selectedIdx: Math.max(0, Math.min(this.currentIdx, photos.length - 2)) })
  }

  render() {
    const { photos, readOnly, authUser } = this.props
    const { roles } = authUser
    const { showCameraModal, isWindows, hasCamera, facingMode, selectedIdx } = this.state
    const isSurveyor = hasRole(roles, 'surveyor')

    const cameraCaptureButton = () => (
      <label>
        <Icon
          onClick={isWindows ? this.showImageCaptureModal : null}
          type="camera"
          className={style.uploadCamera}
          data-test-selector="add-image-icon"
        />
        {!isWindows && (
          <Input
            className={style.photoSelector}
            type="file"
            accept="image/*"
            capture="camera"
            onClick={this.onClickPhotoSelector}
            onChange={this.onChange}
            disabled={readOnly}
          />
        )}
      </label>
    )

    const filesUploadButton = () => (
      <label className="ant-btn">
        <Icon type="upload" className={style.uploadFile} data-test-selector="phototaker_add_btn" />
        Upload
        <Input
          className={style.photoSelector}
          type="file"
          accept="image/*"
          onClick={this.onClickPhotoSelector}
          onChange={this.onChange}
          disabled={readOnly}
        />
      </label>
    )

    return (
      <div className={style.photoWrapper}>
        <Modal
          title="Take a photo"
          visible={showCameraModal}
          onOk={this.capturePhoto}
          onCancel={this.handleCancel}
          okText="Take"
          width={600}
          bodyStyle={{ padding: 0 }}
          okButtonProps={{ 'data-test-selector': 'camera-capture-button' }}
        >
          <Webcam
            audio={false}
            ref={r => {
              this.webcamRef = r
            }}
            screenshotFormat="image/jpeg"
            width={600}
            videoConstraints={{
              width: 600,
              height: 600,
              facingMode,
            }}
          />
        </Modal>
        <div>Photos</div>
        <div className={style.uploadBtnsContainer}>
          {!isSurveyor && (
            <>
              {cameraCaptureButton()}
              <span className={style.splitter}>or</span>
              {filesUploadButton()}
            </>
          )}
          {isSurveyor && hasCamera && cameraCaptureButton()}
        </div>
        <Validation
          ref={ref => {
            this.photoValidation = ref
          }}
          photos={photos}
        />
        <Carousel
          infiniteLoop
          swipeable={false}
          showThumbs={false}
          onChange={idx => this.setCurrentIndex(idx)}
          selectedItem={selectedIdx}
        >
          {photos.map(photo => (
            <ExifImage key={uuidV4()} src={photo} alt="asset" />
          ))}
        </Carousel>
        {photos.length !== 0 && <Action onDeleteImage={this.onDeleteImage} />}
      </div>
    )
  }
}

export default PhotoTaker

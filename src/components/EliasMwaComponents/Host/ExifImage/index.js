import React from 'react'

class ExifImage extends React.Component {
  componentDidMount() {
    const { src } = this.props
    if (window.loadImage) {
      window.loadImage(
        src,
        img => {
          const newImage = img
          if (!newImage.style) return
          newImage.style.width = '100%'
          newImage.style.height = '100%'
          newImage.style.objectFit = 'contain'
          if (this.imageWrapper) {
            this.imageWrapper.appendChild(newImage)
          }
        },
        {
          orientation: true,
          maxWidth: 300,
          maxHeight: 300,
        },
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const { src } = this.props
    if (nextProps.src !== src) {
      if (window.loadImage) {
        window.loadImage(
          nextProps.src,
          img => {
            const newImage = img
            if (!newImage.style) return
            newImage.style.width = '100%'
            newImage.style.height = '100%'
            newImage.style.objectFit = 'contain'
            if (this.imageWrapper) {
              while (this.imageWrapper.firstChild) {
                this.imageWrapper.removeChild(this.imageWrapper.firstChild)
              }
              this.imageWrapper.appendChild(newImage)
            }
          },
          {
            orientation: true,
            maxWidth: 300,
            maxHeight: 300,
          },
        )
      }
    }
  }

  render() {
    if (window.loadImage) {
      return (
        <div
          ref={ref => {
            this.imageWrapper = ref
          }}
          {...this.props}
        />
      )
    }
    return <img alt="Asset" {...this.props} />
  }
}

export default ExifImage

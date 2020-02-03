import React from 'react'
import { Icon, Button } from 'antd'

import styles from './style.scss'

class Scan3D extends React.Component {
  componentDidMount() {
    this.showcaseIframe.setAttribute(
      'src',
      'https://my.matterport.com/show/?m=CjUsrnp7hoL&hhl=0&play=1&tiles=1',
    )
    this.showcaseIframe.onload = this.showcaseLoader
  }

  loadedShowcaseHandler = mpSdk => {
    this.mpSdk = mpSdk

    mpSdk.Model.getData().then(model => {
      this.modelData = model
    })

    mpSdk.Model.getDetails().then(details => {
      this.modelDetails = details
    })

    // Event Actions

    // mpSdk.on(mpSdk.Mattertag.Event.CLICK, (selectionSID) => {
    // mpSdk.Mattertag.getData()
    //   .then(mattertags => {
    // $.each(mattertags, (key, mattertag) => {
    //   if (mattertag.sid === selectionSID) {
    //     c(
    //       'mpSdk.Mattertag.getData() (filtered by ',
    //       selectionSID,
    //       ')',
    //       JSON.stringify(mattertag, null, 2),
    //     )
    //   }
    // })
    // })
    // .catch(() => {
    // })
    // })

    // mpSdk.on(mpSdk.Mattertag.Event.HOVER, (sid, hovering) => {
    // c('mpSdk.Mattertag.Event.HOVER', sid, ': ', JSON.stringify(hovering, null, 2), true)
    // })
  }

  moveInDirection = dir => {
    if (!this.mpSdk) return
    const { mpSdk } = this

    mpSdk.Camera.moveInDirection(dir)
  }

  rotateInDirection = dir => {
    if (!this.mpSdk) return
    const { mpSdk } = this

    const directions = {
      LEFT: [-40, 0],
      RIGHT: [40, 0],
      UP: [0, 20],
      DOWN: [0, -20],
    }

    mpSdk.Camera.rotate(directions[dir][0], directions[dir][1])
  }

  home = () => {
    if (!this.mpSdk) return
    const { mpSdk } = this

    mpSdk.Camera.getPose().then(pose => {
      if (pose.mode === 'mode.dollhouse' || pose.mode === 'mode.floorplan') {
        mpSdk.Camera.pan({ x: 0, z: 0 })
      }

      // In Inside and Outside Mode, return to first scan -- should probably make this return to the start position
      else if (pose.mode === 'mode.inside' || pose.mode === 'mode.outside') {
        mpSdk.Sweep.moveTo(this.modelData.sweeps[0].uuid)
      }
    })
  }

  showcaseLoader = () => {
    window.SHOWCASE_SDK.connect(
      this.showcaseIframe,
      '5b0dd36991cf4425bd59f2ebe07b8b66',
      '3.1',
    )
      .then(mpSdk => {
        this.loadedShowcaseHandler(mpSdk)
      })
      .catch(() => {})
  }

  render() {
    return (
      <>
        <iframe
          title="showcase_iframe"
          width="100%"
          height="480"
          src="blank.html"
          frameBorder="0"
          allowFullScreen="allowfullscreen"
          allow="vr"
          ref={ref => {
            this.showcaseIframe = ref
          }}
          className={styles.showcaseIframe}
        />
        <div className={styles.customActionsContainer}>
          <Button className={styles.customActionBtn} onClick={() => this.home()}>
            <Icon type="home" />
          </Button>
          <Button className={styles.customActionBtn} onClick={() => this.moveInDirection('LEFT')}>
            <Icon type="arrow-left" />
          </Button>
          <Button className={styles.customActionBtn} onClick={() => this.moveInDirection('RIGHT')}>
            <Icon type="arrow-right" />
          </Button>
          <Button className={styles.customActionBtn} onClick={() => this.rotateInDirection('LEFT')}>
            <Icon type="undo" />
          </Button>
          <Button
            className={styles.customActionBtn}
            onClick={() => this.rotateInDirection('RIGHT')}
          >
            <Icon type="redo" />
          </Button>
          <Button className={styles.customActionBtn} onClick={() => this.rotateInDirection('UP')}>
            <Icon type="arrow-up" />
          </Button>
          <Button className={styles.customActionBtn} onClick={() => this.rotateInDirection('DOWN')}>
            <Icon type="arrow-down" />
          </Button>
        </div>
      </>
    )
  }
}

export default Scan3D

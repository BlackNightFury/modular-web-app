export default class AssetForm {
  constructor(element) {
    this.element = element
    this.barcodeHistory = []
  }

  selectType = (type, isCardReaderShown) => {
    cy.get(`[data-test-selector="${this.element}"] .ant-select-selection--single`).click()
    if (!isCardReaderShown) {
      cy.get('.ant-select-tree-switcher')
        .first()
        .click()
      cy.get('.ant-select-tree-switcher')
        .eq(1)
        .click() 
    }
    cy.get('ul')
      .last()
      .find('li')
      .contains(type)
      .click()
  }

  createAsset = options => {
    cy.get('[data-test-selector="add_asset"]').click()
    this.selectType('Amplifier')
    cy.get('[data-test-selector="assetform_dummydata"]').click()
    cy.get('[data-test-selector="ant_select_box"]')
      .first()
      .click()
    cy.get('ul')
      .last()
      .find('li')
      .contains('B')
      .click()
    cy.get('[data-test-selector="ant_year_picker"]')
      .clear()
      .type('2019')
    if (options && options.withReminder) {
      cy.get('[data-test-selector="reminder_checkbox"]').click()
      cy.get('[data-test-selector="reminder_notes"]').type('Test Reminder Notes ')
    }
    if (options && options.untagged) {
      cy.get('[data-test-selector="barcode_input"]').clear()
      cy.get('[type="radio"]')
        .first()
        .check()
    }
    if (options && options.lastBarcodeIncrement) {
      cy.get('[data-test-selector="barcodeincreaser_button"]')
        .last()
        .click()
    }
    cy.get('[data-test-selector="barcode_input"]')
      .invoke('val')
      .then(barcode => { 
        this.barcodeHistory.push(barcode)
      })
    cy.get('[data-test-selector="form-submit"]')
      .last()
      .click()
  }

  updateAsset = () => {
    cy.get('[data-test-selector="assetstable"] .ant-table-row')
      .first()
      .click({ force: true })
    cy.get('[data-test-selector="ant_select_box"]')
      .first()
      .click()
    cy.get('ul')
      .last()
      .find('li')
      .contains('B')
      .click()
    cy.get('[data-test-selector="ant_year_picker"]')
      .clear()
      .type('2018')
    cy.fixture('amazon.jpg').then(fileContent => {
      cy.get('input[type=file]').upload(
        {
          fileContent,
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
        },
        { subjectType: 'input' },
      )
    })
    cy.get('[data-test-selector="form-submit"]')
      .last()
      .click()
  }

  createVirtualAsset = (isVAInSpace, isCardReaderShown) => {
    if (isVAInSpace) {
      cy.get('[data-test-selector="add_asset"]').click({ force: true })
    } else {
      cy.get('[data-test-selector="add_virtual_asset"]').click({ force: true })
    }
    // cy.wait(500)
    this.selectType('Card readers', isCardReaderShown)
    cy.get('[data-test-selector="ant_select_box"]').click()
    cy.get('li[role=option]')
      .contains('B')
      .click({ force: true })
    cy.get('[data-test-selector="ant_quantity_box"]').type('123')
    cy.get('[data-test-selector="ant_year_picker"]')
      .last()
      .type('2019')
    cy.get('[data-test-selector="form-submit"]')
      .last()
      .click()
    cy.get('[data-test-selector="asset-form-cancel"]')
      .last()
      .click({ force: true })
  }

  updateVirtualAsset = () => {
    cy.get('[data-test-selector="assetstable"] .ant-table-row')
      .first()
      .click({ force: true })
      .wait(500)
    cy.get('[data-test-selector="quantityincreaser_input"]')
      .last()
      .type('5', { force: true })
    cy.get('[data-test-selector="quantityincreaser_button"]')
      .last()
      .click({ force: true })
    cy.get('[data-test-selector="form-submit"]')
      .last()
      .click({ force: true })
  }

  checkIfCorrectNextBarcode = () => {
    cy.get('[data-test-selector="assetstable_row"]').then((row) => {
      const hLen = this.barcodeHistory.length
      expect(row.text().indexOf(this.barcodeHistory[hLen - 1])).to.not.equal(-1)
      expect(this.barcodeHistory[hLen - 1] - this.barcodeHistory[hLen - 2]).to.equal(1)
    })
  }
}

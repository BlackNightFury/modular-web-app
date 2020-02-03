export default class InfiniteScrollTestHelper {
  constructor() {
    this.component = null
    this.mockedProps = {}
  }

  mockEmpty() {
    this.mockedProps.data = []
  }

  mockHundred(fillData) {
    this.mockedProps.data = Array(100)
      .fill(fillData || this.defaultItem)
      .map((item, idx) => ({
        ...item,
        id: idx.toString(),
      }))
  }
}

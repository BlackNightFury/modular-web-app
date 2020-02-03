const { checkCondition } = require('./asset-validation')
const { getHierarchy } = require('./asset')

describe('asset service checking condition of image requirement', () => {
  it('Condition is A or B', () => {
    expect(checkCondition('A', '2019', 5)).toBe(false)
  })
  it('Condition is C', () => {
    expect(checkCondition('C', '2019', 5)).toBe(true)
  })
  it('Asset is in lifecycle', () => {
    expect(checkCondition('A', '2017', 6)).toBe(true)
  })
  it('Asset is not in lifecycle', () => {
    expect(checkCondition('A', '2019', 6)).toBe(false)
  })
})

describe('get hierarchies for projects', () => {
  it('Should get multiple projects hierarchies and it should be saved in localStorage', async () => {
    const localStorage = {}
    window.appsyncClient = {
      hydrated: jest.fn().mockResolvedValue(true),
      query: jest
        .fn()
        .mockResolvedValue({ data: { getHierarchy: 'GetAssetsHierarchy' } })
        .mockResolvedValueOnce({ data: { getHierarchy: '{"173": "hierarchy for 173"}' } })
        .mockResolvedValueOnce({ data: { getHierarchy: '{"214": "hierarchy for 214"}' } }),
      writeQuery: ({ variables, data }) => {
        localStorage[JSON.stringify(variables.projects)] = data
      },
    }

    const data = await getHierarchy([
      { tenantId: 'test1', projectId: 173 },
      { tenantId: 'test2', projectId: 214 },
    ])
    expect(data.length).toBe(2)
    expect(data[0]['173']).toBe('hierarchy for 173')
    expect(Object.keys(localStorage).length).toBe(3)
    expect(
      localStorage['[{"tenantId":"test1","projectId":173},{"tenantId":"test2","projectId":214}]']
        .getHierarchy,
    ).toBe('{"173":"hierarchy for 173","214":"hierarchy for 214"}')
  })
})

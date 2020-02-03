import _ from 'lodash'

export const getFormInitialValues = (form, isRoute, query) =>
  _.reduce(
    form.fieldsets || [],
    (result, fieldSet) => {
      const { questions } = fieldSet
      result = {
        ...result,
        ..._.reduce(
          questions || [],
          (groupInitialValues, question) => {
            const { visible, defaultValue, fieldName } = question
            if (defaultValue !== undefined) {
              groupInitialValues[fieldName] = defaultValue
            }

            if (isRoute && !visible) {
              if (query[fieldName]) {
                groupInitialValues[fieldName] = query[fieldName]
              }
            }

            if (question.type === 'CheckBox') {
              groupInitialValues[fieldName] =
                groupInitialValues[fieldName] === 'checked' ? 'checked' : 'unchecked'
            }
            return groupInitialValues
          },
          {},
        ),
      }
      return result
    },
    {},
  )

export const getDocLinkValues = docs =>
  docs.map(doc => ({
    ...doc,
    url: `/docs/${doc.id}.pdf`,
  }))

export const mergeForms = (form1, form2) => {
  const newForm = _.cloneDeep(form1)

  _.forEach(form2.fieldsets, value => {
    newForm.fieldsets.push(value)
  })

  return newForm
}

export default {}

export const basicPreSurvey = {
  allowRoute: false,
  header: 'New facility',
  description:
    "As this is the first time you're accessing this facility, please confirm you have read the important documentation related to this site:",
  fieldsets: [
    {
      name: 'Project: ',
      questions: [
        { fieldName: 'project_docs', type: 'DocLink', inline: true, visible: true },
        {
          description: 'I have read and understood the project documentation',
          fieldName: 'did_check_project_docs',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
      ],
    },
    {
      name: 'Facility: ',
      questions: [
        { fieldName: 'facility_docs', type: 'DocLink', inline: true, visible: true },
        {
          description: 'I have read and understood the facility documentation',
          fieldName: 'did_check_facility_docs',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
      ],
    },
  ],
}
export const completeFacility = {
  allowRoute: false,
  fieldsets: [
    {
      name: 'Complete Facility',
      properties: { columns: 2, size: 'lg' },
      questions: [
        {
          description: 'Did you have an escort',
          fieldName: 'did_you_have_escort',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to site drawings',
          fieldName: 'did_you_have_access_site_drawings',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to layout drawings',
          fieldName: 'did_you_have_access_layout_drawings',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to O and M manuals',
          fieldName: 'did_you_have_access_o_and_m_manuals',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to the water risk assessment',
          fieldName: 'did_you_have_access_water_risk_assessment',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to the fire log book',
          fieldName: 'did_you_have_access_fire_log_book',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to the gas safety records',
          fieldName: 'did_you_have_access_gas_safety_records',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to the FGAS register',
          fieldName: 'did_you_have_access_fgas_register',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to the emergency lighting log book',
          fieldName: 'did_you_have_access_emergency_lighting_log_book',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Did you have access to all areas',
          fieldName: 'did_you_have_access_all_areas',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Plant rooms locked',
          fieldName: 'plant_rooms_locked',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Have you returned the keys',
          fieldName: 'have_you_returned_the_keys',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Have you handed over the un-tagged asset tags',
          fieldName: 'have_you_handed_over_un_tagged_asset_tags',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Permits closed',
          fieldName: 'permits_closed',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
      ],
    },
    {
      name: 'Group_2',
      properties: { hideGroupLabel: true },
      questions: [
        {
          description: 'Details of escort',
          fieldName: 'details_of_escort',
          type: 'MultiLineTextBox',
          visible: true,
        },
        {
          description: 'Provide access detail',
          fieldName: 'provide_access_detail',
          type: 'MultiLineTextBox',
          visible: true,
        },
        {
          description: 'Who did you had the un-tagged asset tags over to',
          fieldName: 'who_did_you_had_un_tagges_asset_tags',
          type: 'MultiLineTextBox',
          visible: true,
        },
        {
          description: 'Executive summary',
          fieldName: 'executive_summary',
          type: 'MultiLineTextBox',
          visible: true,
        },
      ],
    },
  ],
}
export const completeSite = {
  allowRoute: false,
  fieldsets: [
    {
      name: 'Complete Site',
      properties: { columns: 2, size: 'lg' },
      questions: [
        {
          description: 'Did you have access to the site logbook',
          fieldName: 'did_you_have_access_to_the_site_logbook',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Have you signed out of the logbook',
          fieldName: 'have_you_signed_out_of_the_logbook',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
        {
          description: 'Has the survey been completed in line with the engineer brief',
          fieldName: 'has_survey_been_completed_in_line_with_engineer_brief',
          type: 'CheckBox',
          inline: true,
          visible: true,
        },
      ],
    },
  ],
}
export const testForm = {
  allowRoute: true,
  header: 'Test Form',
  fieldsets: [
    {
      name: 'Group_1',
      questions: [
        {
          description: 'This is the test question 1',
          fieldName: 'question_field_1',
          type: 'CheckBox',
          visible: true,
          defaultValue: 'checked',
        },
        {
          description: 'This is the test question 2',
          fieldName: 'question_field_2',
          type: 'TextBox',
          defaultValue: 'string',
          required: true,
          visible: true,
        },
        {
          fieldName: 'hidden_field_1',
          type: 'TextBox',
          visible: false,
          defaultValue: 'hidden_value',
        },
        {
          description: 'This is the test question 4',
          fieldName: 'question_field_4',
          type: 'TextBox',
          defaultValue: 'string',
          required: true,
          visible: true,
        },
        {
          description: 'This is the test question 5',
          fieldName: 'question_field_5',
          type: 'TextBox',
          defaultValue: 'string',
          required: true,
          visible: true,
        },
        {
          description: 'This is the test question 6',
          fieldName: 'question_field_6',
          type: 'TextBox',
          defaultValue: 'string',
          required: true,
          visible: true,
        },
        {
          description: 'This is the test question 7',
          fieldName: 'question_field_7',
          type: 'TextBox',
          defaultValue: 'string',
          required: true,
          visible: true,
        },
      ],
    },
    {
      name: 'Group_2',
      questions: [
        {
          description: 'This is the test question 3',
          fieldName: 'question_field_3',
          type: 'CheckBox',
          visible: true,
        },
      ],
    },
  ],
}

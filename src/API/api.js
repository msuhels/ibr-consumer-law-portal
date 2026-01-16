import { BackendUrl, FrontendUrl } from "../Config";

// Auth URL
export const REGISTER = "/auth/register";

// User URL
export const GET_USER_EMAIL_REGISTER = `${BackendUrl}/user/signin-user`;
export const GET_USER_DETAILS = (id) =>
  `${BackendUrl}/user/get-user-details/${id}`;
export const GET_USER_UNREAD_MESSAGES_DATA = (id) =>
  `${BackendUrl}/user/get-user-unread-messages-data/${id}`;
export const GET_PLAN_DETAILS = (id) =>
  `${BackendUrl}/user/get-plan-details/${id}`;
export const GET_USER_BILLING_DETAILS = (id) =>
  `${BackendUrl}/user/get-user-billing-details/${id}`;
export const GET_PLAIN_INFO = (id) => `${BackendUrl}/user/get-plain-info/${id}`;
export const UPDATE_USER_DETAILS = `${BackendUrl}/user/update-user-details`;
export const UPDATE_TO_ADDRESS_DETAILS = `${BackendUrl}/user/update-to-address-details`;
export const UPDATE_USER_PASSWORD = `${BackendUrl}/user/update-user-password`;
export const UPDATE_LETTER_PAYMENT = `${BackendUrl}/user/letter-payment`;
export const CHECK_EMPTY_ADDRESS = `${BackendUrl}/user/check-empty-address`;
export const UPDATE_LETTER_RESPONSE = `${BackendUrl}/user/update-letter-response`;
export const ADD_TO_ADDRESS_DATA = `${BackendUrl}/user/add-to-address-data`;
export const GET_TO_ADDRESS_DATA = (id) =>
  `${BackendUrl}/user/get-to-address-data/${id}`;
export const GET_USER_NAME_BY_ID = (id) =>
  `${BackendUrl}/user/get-user-name/${id}`;
export const UPDATE_TRIAL_USED_STATUS = `${BackendUrl}/user/update-trial-used-status`;
export const CHECK_TRIAL_USED_STATUS = `${BackendUrl}/user/check-trial-used-status`;
export const RESET_LETTER_GENERATOR = `${BackendUrl}/user/reset-letter_genrator`;
export const ADD_BILLING_DETAILS = `${BackendUrl}/user/add-billing-details`;
export const CHECK_APPLIED_COUPON = `${BackendUrl}/user/check-applied-coupon`;
export const UPDATE_COUPON_LIMIT = `${BackendUrl}/user/update-coupon-code-limit`;
export const OPEN_AI_CHAT = `${BackendUrl}/user/open-ai-chat`;
export const GET_ALL_OPEN_AI_CHAT = `${BackendUrl}/user/get-all-open-ai-chat`;
export const GET_CHAT_ID_WITH_DATA = `${BackendUrl}/user/get-chat-id-of-ai`;
export const DELETE_USER_CHAT_THREAD = `${BackendUrl}/user/delete-user-thread`;
export const GET_UNREAD_NOTIFICATION = `${BackendUrl}/user/unread-notification`;
export const MADE_READ_NOTIFICATION = `${BackendUrl}/user/made-read-notification`;
export const CHECK_USER_SUBSCRIPTION_EXIST = `${BackendUrl}/user/subscription-details-exist`;
export const GET_AGENTS_AND_AGENCY_AGENT = `${BackendUrl}/user/get-agents-and-agencyagent`;
export const GET_USER_PLAN_DETAILS = `${BackendUrl}/user/get-user-plan`;
export const CHECK_USER_SUBSCRIPTION = `${BackendUrl}/user/check-user-subscription`;
export const CHECK_USER_BILLING_DETAILS = `${BackendUrl}/user/check-user-subscription-billing-details`;
export const LOGOUT_USER = `${BackendUrl}/user/logout-user`;
export const GET_ACTIVE_VIDEOS_LINKS = `${BackendUrl}/user/add-active-video-links`;
export const REQUEST_DELETE_DATA = `${BackendUrl}/user/request-delete-data`;
export const ADD_SMTP_DETAILS = `${BackendUrl}/user/add-smtp-details`;
export const EDIT_SMTP_DETAILS = `${BackendUrl}/user/edit-smtp-details`;
export const GET_USER_SMTP_DETAILS = `${BackendUrl}/user/get-user-smtp-details`;


//
export const UPDATE_APP_BRANDING = `${BackendUrl}/branding/update-app-branding`;
export const GET_APP_BRANDING_DATA = `${BackendUrl}/branding/get-app-branding`;

// AWS URL
export const UPLOAD_DOC_AWS = `${BackendUrl}/aws/upload-doc-on-aws`;
export const GET_DOC_FROM_AWS = `${BackendUrl}/aws/get-doc-from-aws`;
export const GET_PDF_FROM_AWS = `${BackendUrl}/aws/get-pdf-from-aws`;
export const GET_DOC_LIST_FROM_AWS = `${BackendUrl}/aws/get-doc-list-from-aws`;
export const GET_LATEST_ID_DOC_FROM_AWS = `${BackendUrl}/aws/get-latest-doc-from-aws`;
export const READ_HTML_RESPONSE = `${BackendUrl}/aws/get-html-data`;
export const READ_HTML_RESPONSE_MYSCOREIQ = `${BackendUrl}/aws/get-html-data-myscoreiq`;
export const UPLOAD_IMAGES_ON_AWS = `${BackendUrl}/aws/upload-images-on-aws`;
export const UPLOAD_DOC_ON_AWS = `${BackendUrl}/aws/upload-documents-on-aws`;
export const UPLOAD_Signature_ON_AWS = `${BackendUrl}/aws/upload-signature-on-aws`;
export const SHOW_IMAGES_FROM_AWS = `${BackendUrl}/aws/show-images-from-aws`;
export const DELETE_LETTER_DOCUMENTS = `${BackendUrl}/aws/delete-letter-documents`;
export const DELETE_DOC_FROM_AWS = `${BackendUrl}/aws/delete-doc-from-aws`;

// indentity URL
export const REGISTER_IDENTITY_USER = `${BackendUrl}/identity/register-identity-user`;
export const GET_IDENTITY_USER_DETAILS = `${BackendUrl}/identity/get-identity-user`;
export const UPDATE_IDENTITY_USER_DETAILS = `${BackendUrl}/identity/update-identity-user`;
export const GET_HTML_DATA_FROM_IDENTIITY_IQ = `${BackendUrl}/identity/get-html-from-identity-platfrom`;
export const CHECK_HTML_RESPONSE = `${BackendUrl}/identity/check-html-data`;
export const GET_USER_SCORE_PROGRESS = `${BackendUrl}/identity/get_user_score_progress`;
export const DELETE_USER_SCORE_PROGRESS = `${BackendUrl}/identity/delete_user_score_progress`;
export const GET_RESPONSE_FROM_OPEN_AI = `${BackendUrl}/identity/get-response-from-open-ai`;
export const GET_AWS_DATA = (id) => `${BackendUrl}/identity/get-aws-data/${id}`;
export const DISPUTE_TO_INQUIRY = `${BackendUrl}/identity/disputeinquiry`;
export const UPDATE_AI_REPORT_STATUS = `${BackendUrl}/identity/update-ai-report-status`;
export const ADD_MULTIPLE_LETTER = `${BackendUrl}/identity/add-multiple-letter`;
export const UPDATE_AI_GENERATE_RESPONSE = `${BackendUrl}/identity/update-ai-generate-response`;
export const GET_DISPUT_RECORDS = (id) =>
  `${BackendUrl}/identity/getdispute/${id}`;
export const GET_PROCESS_DATA = `${BackendUrl}/identity/get-process-data`;
export const GET_SINGLE_PROCESS_BY_ID = `${BackendUrl}/identity/get-single-data`;
export const DOWNLOAD_REPORT_PDF = `${BackendUrl}/identity/download-report-pdf`;
export const RESOLVED_DISPUT_RECORDS = `${BackendUrl}/identity/resolved-dispute`;
export const DELETE_DISPUT_RECORDS = `${BackendUrl}/identity/delete-dispute`;
export const DELETE_RESOLVED_DISPUT_RECORDS = `${BackendUrl}/identity/delete-resolved-dispute`;
export const UPDATE_AI_RESPONSE = `${BackendUrl}/identity/update-ai-response`;
export const GET_DISPUTED_DATA_COUNT = `${BackendUrl}/identity/get-disputed-data-count`;
export const GET_LETTERS_LIST = `${BackendUrl}/identity/get-letter-list`;
export const DELETE_LETTER = `${BackendUrl}/identity/delete-letter`;
export const GET_AWS_DOCUMENT_DATA = `${BackendUrl}/aws/get-aws-documents`;
export const UPDATE_STATUS_OF_DIPUTE = `${BackendUrl}/identity/update-dispute-status`;
export const DELETE_DDISPUTE_RECORD = `${BackendUrl}/identity/delete-dispute-record`;

// CREDITORS URL
export const GET_CREDITORS_FURNISHERS_DATA = `${BackendUrl}/credit/get-creditors-furnishers-data`;
export const GET_BANK_ADDRESS = `${BackendUrl}/credit/get-creditors-furnishers-data-by-name`;
export const DELETE_CREDITORS_FURNISHERS = `${BackendUrl}/credit/delete-creditors-furnishers`;
export const ADD_CREDITORS_FURNISHERS_DATA = `${BackendUrl}/credit/add-creditors-furnishers`;
export const EDIT_CREDITORS_FURNISHERS_DATA = `${BackendUrl}/credit/edit-creditors-furnishers`;
export const UPDATE_CREDITORS_FURNISHERS_DATA = `${BackendUrl}/credit/update-creditors-furnishers`;
export const ADD_LETTER_GENERATOR = `${BackendUrl}/credit/add-letter-generator`;
export const GET_LETTERS_GENERATOR_LIST = `${BackendUrl}/credit/get-letter-generator-data`;
export const DELETE_LETTERS_GENERATOR = `${BackendUrl}/credit/delete-letter-generator-data`;
export const EDIT_LETTERS_GENERATOR = `${BackendUrl}/credit/edit-letter-generator-data`;
export const UPDATE_LETTERS_GENERATOR = `${BackendUrl}/credit/update-letter-generator-data`;
export const GET_DUMMY_CUSTOM_LETTER = `${BackendUrl}/credit/get-dummy-custom-letter`;
export const DELETE_DUMMY_LETTERS_GENERATOR = `${BackendUrl}/credit/delete-dummy-letter-generator-data`;
export const GET_ACTIVE_LETTERS_GENERATOR_LIST = `${BackendUrl}/credit/get-active-letter-generator-data`;
export const LETTERS_GENERATOR_DATA_BY_FILTER = `${BackendUrl}/credit/letter-generator-data`;

// AUTHORIZE URL

export const GET_SUBSCRIPTION_DETAILS = (id) =>
  `${BackendUrl}/authorize/get-user-subscription-details/${id}`;
export const CANCLE_SUBSCRIPTION_AFTER_END_DATE = `${BackendUrl}/authorize/cancle-user-subscription-after-enddate`;
export const CANCLE_USER_SUBSCRIPTION = `${BackendUrl}/authorize/cancle-user-subscription`;
export const UPDATE_USER_SUBSCRIPTION = `${BackendUrl}/authorize/update-user-subscription`;
export const RUN_CRON_TO_CHECK_SUBCRIPTION = `${BackendUrl}/authorize/run-cron-to-check-subscription`;
export const UPDATE_CREDIT_CARD_DETAILS = `${BackendUrl}/authorize/update-user-credit-card-details`;
export const START_USER_FREE_TRIAL = `${BackendUrl}/authorize/start-user-free-trial`;
export const GET_TRANSACTION_INFO = `${BackendUrl}/authorize/get-transaction-info`;
export const CHANGE_USER_PLAN = `${BackendUrl}/authorize/change-plan`;

// Client URL
export const ADD_CLIENT_DATA = `${BackendUrl}/client/add-client`;
export const GET_CLIENT_DATA = `${BackendUrl}/client/get-clients`;
export const SUBMIT_CLIENT_AGREEMENT = `${BackendUrl}/client/submit-client-agreement`;
export const EDIT_CLIENT_DETAILS = `${BackendUrl}/client/edit-client-data`;
export const DELETE_CLIENT = `${BackendUrl}/client/delete-client-data`;
export const UPDATE_CLIENT_DATA = `${BackendUrl}/client/update-client-data`;
export const GET_DATA_OF_USER_CLIENT = `${BackendUrl}/client/get-data-of-user-client`;
export const GET_IDENTITY_SSN_NUMBER = `${BackendUrl}/client/get-ssn-number`;
export const UPDATE_CLIENT_STAGES_OR_STATUS = `${BackendUrl}/client/update-client-stages-or-status`;
export const DEACTIVE_CLIENT = `${BackendUrl}/client/deactive-client`;
export const UPLOAD_CSV_FILE = `${BackendUrl}/client/import-csv-file`;
export const GET_ALL_LeTTER_DETAILS = `${BackendUrl}/lob/get_letter_status`;
export const CANCLE_LOB_LETTER = `${BackendUrl}/lob/cancle-letter-from-lob`;
export const GET_ALL_TRANSACTIONS = `${BackendUrl}/admin/get_all_transactions`;
export const GET_CLIENT_ACTIVITY = `${BackendUrl}/client/get-client-activity`;
export const ADD_CLIENT_AGREEMENT_CONTENT = `${BackendUrl}/client/add-client-agreement-content`;
export const GET_USER_CLIENT_AGREEMENT_DATA = `${BackendUrl}/client/get-client-agreement-content`;
export const RESEND_LOGIN_DETAILS_TO_CLIENT_BY_MAIL = `${BackendUrl}/client/resend-client-login-details-on-email`;

// Lead URL

export const ADD_LEAD_DATA = `${BackendUrl}/lead/add-lead`;
export const GET_ALL_LEAD_DATA = `${BackendUrl}/lead/get-all-leads`;
export const DELETE_LEAD = `${BackendUrl}/lead/delete-lead-data`;
export const EDIT_LEAD_DETAILS = `${BackendUrl}/lead/edit-lead-data`;
export const UPDATE_LEAD_DATA = `${BackendUrl}/lead/update-lead-data`;
export const UPLOAD_LEAD_CSV_FILE = `${BackendUrl}/lead/import-csv-file`;
export const INVITE_CLIENT_BY_EMAIL = `${BackendUrl}/lead/invite-client-by-email`;

// AFFILIATE URL

export const ADD_AFFILIATE_DATA = `${BackendUrl}/affiliate/add-affiliate`;
export const GET_AFFILIATE_DATA = `${BackendUrl}/affiliate/get-affiliate`;
export const DELETE_AFFILIATE_DATA = `${BackendUrl}/affiliate/delete-affiliate-data`;
export const EDIT_AFFILIATE_DATA = `${BackendUrl}/affiliate/edit-affiliate-data`;
export const UPDATE_AFFILIATE_DATA = `${BackendUrl}/affiliate/update-affiliate-data`;

// Admin URL
export const CREATE_USERS_ACTIVITY = `${BackendUrl}/admin/create-users-activity`;
export const GET_ALL_NOTIFICATION = `${BackendUrl}/admin/get-all-notification`;
// export const GET_DUMMY_CUSTOM_LETTER = `${BackendUrl}/admin/get-dummy-custom-letter`;
export const GET_SINGLE_DUMMY_CUSTOM_LETTER = `${BackendUrl}/admin/getone-dummy-custom-letter`;
export const DELETE_IMAGE_DOC_OF_CHAT = `${BackendUrl}/admin/delete-doc-of-chat`;

//Agent url

export const ADD_AGENT_DATA = `${BackendUrl}/agent/add-agent`;
export const GET_AGENT_DATA = `${BackendUrl}/agent/get-agents`;
export const EDIT_AGENT_DETAILS = `${BackendUrl}/agent/edit-agent-data`;
export const DELETE_AGENT = `${BackendUrl}/agent/delete-agent-data`;
export const UPDATE_AGENT_DATA = `${BackendUrl}/agent/update-agent-data`;
export const GET_COUNT_OF_AGENCY_DASHBOARD_CARDS = `${BackendUrl}/agent/get-count-of-agency-dashboard`;
export const RESEND_LOGIN_DETAILS_TO_AGENT_BY_MAIL = `${BackendUrl}/agent/resend-agent-login-details-on-email`;

//Chat url
export const START_CHATING = `${BackendUrl}/chat/start-admin-chating`;
export const SEND_MESSAGE = `${BackendUrl}/chat/send-messages`;
export const CREATE_CHAT_ROOM = `${BackendUrl}/chat/create-chat-room`;
export const GET_CHAT_USERS = (search, pageNumber) =>
  `${BackendUrl}/chat/get-chat-users?search=${search}&pageNumber=${pageNumber}`;
export const GET_MESSAGE = `${BackendUrl}/chat/get-messages`;
export const CHAT_USER = `${BackendUrl}/chat/current-chat-user`;
export const GET_SEPARATE_CHAT_USERS = (id) =>
  `${BackendUrl}/chat/get-separate-chat-users?id=${id}`;

// Todo task url

export const ADD_USER_TODO_TASK = `${BackendUrl}/todo/add-user-todo-task`;
export const GET_TODO_TASK_LIST_OF_USER = `${BackendUrl}/todo/get-user-todo-task-list`;
export const EDIT_TASK_DETAILS = `${BackendUrl}/todo/edit-user-task-details`;
export const DELETE_TODO_TASK = `${BackendUrl}/todo/delete-user-task`;
export const UPDATE_TASK_DATA = `${BackendUrl}/todo/update-user-task`;
export const UPDATE_TASK_STATUS = `${BackendUrl}/todo/update-user-task-status`;

// Get client dash dynamic buttons 
export const  BUTTON_GROUPS_BASE_URL = `${BackendUrl}/button-groups`;

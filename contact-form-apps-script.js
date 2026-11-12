/**
 * Contact Form Backend - Google Apps Script Web App
 *
 * SETUP:
 * 1. Open your Google Sheet, Extensions > Apps Script.
 * 2. Paste this whole file into Code.gs, replacing anything there.
 * 3. Deploy > New deployment > Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the /exec URL into ENDPOINT in assets/js/contact-form.js
 * 5. After any edit: Deploy > Manage deployments > Edit > New version.
 *    Otherwise the old code keeps running.
 *
 * Writes submissions to a "Contact Submissions" tab and emails
 * reachevbotafranklin@gmail.com a copy.
 */

// ==== CONFIG ============================================================
var SHEET_NAME = 'Contact Submissions';
var NOTIFY_EMAIL = 'reachevbotafranklin@gmail.com';
// Your sheet ID (from its URL). Used when no Script Property is set.
var DEFAULT_SPREADSHEET_ID = '15WOKbELCc4ZWKegbXeGRT28ysxWPE2izVcMu9iDLL28';

// Optional: Project Settings > Script Properties > SPREADSHEET_ID = <your id>
function openSheet_() {
  var id = DEFAULT_SPREADSHEET_ID;
  try {
    var props = PropertiesService.getScriptProperties();
    var configured = props.getProperty('SPREADSHEET_ID');
    if (configured) id = configured;
  } catch (e) { /* keep default */ }

  var ss = null;
  try {
    ss = SpreadsheetApp.openById(id); // works for standalone scripts
  } catch (e1) {
    ss = null;
  }
  if (!ss) {
    ss = SpreadsheetApp.getActiveSpreadsheet(); // container-bound fallback
  }
  if (!ss) throw new Error('Cannot open spreadsheet: ' + id);

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, service: 'contact-form', now: new Date().toISOString() });
}

function trim_(v) {
  return (v === null || v === undefined) ? '' : String(v).trim();
}

function parseBody_(e) {
  if (!e || !e.postData) return {};
  var type = e.postData.type || '';
  var contents = e.postData.contents;
  if (type.indexOf('json') !== -1) {
    try { return JSON.parse(contents); } catch (err) { return {}; }
  }
  if (type.indexOf('form') !== -1) {
    var params = e.parameter || {};
    var out = {};
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) out[k] = params[k];
    }
    return out;
  }
  try { return JSON.parse(contents); } catch (err2) { return e.parameter || {}; }
}

function doPost(e) {
  try {
    var data = parseBody_(e);

    var name = trim_(data.name);
    var email = trim_(data.email);
    var message = trim_(data.message);
    var website = trim_(data.website); // honeypot

    if (website) {
      // Bot filled hidden field: pretend success, do nothing.
      return json_({ ok: true });
    }
    if (!name || !email || !message) {
      return json_({ ok: false, error: 'Name, email and message are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, error: 'Please enter a valid email address.' });
    }

    var now = new Date();
    var sheet = openSheet_();
    var header = ['Timestamp', 'Name', 'Email', 'Message'];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(header);
    }
    sheet.appendRow([now, name, email, message]);

    var subject = 'New contact form submission from ' + name;
    var body =
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Time: ' + now.toString() + '\n\n' +
      'Message:\n' + message;

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return json_({ ok: true, saved: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

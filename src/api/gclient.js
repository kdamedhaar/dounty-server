const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis')
require('dotenv').config()

async function main() {
    const auth = new GoogleAuth({
      scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive'
      ]
    });
    const client = await auth.getClient();
    const sheetsService =  google.sheets({version: 'v4', auth});
    const driveService =  google.drive({version: 'v3', auth})
   
    let spreadsheetId = await create("GPS DATA", sheetsService)
    console.log("New spreadsheet - ", spreadsheetId)
    await transferOwnership(spreadsheetId, "manan14patel@gmail.com", driveService)
}

async function transferOwnership(spreadsheetId, newOwnerEmail, driveService){
    return new Promise((resolve, reject) => {

        //create permissions object
        driveService.permissions.create({
          fileId: spreadsheetId,
          transferOwnership: true,
          emailMessage: "Congratulations !! You are now owner of this file",
          requestBody: {
              "type": "user",
              "role": "owner",
              "emailAddress": newOwnerEmail,
              "moveToNewOwnersRoot": true,
              "sendNotificationEmail": true
          }
        }, (err, result) =>{
            if (err) {
              // Handle error.
              console.log(err);
              // [START_EXCLUDE silent]
              reject(err);
              // [END_EXCLUDE]
            } else {
                console.log(result)
             
              resolve(null);
              // [END_EXCLUDE]
            }
          });

       
    })

}

async function create(title, service) {
    return new Promise((resolve, reject) => {
      // [START sheets_create]
      const resource = {
        properties: {
          title,
        },
      };
      service.spreadsheets.create({
        resource,
        fields: 'spreadsheetId',
      }, (err, spreadsheet) =>{
        if (err) {
          // Handle error.
          console.log(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
            console.log(spreadsheet)
          console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
          // [START_EXCLUDE silent]
          resolve(spreadsheet.data.spreadsheetId);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_create]
    });
  }

  main()
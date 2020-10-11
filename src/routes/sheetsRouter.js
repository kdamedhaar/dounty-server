/**
 * router to handle all brizo related routes
 */
import express from 'express';
import { default as uuidv1 } from 'uuid/v1'
import { validator as validate } from '../middlewares';
import { AddOappSchema, UpdateStatusSchema, UpdateLikesSchema } from '../schemas';
import { Sheets } from '../api';
import { logger } from '../middlewares/logger';
import {
  sendSubmissionEmail,
  sendApprovalEmail,
  sendAdminEmail,
  sendRejectionEmail
} from '../middlewares/emailer'

const sheetsRouter = express.Router();
const sheetsApi = new Sheets();


sheetsRouter.get('/reject',
  validate({ query: UpdateStatusSchema }),
  async (req, res, next) => {
    try {
      let data = req.query
      console.log(`Data - ` + data)
      res.redirect(`${process.env.CLIENT_BASE_URL}/reject?id=${data.id}`)
    }
    catch (error) {
      next(new Error(error));
    }
  });



sheetsRouter.get('/state',
  validate({ query: UpdateStatusSchema }),
  async (req, res, next) => {
    try {
      let data = req.query
      console.log(`Data - ` + data)
      let status = await sheetsApi.updateOappStatus(data.id, data.status, data.reason);

      console.log(status)
      if (status == 200) {

        //get oapp details
        let oapp = await sheetsApi.getOappWithId(data.id)
        //send update email
        if (data.status.toLowerCase() == "approved") {
          sendApprovalEmail(oapp.email, oapp.name, oapp.category)
        } else if (data.status.toLowerCase() == "rejected") {
          sendRejectionEmail(oapp.email, oapp.name, oapp.rejectionreason)
        }
        //redirect to successful action page
        res.status(200).json({ status: true })
      }
      else if (status == 404) {
        res.status(404).json({ status: false, message: `Oapp with id ${req.query.id} doesn't exist` })
      }
      else {
        res.status(500).json({ status: false, message: `Unable to update oapp with id ${req.body.id}. Please try again` })
      }
    }
    catch (error) {
      next(new Error(error));
    }
  });

sheetsRouter.put('/likes',
  validate({ body: UpdateLikesSchema }),
  async (req, res, next) => {
    try {
      let data = req.body
      console.log(`Data - ` + data)
      let status = await sheetsApi.updateOappLikes(data.id, data.likes);

      console.log(status)
      if (status == 200) {

        //get oapp details
        let oapp = await sheetsApi.getOappWithId(data.id)
        //send update email
        if (data.status.toLowerCase() == "approved") {
          sendApprovalEmail(oapp.email, oapp.name, oapp.category)
        } else if (data.status.toLowerCase() == "rejected") {
          sendRejectionEmail(oapp.email, oapp.name, oapp.rejectionreason)
        }
        //redirect to successful action page
        res.status(200).json({ status: true })
      }
      else if (status == 404) {
        res.status(404).json({ status: false, message: `Oapp with id ${req.query.id} doesn't exist` })
      }
      else {
        res.status(500).json({ status: false, message: `Unable to update oapp with id ${req.body.id}. Please try again` })
      }
    }
    catch (error) {
      next(new Error(error));
    }
  });

sheetsRouter.post('/',
  validate({ body: AddOappSchema }),
  async (req, res, next) => {
    try {
      let data = req.body
      data.id = uuidv1().replace("-", "")
      data.status = "submitted"
      console.log(data)

      let status = await sheetsApi.addOapp(data)
      if (status == 200) {
        //send confirmation email
        sendSubmissionEmail(data.email, data.name, data.id)
        res.status(200).json({ status: true })
      }
      else {
        res.status(500).json({ status: false, message: "Unable to submit oapp. Please try again" })
      }
    }
    catch (error) {
      next(new Error(error));
    }
  });

sheetsRouter.get('/confirm',
  async (req, res, next) => {
    try {
      let status = await sheetsApi.updateOappStatus(req.query.id, "pending review", "");
      if (status == 200) {
        //get oapp details
        let oapp = await sheetsApi.getOappWithId(req.query.id)

        //send admin email for review
        sendAdminEmail(process.env.ADMIN_EMAIL, oapp)
        res.status(200).json({ id })
      }
      else {
        res.status(500).json({ status: false, message: "Unable to submit oapp. Please try again" })
      }

    }
    catch (error) {
      next(new Error(error));
    }
  });

sheetsRouter.get('/',
  async (req, res, next) => {
    try {
      let oapps = await sheetsApi.getAllOapps();
      console.log(oapps)
      res.status(200).json({ oapps });

    }
    catch (error) {
      next(new Error(error));
    }
  });

sheetsRouter.get('/:id',
  async (req, res, next) => {
    try {
      let oapp = await sheetsApi.getOappWithId(req.params.id);
      console.log(oapp)
      if (oapp == 404) {
        res.status(404).json({ status: false, message: `Oapp with id ${req.params.id} not found` })
      } else {
        res.status(200).json({ oapp })
      }

    }
    catch (error) {
      next(new Error(error));
    }
  });



export default sheetsRouter;

import express from "express"
import Web3 from "web3"
import { default as uuidv1 } from "uuid/v1"
import { validator as validate } from "../middlewares"
import { logger } from "../middlewares/logger"
import axios from "axios"
require("dotenv").config()
import {
  getBounties,
  getBountyDetails,
  saveBounty,
  updateBounty
} from "../../db"

import { Ocean, Config } from "@oceanprotocol/lib"
import { resolve } from "dns"
import { rejects } from "assert"

const router = express.Router()
const web3 = new Web3(process.env.NODE_PROVIDER)
const oceanProviderUrl = process.env.OCEAN_PROVIDER
const oceanAquariusUrl = process.env.OCEAN_AQUARIUS
const privateKey = process.env.PRIVATE_KEY
const walletAddress = process.env.WALLET_ADDRESS

const config = new Config({
  metadataCacheUri: oceanAquariusUrl,
  providerUri: oceanProviderUrl
})

router.get("/", async (req, res, next) => {
  try {
    let bounties = await getBounties()
    res.status(200).json({ status: true, data: bounties })
  } catch (error) {
    next(new Error(error))
  }
})

router.get("/bounty/:id", async (req, res, next) => {
  try {
    console.log(req.params.id)
    let details = await getBountyDetails(req.params.id)
    res.status(200).json({ status: true, data: details })
  } catch (error) {
    next(new Error(error))
  }
})

router.post("/bounty", async (req, res, next) => {
  try {
    console.log(req.body)
    let saved = await saveBounty(req.body)
    res.status(200).json({ status: true, data: saved })
  } catch (error) {
    console.error(error)
    next(new Error(error))
  }
})

router.post("/update", async (req, res, next) => {
  try {
    let updated = await updateBounty(req.body)
    res.status(200).json({ status: true, data: updated })
  } catch (error) {
    console.error(error)
    next(new Error(error))
  }
})
export default router

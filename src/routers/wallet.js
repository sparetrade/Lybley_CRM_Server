const express = require("express")

const {addWallet,getAllWallet,getWalletById,getTransactionByBrandId,getAllTransaction,getTransactionByCenterId,getWalletByCenterId,editWallet,deleteWallet}=require("../controllers/walletController")

const router=express.Router()

router.post("/addWallet",addWallet)
router.get("/getAllWallet",getAllWallet)
router.get("/getWalletById/:id",getWalletById)
router.get("/getWalletByCenterId/:id",getWalletByCenterId)
router.get("/getAllTransaction",getAllTransaction)
router.get("/getTransactionByBrandId/:id",getTransactionByBrandId)
router.get("/getTransactionByCenterId/:id",getTransactionByCenterId)
router.patch("/editWallet/:id",editWallet)
router.delete("/deleteWallet/:id",deleteWallet)

module.exports=router;
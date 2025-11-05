import express from 'express'
import { fetchLandByUserId, getAllLands, getAllUser, getLandById, getUserById } from '../controllers/adminController';

const AdminRoute = express.Router()

AdminRoute.get("/getUsers", getAllUser)
AdminRoute.get("/getUser/:userId", getUserById)
AdminRoute.get("/getLands", getAllLands)
AdminRoute.get("/getLand/:landId", getLandById)
AdminRoute.get("/getUsersLand", fetchLandByUserId)

export default AdminRoute;
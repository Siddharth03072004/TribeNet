import {Router} from "express";
import { acceptConnectionRequest, downloadProfile, getAllUserProfile, getMyConnectionRequest, getUserAndProfile, getUserProfileAndUserBasedOnUsername, register, sendConnectionRequest, updateProfileData, updateUserProfile, uploadProfilePicture, whatAreMyConnections } from "../contollers/user.controller.js";
import { login } from "../contollers/user.controller.js";
import multer from "multer";

const router = Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.route('/upload_profile_picture').post(upload.single('profile_picture'), uploadProfilePicture);

router.route('/register').post(register);
router.route('/login').post(login);

router.route('/user_update').post(updateUserProfile);

router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.route('/get_all_user_profiles').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route('/user/send_connection_request').post(sendConnectionRequest);
router.route('/user/getConnectionsRequest').get(getMyConnectionRequest)
router.route('/user/user_connection_request').get(whatAreMyConnections)
router.route('/user/accept_connection_request').post(acceptConnectionRequest)
router.route('/user/get_profile_based_on_username').get(getUserProfileAndUserBasedOnUsername);

export default router;